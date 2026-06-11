import { Plus } from 'lucide-react';
import useStore from '../store/useStore';
import { getSelectColor, formatCellValue } from '../utils/helpers';

export default function GalleryView() {
  const table = useStore(s => s.getActiveTable());
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);
  const addRecord = useStore(s => s.addRecord);

  const primaryField = table.fields.find(f => f.isPrimary);
  const displayFields = table.fields.filter(f => !f.isPrimary).slice(0, 4);

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F5] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {table.records.map(record => (
          <div
            key={record.id}
            onClick={() => setExpandedRecordId(record.id)}
            className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          >
            {/* Color banner */}
            <div className="h-[6px] bg-gradient-to-r from-[#2D7FF9] to-[#8B46FF]" />

            <div className="p-4">
              {/* Primary field / title */}
              <h3 className="text-[14px] font-semibold text-[#333] mb-3 truncate">
                {primaryField && record.cells[primaryField.id]
                  ? String(record.cells[primaryField.id])
                  : 'Unnamed record'}
              </h3>

              {/* Other fields */}
              {displayFields.map(field => {
                const val = record.cells[field.id];
                if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) return null;

                return (
                  <div key={field.id} className="mb-2">
                    <div className="text-[11px] text-[#999] mb-0.5">{field.name}</div>
                    {field.type === 'singleSelect' && field.options ? (() => {
                      const opt = field.options.find(o => o.name === val);
                      if (!opt) return <span className="text-[12px] text-[#333]">{String(val)}</span>;
                      const color = getSelectColor(opt.color);
                      return <span className="select-tag text-[11px]" style={{ background: color.bg, color: color.text }}>{String(val)}</span>;
                    })() : field.type === 'multipleSelects' && Array.isArray(val) ? (
                      <div className="flex flex-wrap gap-1">
                        {val.map((v, i) => {
                          const opt = field.options?.find(o => o.name === v);
                          const color = opt ? getSelectColor(opt.color) : { bg: '#EEE', text: '#333' };
                          return <span key={i} className="select-tag text-[11px]" style={{ background: color.bg, color: color.text }}>{v}</span>;
                        })}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <span className="text-[12px]">{val ? '☑' : '☐'}</span>
                    ) : (
                      <span className="text-[12px] text-[#333] truncate block">{formatCellValue(val, field)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add record card */}
        <button
          onClick={() => addRecord()}
          className="bg-white/50 rounded-xl border-2 border-dashed border-[#D4D4D4] hover:border-[#999] flex items-center justify-center min-h-[180px] transition-colors group"
        >
          <div className="flex flex-col items-center gap-2 text-[#999] group-hover:text-[#666]">
            <Plus size={24} />
            <span className="text-[13px]">Add a record</span>
          </div>
        </button>
      </div>
    </div>
  );
}
