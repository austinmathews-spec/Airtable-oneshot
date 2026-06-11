import { X, Plus, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import type { FilterConfig } from '../types';

const operators = [
  { value: 'contains', label: 'contains' },
  { value: 'doesNotContain', label: 'does not contain' },
  { value: 'is', label: 'is' },
  { value: 'isNot', label: 'is not' },
  { value: 'isEmpty', label: 'is empty' },
  { value: 'isNotEmpty', label: 'is not empty' },
  { value: 'greaterThan', label: '>' },
  { value: 'lessThan', label: '<' },
] as const;

export default function FilterPanel() {
  const isOpen = useStore(s => s.ui.filterPanelOpen);
  const setOpen = useStore(s => s.setFilterPanelOpen);
  const view = useStore(s => s.getActiveView());
  const table = useStore(s => s.getActiveTable());
  const addFilter = useStore(s => s.addFilter);
  const removeFilter = useStore(s => s.removeFilter);
  const updateFilter = useStore(s => s.updateFilter);

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-[#E2E2E2] px-4 py-2 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#666]">Filters</span>
        <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
          <X size={14} className="text-[#999]" />
        </button>
      </div>

      {view.filters.map((filter, index) => (
        <div key={index} className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] text-[#999] w-[40px]">{index === 0 ? 'Where' : 'and'}</span>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none min-w-[120px]"
            value={filter.fieldId}
            onChange={e => updateFilter(index, { ...filter, fieldId: e.target.value })}
          >
            {table.fields.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded bg-white outline-none"
            value={filter.operator}
            onChange={e => updateFilter(index, { ...filter, operator: e.target.value as FilterConfig['operator'] })}
          >
            {operators.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
          {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
            <input
              className="px-2 py-1 text-[12px] border border-[#E0E0E0] rounded outline-none flex-1 min-w-[100px] focus:border-[#2D7FF9]"
              placeholder="Enter a value"
              value={filter.value}
              onChange={e => updateFilter(index, { ...filter, value: e.target.value })}
            />
          )}
          <button onClick={() => removeFilter(index)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
            <Trash2 size={13} className="text-[#999]" />
          </button>
        </div>
      ))}

      <button
        onClick={() => addFilter({ fieldId: table.fields[0]?.id ?? '', operator: 'contains', value: '' })}
        className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#2D7FF9] hover:bg-[#F5F5F5] rounded mt-1"
      >
        <Plus size={13} />
        Add condition
      </button>
    </div>
  );
}
