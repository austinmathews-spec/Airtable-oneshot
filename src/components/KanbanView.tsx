import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import useStore from '../store/useStore';
import { getSelectColor } from '../utils/helpers';
import type { Record as AirtableRecord } from '../types';

export default function KanbanView() {
  const table = useStore(s => s.getActiveTable());
  const view = useStore(s => s.getActiveView());
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);
  const addRecord = useStore(s => s.addRecord);

  const kanbanFieldId = view.kanbanFieldId ?? table.fields.find(f => f.type === 'singleSelect')?.id;
  const kanbanField = table.fields.find(f => f.id === kanbanFieldId);
  const primaryField = table.fields.find(f => f.isPrimary);

  if (!kanbanField || !kanbanField.options) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#999] text-[14px]">
        <p>Select a single select field to group by in Kanban view.</p>
      </div>
    );
  }

  const columns = [
    ...kanbanField.options.map(opt => ({
      key: opt.name,
      label: opt.name,
      color: getSelectColor(opt.color),
      records: table.records.filter(r => r.cells[kanbanField.id] === opt.name),
    })),
    {
      key: '(Uncategorized)',
      label: 'Uncategorized',
      color: { bg: '#EEEEEE', text: '#666666' },
      records: table.records.filter(r => {
        const val = r.cells[kanbanField.id];
        return !val || !kanbanField.options!.some(o => o.name === val);
      }),
    },
  ];

  return (
    <div className="flex-1 overflow-x-auto p-4 bg-[#F5F5F5]">
      <div className="flex gap-3 h-full">
        {columns.map(col => (
          <div key={col.key} className="w-[280px] min-w-[280px] flex flex-col max-h-full">
            {/* Column header */}
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <span
                className="select-tag text-[12px]"
                style={{ background: col.color.bg, color: col.color.text }}
              >
                {col.label}
              </span>
              <span className="text-[12px] text-[#999]">{col.records.length}</span>
              <div className="flex-1" />
              <button className="p-0.5 rounded hover:bg-[#E5E5E5]">
                <MoreHorizontal size={14} className="text-[#999]" />
              </button>
              <button
                className="p-0.5 rounded hover:bg-[#E5E5E5]"
                onClick={() => {
                  addRecord({ [kanbanField.id]: col.key === '(Uncategorized)' ? '' : col.key });
                }}
              >
                <Plus size={14} className="text-[#999]" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-2 pb-2">
              {col.records.map(record => (
                <KanbanCard
                  key={record.id}
                  record={record}
                  primaryField={primaryField}
                  fields={table.fields}
                  kanbanFieldId={kanbanField.id}
                  onClick={() => setExpandedRecordId(record.id)}
                />
              ))}

              {/* Add card button */}
              <button
                onClick={() => {
                  addRecord({ [kanbanField.id]: col.key === '(Uncategorized)' ? '' : col.key });
                }}
                className="w-full py-2 px-3 text-[13px] text-[#999] hover:text-[#666] hover:bg-white/50 rounded-lg border border-dashed border-[#D4D4D4] hover:border-[#999] transition-colors"
              >
                + Add a record
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ record, primaryField, fields, kanbanFieldId, onClick }: {
  record: AirtableRecord;
  primaryField: { id: string } | undefined;
  fields: { id: string; name: string; type: string; isPrimary?: boolean; options?: { name: string; color: string }[] }[];
  kanbanFieldId: string;
  onClick: () => void;
}) {
  const title = primaryField ? record.cells[primaryField.id] : '';
  const otherFields = fields.filter(f => !f.isPrimary && f.id !== kanbanFieldId).slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-[#E5E5E5] p-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-[#333] truncate">
            {title ? String(title) : 'Unnamed'}
          </p>
        </div>
        <button className="p-0.5 rounded hover:bg-[#F3F3F3] opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0">
          <GripVertical size={14} className="text-[#999]" />
        </button>
      </div>

      {otherFields.map(field => {
        const val = record.cells[field.id];
        if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return null;

        if (field.type === 'singleSelect' && field.options) {
          const opt = field.options.find(o => o.name === val);
          if (!opt) return null;
          const color = getSelectColor(opt.color);
          return (
            <div key={field.id} className="mt-1.5">
              <span className="select-tag text-[11px]" style={{ background: color.bg, color: color.text }}>
                {String(val)}
              </span>
            </div>
          );
        }

        if (field.type === 'multipleSelects' && Array.isArray(val)) {
          return (
            <div key={field.id} className="mt-1.5 flex flex-wrap gap-1">
              {val.map((v, i) => {
                const opt = field.options?.find(o => o.name === v);
                const color = opt ? getSelectColor(opt.color) : { bg: '#EEE', text: '#333' };
                return (
                  <span key={i} className="select-tag text-[11px]" style={{ background: color.bg, color: color.text }}>
                    {v}
                  </span>
                );
              })}
            </div>
          );
        }

        return (
          <p key={field.id} className="text-[11px] text-[#999] mt-1 truncate">
            {String(val)}
          </p>
        );
      })}
    </div>
  );
}
