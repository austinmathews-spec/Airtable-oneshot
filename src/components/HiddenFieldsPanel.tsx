import { X } from 'lucide-react';
import useStore from '../store/useStore';
import FieldTypeIcon from './FieldTypeIcon';

export default function HiddenFieldsPanel() {
  const isOpen = useStore(s => s.ui.hiddenFieldsPanelOpen);
  const setOpen = useStore(s => s.setHiddenFieldsPanelOpen);
  const view = useStore(s => s.getActiveView());
  const table = useStore(s => s.getActiveTable());
  const toggleField = useStore(s => s.toggleFieldVisibility);

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-[#E2E2E2] px-4 py-2 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#666]">Fields</span>
        <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-[#F3F3F3]">
          <X size={14} className="text-[#999]" />
        </button>
      </div>

      <div className="space-y-0.5">
        {table.fields.map(field => {
          const isHidden = view.hiddenFieldIds.includes(field.id);
          return (
            <button
              key={field.id}
              onClick={() => !field.isPrimary && toggleField(field.id)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-[13px] hover:bg-[#F5F5F5] ${
                field.isPrimary ? 'opacity-50 cursor-default' : ''
              }`}
            >
              <div className={`w-8 h-[18px] rounded-full flex items-center transition-colors ${
                isHidden ? 'bg-[#D4D4D4]' : 'bg-[#2D7FF9]'
              }`}>
                <div className={`w-[14px] h-[14px] rounded-full bg-white shadow-sm transform transition-transform ${
                  isHidden ? 'translate-x-0.5' : 'translate-x-[14px]'
                }`} />
              </div>
              <FieldTypeIcon type={field.type} size={13} />
              <span className={`truncate ${isHidden ? 'text-[#999]' : 'text-[#333]'}`}>{field.name}</span>
              {field.isPrimary && <span className="text-[10px] text-[#999] ml-auto">Primary</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
