import { useState } from 'react';
import { X, Search } from 'lucide-react';
import useStore from '../store/useStore';
import FieldTypeIcon from './FieldTypeIcon';
import { FIELD_TYPE_INFO } from '../types';
import type { FieldType } from '../types';

export default function AddFieldModal() {
  const isOpen = useStore(s => s.ui.addFieldModalOpen);
  const setOpen = useStore(s => s.setAddFieldModalOpen);
  const addField = useStore(s => s.addField);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<FieldType>('singleLineText');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = FIELD_TYPE_INFO.filter(f =>
    f.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    const fieldName = name.trim() || FIELD_TYPE_INFO.find(f => f.type === selectedType)?.label || 'Field';
    addField({
      name: fieldName,
      type: selectedType,
      width: 180,
      options: (selectedType === 'singleSelect' || selectedType === 'multipleSelects') ? [
        { id: 'opt_1', name: 'Option 1', color: 'blueLight' },
        { id: 'opt_2', name: 'Option 2', color: 'greenLight' },
        { id: 'opt_3', name: 'Option 3', color: 'orangeLight' },
      ] : undefined,
    });
    setName('');
    setSelectedType('singleLineText');
    setSearch('');
    setOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setOpen(false)} />
      <div className="fixed right-4 top-[120px] z-50 bg-white border border-[#E5E5E5] rounded-xl shadow-2xl w-[320px] max-h-[500px] flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
          <h3 className="text-[14px] font-semibold text-[#333]">Add a field</h3>
          <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-[#F3F3F3]">
            <X size={16} className="text-[#666]" />
          </button>
        </div>

        {/* Field name */}
        <div className="px-4 py-3 border-b border-[#F0F0F0]">
          <input
            autoFocus
            className="w-full px-3 py-2 text-[13px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#2D7FF9] placeholder-[#999]"
            placeholder="Field name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
          />
        </div>

        {/* Field type search */}
        <div className="px-4 py-2 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#F5F5F5] rounded-lg">
            <Search size={14} className="text-[#999]" />
            <input
              className="flex-1 bg-transparent outline-none text-[13px] placeholder-[#999]"
              placeholder="Find a field type"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Field type list */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.map(info => (
            <button
              key={info.type}
              onClick={() => setSelectedType(info.type)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[#F5F5F5] ${
                selectedType === info.type ? 'bg-[#EBF1FF]' : ''
              }`}
            >
              <FieldTypeIcon type={info.type} size={16} />
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[#333]">{info.label}</div>
                <div className="text-[11px] text-[#999] truncate">{info.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#F0F0F0]">
          <button
            onClick={handleCreate}
            className="w-full py-2 bg-[#2D7FF9] hover:bg-[#1A6AE0] text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            Create field
          </button>
        </div>
      </div>
    </>
  );
}
