import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { sampleBase } from '../utils/sampleData';
import type { Base, Field, View, CellValue, FilterConfig, SortConfig, GroupConfig, FieldType, SelectOption } from '../types';

interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  searchQuery: string;
  expandedRecordId: string | null;
  editingCell: { recordId: string; fieldId: string } | null;
  addFieldModalOpen: boolean;
  filterPanelOpen: boolean;
  sortPanelOpen: boolean;
  groupPanelOpen: boolean;
  hiddenFieldsPanelOpen: boolean;
  rowColorPanelOpen: boolean;
  contextMenu: { x: number; y: number; recordId: string; fieldId: string } | null;
  fieldContextMenu: { x: number; y: number; fieldId: string } | null;
}

interface AppState {
  bases: Base[];
  activeBaseId: string;
  ui: UIState;

  getActiveBase: () => Base;
  getActiveTable: () => Base['tables'][0];
  getActiveView: () => View;

  setActiveBase: (baseId: string) => void;
  setActiveTable: (tableId: string) => void;
  setActiveView: (viewId: string) => void;

  addTable: (name: string) => void;
  deleteTable: (tableId: string) => void;
  renameTable: (tableId: string, name: string) => void;

  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
  resizeField: (fieldId: string, width: number) => void;

  addRecord: (cells?: { [fieldId: string]: CellValue }) => void;
  updateCell: (recordId: string, fieldId: string, value: CellValue) => void;
  deleteRecord: (recordId: string) => void;
  duplicateRecord: (recordId: string) => void;

  addView: (name: string, type: View['type']) => void;
  deleteView: (viewId: string) => void;
  renameView: (viewId: string, name: string) => void;

  addFilter: (filter: FilterConfig) => void;
  removeFilter: (index: number) => void;
  updateFilter: (index: number, filter: FilterConfig) => void;

  addSort: (sort: SortConfig) => void;
  removeSort: (index: number) => void;
  updateSort: (index: number, sort: SortConfig) => void;

  addGroup: (group: GroupConfig) => void;
  removeGroup: (index: number) => void;

  toggleFieldVisibility: (fieldId: string) => void;

  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setExpandedRecordId: (recordId: string | null) => void;
  setEditingCell: (cell: { recordId: string; fieldId: string } | null) => void;
  setAddFieldModalOpen: (open: boolean) => void;
  setFilterPanelOpen: (open: boolean) => void;
  setSortPanelOpen: (open: boolean) => void;
  setGroupPanelOpen: (open: boolean) => void;
  setHiddenFieldsPanelOpen: (open: boolean) => void;
  setRowColorPanelOpen: (open: boolean) => void;
  setContextMenu: (menu: UIState['contextMenu']) => void;
  setFieldContextMenu: (menu: UIState['fieldContextMenu']) => void;

  addSelectOption: (fieldId: string, option: Omit<SelectOption, 'id'>) => void;
}

