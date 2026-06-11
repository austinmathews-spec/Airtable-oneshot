import { X, Plus, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';

export default function GroupPanel() {
  const isOpen = useStore(s => s.ui.groupPanelOpen);
  const setOpen = useStore(s => s.setGroupPanelOpen);
  const view = useStore(s => s.getActiveView());
  const table = useStore(s => s.getActiveTable());
  const addGroup = useStore(s => s.addGroup);
  const removeGroup = useStore(s => s.removeGroup);

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-[#E2E2E2] px-4 py-2 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#666]">Group</span>
        <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
          <X size={14} className="text-[#999]" />
        </button>
      </div>

      {view.groups.map((group, index) => (
        <div key={index} className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] text-[#999] w-[60px]">Group by</span>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none min-w-[120px]"
            value={group.fieldId}
            disabled
          >
            {table.fields.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none"
            value={group.order}
            disabled
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
          <button onClick={() => removeGroup(index)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
            <Trash2 size={13} className="text-[#999]" />
          </button>
        </div>
      ))}

      {view.groups.length === 0 && (
        <button
          onClick={() => addGroup({ fieldId: table.fields[0]?.id ?? '', order: 'asc' })}
          className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#2D7FF9] hover:bg-[#F5F5F5] rounded mt-1"
        >
          <Plus size={13} />
          Add group
        </button>
      )}
    </div>
  );
}
