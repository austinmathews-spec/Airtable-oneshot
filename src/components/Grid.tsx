import { useRef, useState, useCallback } from 'react';
import { Expand, Plus, Trash2, Copy, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import useStore from '../store/useStore';
import FieldTypeIcon from './FieldTypeIcon';
import GridCell from './GridCell';
import { applySorts, applyFilters, applyGroups, applySearch } from '../utils/helpers';

export default function Grid() {
  const table = useStore(s => s.getActiveTable());
  const view = useStore(s => s.getActiveView());
  const ui = useStore(s => s.ui);
  const setEditingCell = useStore(s => s.setEditingCell);
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);
  const setAddFieldModalOpen = useStore(s => s.setAddFieldModalOpen);
  const addRecord = useStore(s => s.addRecord);
  const resizeField = useStore(s => s.resizeField);
  const setContextMenu = useStore(s => s.setContextMenu);
  const setFieldContextMenu = useStore(s => s.setFieldContextMenu);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setResizing] = useState<{ fieldId: string; startX: number; startWidth: number } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const visibleFields = table.fields.filter(f => !view.hiddenFieldIds.includes(f.id));

  let processedRecords = table.records;
  processedRecords = applyFilters(processedRecords, view.filters);
  processedRecords = applySorts(processedRecords, view.sorts, table.fields);
  processedRecords = applySearch(processedRecords, ui.searchQuery, table.fields);

  const groups = applyGroups(processedRecords, view.groups, table.fields);

  const handleResizeStart = useCallback((fieldId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const field = visibleFields.find(f => f.id === fieldId);
    if (!field) return;
    const startX = e.clientX;
    const startWidth = field.width;
    setResizing({ fieldId, startX, startWidth });

    const handleMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      resizeField(fieldId, startWidth + diff);
    };
    const handleUp = () => {
      setResizing(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [visibleFields, resizeField]);

  const totalWidth = visibleFields.reduce((sum, f) => sum + f.width, 0) + 66 + 100;

  return (
    <div className="flex-1 overflow-auto bg-white" ref={scrollRef}>
      <div style={{ minWidth: totalWidth }}>
        {/* Header row */}
        <div className="flex h-[32px] bg-[#F5F5F5] border-b border-[#DCDCDC] sticky top-0 z-10">
          {/* Row number header */}
          <div className="w-[66px] min-w-[66px] flex items-center justify-center border-r border-[#DCDCDC] bg-[#F5F5F5]">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#D4D4D4] cursor-pointer accent-[#2D7FF9]" />
          </div>

          {/* Column headers */}
          {visibleFields.map((field) => (
            <div
              key={field.id}
              className="relative flex items-center border-r border-[#DCDCDC] bg-[#F5F5F5] group select-none"
              style={{ width: field.width, minWidth: field.width }}
            >
              <div
                className="flex items-center gap-1.5 px-2 flex-1 min-w-0 cursor-pointer h-full"
                onClick={(e) => {
                  setFieldContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    fieldId: field.id,
                  });
                }}
              >
                <FieldTypeIcon type={field.type} size={14} />
                <span className="text-[12px] font-medium text-[#333] truncate">{field.name}</span>
                {view.sorts.some(s => s.fieldId === field.id) && (
                  <span className="text-[10px] text-[#2D7FF9]">
                    {view.sorts.find(s => s.fieldId === field.id)?.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>

              {/* Dropdown indicator */}
              <button
                className="p-0.5 mr-1 rounded hover:bg-[#E0E0E0] opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setFieldContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    fieldId: field.id,
                  });
                }}
              >
                <ChevronDown size={12} className="text-[#666]" />
              </button>

              {/* Resize handle */}
              <div
                className="absolute right-0 top-0 w-[4px] h-full cursor-col-resize hover:bg-[#2D7FF9] z-10"
                onMouseDown={(e) => handleResizeStart(field.id, e)}
              />
            </div>
          ))}

          {/* Add field header */}
          <div
            className="w-[100px] min-w-[100px] flex items-center justify-center border-r border-[#DCDCDC] bg-[#F5F5F5] cursor-pointer hover:bg-[#EBEBEB]"
            onClick={() => setAddFieldModalOpen(true)}
          >
            <Plus size={16} className="text-[#666]" />
          </div>
        </div>

        {/* Data rows */}
        {groups.map((group, gi) => (
          <div key={gi}>
            {/* Group header */}
            {group.groupKey && (
              <div className="flex items-center h-[28px] bg-[#F8F8F8] border-b border-[#E8E8E8] px-3 gap-2 sticky top-[32px] z-[5]">
                <ChevronDown size={14} className="text-[#666]" />
                <span className="text-[12px] font-semibold text-[#333]">{group.groupKey}</span>
                <span className="text-[11px] text-[#999]">({group.records.length})</span>
              </div>
            )}

            {group.records.map((record, rowIndex) => {
              const globalIndex = gi > 0
                ? groups.slice(0, gi).reduce((sum, g) => sum + g.records.length, 0) + rowIndex
                : rowIndex;
              const isHovered = hoveredRow === record.id;

              return (
                <div
                  key={record.id}
                  className={`flex h-[32px] border-b border-[#ECECEC] ${isHovered ? 'bg-[#F8F8FF]' : ''}`}
                  onMouseEnter={() => setHoveredRow(record.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, recordId: record.id, fieldId: visibleFields[0]?.id ?? '' });
                  }}
                >
                  {/* Row number */}
                  <div className="w-[66px] min-w-[66px] flex items-center border-r border-[#ECECEC] bg-white group/row">
                    <div className="w-[32px] flex items-center justify-center">
                      {isHovered ? (
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#D4D4D4] cursor-pointer accent-[#2D7FF9]" />
                      ) : (
                        <span className="text-[11px] text-[#AAAAAA]">{globalIndex + 1}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedRecordId(record.id)}
                      className={`p-0.5 rounded hover:bg-[#E8E8E8] ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                    >
                      <Expand size={12} className="text-[#2D7FF9]" />
                    </button>
                  </div>

                  {/* Data cells */}
                  {visibleFields.map((field) => {
                    const isEditing = ui.editingCell?.recordId === record.id && ui.editingCell?.fieldId === field.id;
                    return (
                      <div
                        key={field.id}
                        className={`relative border-r border-[#ECECEC] overflow-visible ${
                          isEditing ? 'ring-2 ring-[#2D7FF9] ring-inset z-20' : ''
                        } ${field.isPrimary && !isEditing ? 'font-medium' : ''}`}
                        style={{ width: field.width, minWidth: field.width }}
                        onClick={() => {
                          if (!isEditing && field.type !== 'checkbox' && field.type !== 'rating') {
                            setEditingCell({ recordId: record.id, fieldId: field.id });
                          }
                        }}
                      >
                        <GridCell
                          recordId={record.id}
                          field={field}
                          value={record.cells[field.id]}
                          isEditing={isEditing}
                        />
                      </div>
                    );
                  })}

                  {/* Empty space after last column */}
                  <div className="w-[100px] min-w-[100px] border-r border-[#ECECEC]" />
                </div>
              );
            })}
          </div>
        ))}

        {/* Add record row */}
        <div
          className="flex h-[32px] border-b border-[#ECECEC] cursor-pointer hover:bg-[#F8F8FF] group"
          onClick={() => addRecord()}
        >
          <div className="w-[66px] min-w-[66px] flex items-center justify-center border-r border-[#ECECEC]">
            <Plus size={14} className="text-[#AAAAAA] group-hover:text-[#2D7FF9]" />
          </div>
          <div className="flex items-center px-2 text-[13px] text-[#AAAAAA] group-hover:text-[#2D7FF9]" />
        </div>

        {/* Bottom padding */}
        <div className="h-[200px]" />
      </div>

      {/* Record context menu */}
      {ui.contextMenu && (
        <RecordContextMenu />
      )}

      {/* Field context menu */}
      {ui.fieldContextMenu && (
        <FieldContextMenu />
      )}
    </div>
  );
}

function RecordContextMenu() {
  const ui = useStore(s => s.ui);
  const setContextMenu = useStore(s => s.setContextMenu);
  const deleteRecord = useStore(s => s.deleteRecord);
  const duplicateRecord = useStore(s => s.duplicateRecord);
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);
  const menu = ui.contextMenu;

  if (!menu) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
      <div
        className="fixed z-50 bg-white border border-[#E5E5E5] rounded-lg shadow-xl py-1 min-w-[180px] animate-fadeIn"
        style={{ left: menu.x, top: menu.y }}
      >
        <button
          onClick={() => { setExpandedRecordId(menu.recordId); setContextMenu(null); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
        >
          <Expand size={14} /> Expand record
        </button>
        <button
          onClick={() => { duplicateRecord(menu.recordId); setContextMenu(null); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
        >
          <Copy size={14} /> Duplicate record
        </button>
        <div className="h-px bg-[#E8E8E8] my-1" />
        <button
          onClick={() => { deleteRecord(menu.recordId); setContextMenu(null); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-[#F5F5F5]"
        >
          <Trash2 size={14} /> Delete record
        </button>
      </div>
    </>
  );
}

function FieldContextMenu() {
  const ui = useStore(s => s.ui);
  const setFieldContextMenu = useStore(s => s.setFieldContextMenu);
  const deleteField = useStore(s => s.deleteField);
  const addSort = useStore(s => s.addSort);
  const table = useStore(s => s.getActiveTable());
  const menu = ui.fieldContextMenu;

  if (!menu) return null;
  const field = table.fields.find(f => f.id === menu.fieldId);
  if (!field) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setFieldContextMenu(null)} />
      <div
        className="fixed z-50 bg-white border border-[#E5E5E5] rounded-lg shadow-xl py-1 min-w-[200px] animate-fadeIn"
        style={{ left: menu.x, top: menu.y }}
      >
        <button
          onClick={() => { addSort({ fieldId: field.id, direction: 'asc' }); setFieldContextMenu(null); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
        >
          <ArrowUp size={14} /> Sort A → Z
        </button>
        <button
          onClick={() => { addSort({ fieldId: field.id, direction: 'desc' }); setFieldContextMenu(null); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
        >
          <ArrowDown size={14} /> Sort Z → A
        </button>
        <div className="h-px bg-[#E8E8E8] my-1" />
        {!field.isPrimary && (
          <button
            onClick={() => { deleteField(field.id); setFieldContextMenu(null); }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-[#F5F5F5]"
          >
            <Trash2 size={14} /> Delete field
          </button>
        )}
      </div>
    </>
  );
}
