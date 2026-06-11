import { X, Plus, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';

export default function SortPanel() {
  const isOpen = useStore(s => s.ui.sortPanelOpen);
  const setOpen = useStore(s => s.setSortPanelOpen);
  const view = useStore(s => s.getActiveView());
  const table = useStore(s => s.getActiveTable());
  const addSort = useStore(s => s.addSort);
  const removeSort = useStore(s => s.removeSort);
  const updateSort = useStore(s => s.updateSort);

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-[#E2E2E2] px-4 py-2 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#666]">Sort</span>
        <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
          <X size={14} className="text-[#999]" />
        </button>
      </div>

      {view.sorts.map((sort, index) => (
        <div key={index} className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] text-[#999] w-[50px]">{index === 0 ? 'Sort by' : 'then by'}</span>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none min-w-[120px]"
            value={sort.fieldId}
            onChange={e => updateSort(index, { ...sort, fieldId: e.target.value })}
          >
            {table.fields.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none"
            value={sort.direction}
            onChange={e => updateSort(index, { ...sort, direction: e.target.value as 'asc' | 'desc' })}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
          <button onClick={() => removeSort(index)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
            <Trash2 size={13} className="text-[#999]" />
          </button>
        </div>
      ))}

      <button
        onClick={() => addSort({ fieldId: table.fields[0]?.id ?? '', direction: 'asc' })}
        className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#2D7FF9] hover:bg-[#F5F5F5] rounded mt-1"
      >
        <Plus size={13} />
        Add sort
      </button>
    </div>
  );
}