const useStore = create<AppState>((set, get) => ({
  bases: [sampleBase],
  activeBaseId: sampleBase.id,
  ui: {
    sidebarOpen: true,
    searchOpen: false,
    searchQuery: '',
    expandedRecordId: null,
    editingCell: null,
    addFieldModalOpen: false,
    filterPanelOpen: false,
    sortPanelOpen: false,
    groupPanelOpen: false,
    hiddenFieldsPanelOpen: false,
    rowColorPanelOpen: false,
    contextMenu: null,
    fieldContextMenu: null,
  },

  getActiveBase: () => {
    const state = get();
    return state.bases.find(b => b.id === state.activeBaseId) ?? state.bases[0];
  },

  getActiveTable: () => {
    const base = get().getActiveBase();
    return base.tables.find(t => t.id === base.activeTableId) ?? base.tables[0];
  },

  getActiveView: () => {
    const table = get().getActiveTable();
    return table.views.find(v => v.id === table.activeViewId) ?? table.views[0];
  },

  setActiveBase: (baseId) => set({ activeBaseId: baseId }),

  setActiveTable: (tableId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? { ...b, activeTableId: tableId } : b),
  })),

  setActiveView: (viewId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? { ...t, activeViewId: viewId } : t),
    } : b),
  })),

  addTable: (name) => {
    const id = `tbl_${uuid().slice(0, 8)}`;
    const viewId = uuid();
    const primaryFieldId = `fld_${uuid().slice(0, 8)}`;
    const newTable = {
      id,
      name,
      fields: [
        { id: primaryFieldId, name: 'Name', type: 'singleLineText' as FieldType, width: 260, isPrimary: true },
        { id: `fld_${uuid().slice(0, 8)}`, name: 'Notes', type: 'multilineText' as FieldType, width: 200 },
        { id: `fld_${uuid().slice(0, 8)}`, name: 'Status', type: 'singleSelect' as FieldType, width: 150, options: [
          { id: uuid(), name: 'Todo', color: 'redLight' },
          { id: uuid(), name: 'In progress', color: 'yellowLight' },
          { id: uuid(), name: 'Done', color: 'greenLight' },
        ]},
      ],
      records: [
        { id: uuid(), cells: {}, createdTime: new Date().toISOString() },
        { id: uuid(), cells: {}, createdTime: new Date().toISOString() },
        { id: uuid(), cells: {}, createdTime: new Date().toISOString() },
      ],
      views: [{ id: viewId, name: 'Grid view', type: 'grid' as const, filters: [], sorts: [], groups: [], hiddenFieldIds: [] }],
      activeViewId: viewId,
    };
    set(state => ({
      bases: state.bases.map(b => b.id === state.activeBaseId ? {
        ...b, tables: [...b.tables, newTable], activeTableId: id,
      } : b),
    }));
  },

  deleteTable: (tableId) => set(state => ({
    bases: state.bases.map(b => {
      if (b.id !== state.activeBaseId) return b;
      const tables = b.tables.filter(t => t.id !== tableId);
      return { ...b, tables, activeTableId: tables[0]?.id ?? '' };
    }),
  })),

  renameTable: (tableId, name) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === tableId ? { ...t, name } : t),
    } : b),
  })),

  addField: (field) => {
    const id = `fld_${uuid().slice(0, 8)}`;
    set(state => ({
      bases: state.bases.map(b => b.id === state.activeBaseId ? {
        ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
          ...t, fields: [...t.fields, { ...field, id }],
        } : t),
      } : b),
    }));
  },

  updateField: (fieldId, updates) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, fields: t.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
      } : t),
    } : b),
  })),

  deleteField: (fieldId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t,
        fields: t.fields.filter(f => f.id !== fieldId),
        records: t.records.map(r => {
          const cells = { ...r.cells };
          delete cells[fieldId];
          return { ...r, cells };
        }),
      } : t),
    } : b),
  })),

  resizeField: (fieldId, width) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, fields: t.fields.map(f => f.id === fieldId ? { ...f, width: Math.max(80, width) } : f),
      } : t),
    } : b),
  })),

  addRecord: (cells) => {
    const id = uuid();
    set(state => ({
      bases: state.bases.map(b => b.id === state.activeBaseId ? {
        ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
          ...t, records: [...t.records, { id, cells: cells ?? {}, createdTime: new Date().toISOString() }],
        } : t),
      } : b),
    }));
  },

  updateCell: (recordId, fieldId, value) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, records: t.records.map(r => r.id === recordId ? { ...r, cells: { ...r.cells, [fieldId]: value } } : r),
      } : t),
    } : b),
  })),

  deleteRecord: (recordId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, records: t.records.filter(r => r.id !== recordId),
      } : t),
    } : b),
  })),

  duplicateRecord: (recordId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => {
        if (t.id !== b.activeTableId) return t;
        const src = t.records.find(r => r.id === recordId);
        if (!src) return t;
        const idx = t.records.findIndex(r => r.id === recordId);
        const dup = { id: uuid(), cells: { ...src.cells }, createdTime: new Date().toISOString() };
        const records = [...t.records];
        records.splice(idx + 1, 0, dup);
        return { ...t, records };
      }),
    } : b),
  })),

  addView: (name, type) => {
    const id = uuid();
    set(state => ({
      bases: state.bases.map(b => b.id === state.activeBaseId ? {
        ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
          ...t,
          views: [...t.views, { id, name, type, filters: [], sorts: [], groups: [], hiddenFieldIds: [] }],
          activeViewId: id,
        } : t),
      } : b),
    }));
  },

  deleteView: (viewId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => {
        if (t.id !== b.activeTableId) return t;
        const views = t.views.filter(v => v.id !== viewId);
        return { ...t, views, activeViewId: views[0]?.id ?? '' };
      }),
    } : b),
  })),

  renameView: (viewId, name) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === viewId ? { ...v, name } : v),
      } : t),
    } : b),
  })),

  addFilter: (filter) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, filters: [...v.filters, filter] } : v),
      } : t),
    } : b),
  })),

  removeFilter: (index) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, filters: v.filters.filter((_, i) => i !== index) } : v),
      } : t),
    } : b),
  })),

  updateFilter: (index, filter) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? {
          ...v, filters: v.filters.map((f, i) => i === index ? filter : f),
        } : v),
      } : t),
    } : b),
  })),

  addSort: (sort) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, sorts: [...v.sorts, sort] } : v),
      } : t),
    } : b),
  })),

  removeSort: (index) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, sorts: v.sorts.filter((_, i) => i !== index) } : v),
      } : t),
    } : b),
  })),

  updateSort: (index, sort) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? {
          ...v, sorts: v.sorts.map((s, i) => i === index ? sort : s),
        } : v),
      } : t),
    } : b),
  })),

  addGroup: (group) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, groups: [...v.groups, group] } : v),
      } : t),
    } : b),
  })),

  removeGroup: (index) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => v.id === t.activeViewId ? { ...v, groups: v.groups.filter((_, i) => i !== index) } : v),
      } : t),
    } : b),
  })),

  toggleFieldVisibility: (fieldId) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, views: t.views.map(v => {
          if (v.id !== t.activeViewId) return v;
          const hidden = v.hiddenFieldIds.includes(fieldId)
            ? v.hiddenFieldIds.filter(id => id !== fieldId)
            : [...v.hiddenFieldIds, fieldId];
          return { ...v, hiddenFieldIds: hidden };
        }),
      } : t),
    } : b),
  })),

  setSidebarOpen: (open) => set(state => ({ ui: { ...state.ui, sidebarOpen: open } })),
  setSearchOpen: (open) => set(state => ({ ui: { ...state.ui, searchOpen: open, searchQuery: open ? state.ui.searchQuery : '' } })),
  setSearchQuery: (query) => set(state => ({ ui: { ...state.ui, searchQuery: query } })),
  setExpandedRecordId: (recordId) => set(state => ({ ui: { ...state.ui, expandedRecordId: recordId } })),
  setEditingCell: (cell) => set(state => ({ ui: { ...state.ui, editingCell: cell } })),
  setAddFieldModalOpen: (open) => set(state => ({ ui: { ...state.ui, addFieldModalOpen: open } })),
  setFilterPanelOpen: (open) => set(state => ({ ui: { ...state.ui, filterPanelOpen: open } })),
  setSortPanelOpen: (open) => set(state => ({ ui: { ...state.ui, sortPanelOpen: open } })),
  setGroupPanelOpen: (open) => set(state => ({ ui: { ...state.ui, groupPanelOpen: open } })),
  setHiddenFieldsPanelOpen: (open) => set(state => ({ ui: { ...state.ui, hiddenFieldsPanelOpen: open } })),
  setRowColorPanelOpen: (open) => set(state => ({ ui: { ...state.ui, rowColorPanelOpen: open } })),
  setContextMenu: (menu) => set(state => ({ ui: { ...state.ui, contextMenu: menu } })),
  setFieldContextMenu: (menu) => set(state => ({ ui: { ...state.ui, fieldContextMenu: menu } })),

  addSelectOption: (fieldId, option) => set(state => ({
    bases: state.bases.map(b => b.id === state.activeBaseId ? {
      ...b, tables: b.tables.map(t => t.id === b.activeTableId ? {
        ...t, fields: t.fields.map(f => f.id === fieldId ? {
          ...f, options: [...(f.options ?? []), { ...option, id: uuid() }],
        } : f),
      } : t),
    } : b),
  })),
}));

export default useStore;
