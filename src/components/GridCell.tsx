import { useState, useCallback } from 'react';
import { Check, Star, ExternalLink } from 'lucide-react';
import useStore from '../store/useStore';
import { getSelectColor, formatCellValue } from '../utils/helpers';
import type { Field, CellValue, SelectOption } from '../types';

interface Props {
  recordId: string;
  field: Field;
  value: CellValue;
  isEditing: boolean;
}

export default function GridCell({ recordId, field, value, isEditing }: Props) {
  const updateCell = useStore(s => s.updateCell);
  const setEditingCell = useStore(s => s.setEditingCell);
  const addSelectOption = useStore(s => s.addSelectOption);
  const [editValue, setEditValue] = useState('');
  const showDropdown = isEditing && (field.type === 'singleSelect' || field.type === 'multipleSelects');
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node && isEditing) {
      node.focus();
      setEditValue(value != null ? String(value) : '');
    }
  }, [isEditing, value]);
  const textareaRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (node && isEditing) {
      node.focus();
      setEditValue(value != null ? String(value) : '');
    }
  }, [isEditing, value]);

  const handleSave = () => {
    let newVal: CellValue = editValue;
    if (field.type === 'number' || field.type === 'currency' || field.type === 'rating') {
      newVal = editValue ? Number(editValue) : null;
    } else if (field.type === 'percent') {
      newVal = editValue ? Number(editValue) / 100 : null;
    } else if (field.type === 'checkbox') {
      return;
    }
    updateCell(recordId, field.id, newVal);
    setEditingCell(null);
  };

  // Checkbox
  if (field.type === 'checkbox') {
    return (
      <div
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={() => updateCell(recordId, field.id, !value)}
      >
        {value ? (
          <div className="w-4 h-4 rounded-sm bg-[#2D7FF9] flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-sm border-2 border-[#D4D4D4] hover:border-[#999]" />
        )}
      </div>
    );
  }

  // Rating
  if (field.type === 'rating') {
    const rating = typeof value === 'number' ? value : 0;
    return (
      <div className="flex items-center gap-0.5 px-2 h-full">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            onClick={() => updateCell(recordId, field.id, i === rating ? 0 : i)}
            className="p-0"
          >
            <Star
              size={16}
              className={i <= rating ? 'text-[#FCB400] fill-[#FCB400]' : 'text-[#D4D4D4]'}
            />
          </button>
        ))}
      </div>
    );
  }

  // Single Select
  if (field.type === 'singleSelect') {
    const selectedOption = field.options?.find(o => o.name === value);
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full flex items-center px-2 cursor-pointer"
          onClick={() => setEditingCell({ recordId, fieldId: field.id })}
        >
          {selectedOption ? (
            <span
              className="select-tag"
              style={{
                background: getSelectColor(selectedOption.color).bg,
                color: getSelectColor(selectedOption.color).text,
              }}
            >
              {selectedOption.name}
            </span>
          ) : null}
        </div>

        {isEditing && showDropdown && (
          <SelectDropdown
            options={field.options ?? []}
            selected={value ? [String(value)] : []}
            multiple={false}
            onSelect={(name) => {
              updateCell(recordId, field.id, name === value ? null : name);
              setEditingCell(null);
            }}
            onClose={() => setEditingCell(null)}
            fieldId={field.id}
            onAddOption={addSelectOption}
          />
        )}
      </div>
    );
  }

  // Multiple Selects
  if (field.type === 'multipleSelects') {
    const values = Array.isArray(value) ? value : [];
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full flex items-center gap-1 px-2 overflow-hidden cursor-pointer"
          onClick={() => setEditingCell({ recordId, fieldId: field.id })}
        >
          {values.map((v, i) => {
            const opt = field.options?.find(o => o.name === v);
            const color = opt ? getSelectColor(opt.color) : { bg: '#EEE', text: '#333' };
            return (
              <span key={i} className="select-tag" style={{ background: color.bg, color: color.text }}>
                {v}
              </span>
            );
          })}
        </div>

        {isEditing && showDropdown && (
          <SelectDropdown
            options={field.options ?? []}
            selected={values}
            multiple={true}
            onSelect={(name) => {
              const newVals = values.includes(name)
                ? values.filter(v => v !== name)
                : [...values, name];
              updateCell(recordId, field.id, newVals);
            }}
            onClose={() => setEditingCell(null)}
            fieldId={field.id}
            onAddOption={addSelectOption}
          />
        )}
      </div>
    );
  }

  // URL
  if (field.type === 'url' && !isEditing) {
    return (
      <div className="w-full h-full flex items-center px-2 group">
        {value ? (
          <div className="flex items-center gap-1 min-w-0">
            <a
              href={String(value).startsWith('http') ? String(value) : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D7FF9] hover:underline truncate text-[13px]"
              onClick={e => e.stopPropagation()}
            >
              {String(value)}
            </a>
            <ExternalLink size={12} className="text-[#999] flex-shrink-0 opacity-0 group-hover:opacity-100" />
          </div>
        ) : null}
      </div>
    );
  }

  // Email
  if (field.type === 'email' && !isEditing) {
    return (
      <div className="w-full h-full flex items-center px-2">
        {value ? (
          <a
            href={`mailto:${value}`}
            className="text-[#2D7FF9] hover:underline truncate text-[13px]"
            onClick={e => e.stopPropagation()}
          >
            {String(value)}
          </a>
        ) : null}
      </div>
    );
  }

  // Currency display
  if (field.type === 'currency' && !isEditing) {
    return (
      <div className="w-full h-full flex items-center px-2 text-[13px] text-[#333]">
        {value != null && value !== '' ? formatCellValue(value, field) : ''}
      </div>
    );
  }

  // Percent display
  if (field.type === 'percent' && !isEditing) {
    return (
      <div className="w-full h-full flex items-center px-2 text-[13px] text-[#333]">
        {value != null && value !== '' ? formatCellValue(value, field) : ''}
      </div>
    );
  }

  // Date display (non-editing)
  if (field.type === 'date' && !isEditing) {
    return (
      <div className="w-full h-full flex items-center px-2 text-[13px] text-[#333]">
        {value ? formatCellValue(value, field) : ''}
      </div>
    );
  }

  // Editing mode for all text-like fields
  if (isEditing) {
    if (field.type === 'multilineText') {
      return (
        <div className="absolute z-20 bg-white border-2 border-[#2D7FF9] rounded shadow-lg p-1 min-w-[200px]">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[80px] text-[13px] p-1 outline-none resize-y"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === 'Escape') { setEditingCell(null); }
            }}
          />
        </div>
      );
    }

    if (field.type === 'date') {
      return (
        <input
          ref={inputRef}
          type="date"
          className="grid-cell-input text-[13px]"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setEditingCell(null);
          }}
        />
      );
    }

    if (field.type === 'percent') {
      return (
        <input
          ref={inputRef}
          type="number"
          className="grid-cell-input text-[13px]"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setEditingCell(null);
          }}
          placeholder="%"
        />
      );
    }

    return (
      <input
        ref={inputRef}
        type={field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'email' ? 'email' : 'text'}
        className="grid-cell-input text-[13px]"
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') setEditingCell(null);
          if (e.key === 'Tab') { e.preventDefault(); handleSave(); }
        }}
      />
    );
  }

  // Default display
  return (
    <div className="w-full h-full flex items-center px-2 text-[13px] text-[#333] truncate">
      {value != null && value !== '' ? (Array.isArray(value) ? value.join(', ') : String(value)) : ''}
    </div>
  );
}

// Select dropdown component
function SelectDropdown({ options, selected, multiple, onSelect, onClose, fieldId, onAddOption }: {
  options: SelectOption[];
  selected: string[];
  multiple: boolean;
  onSelect: (name: string) => void;
  onClose: () => void;
  fieldId: string;
  onAddOption: (fieldId: string, option: Omit<SelectOption, 'id'>) => void;
}) {
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  const colors = ['blueLight', 'cyanLight', 'greenLight', 'yellowLight', 'orangeLight', 'redLight', 'pinkLight', 'purpleLight', 'grayLight'];

  return (
    <div
      className="absolute left-0 top-full z-50 bg-white border border-[#E5E5E5] rounded-lg shadow-xl min-w-[200px] max-h-[280px] overflow-hidden animate-fadeIn"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-2 border-b border-[#F0F0F0]">
        <input
          autoFocus
          className="w-full px-2 py-1.5 text-[13px] border border-[#E0E0E0] rounded outline-none focus:border-[#2D7FF9] placeholder-[#999]"
          placeholder="Find an option"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter' && search.trim() && filteredOptions.length === 0) {
              const color = colors[Math.floor(Math.random() * colors.length)];
              onAddOption(fieldId, { name: search.trim(), color });
              onSelect(search.trim());
              setSearch('');
            }
          }}
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto py-1">
        {filteredOptions.map(option => {
          const isSelected = selected.includes(option.name);
          const color = getSelectColor(option.color);
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.name)}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-[13px] hover:bg-[#F5F5F5] ${isSelected ? 'bg-[#F0F5FF]' : ''}`}
            >
              {multiple && (
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-[#2D7FF9] border-[#2D7FF9]' : 'border-[#D4D4D4]'}`}>
                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              )}
              <span className="select-tag" style={{ background: color.bg, color: color.text }}>
                {option.name}
              </span>
            </button>
          );
        })}
        {filteredOptions.length === 0 && search.trim() && (
          <button
            onClick={() => {
              const color = colors[Math.floor(Math.random() * colors.length)];
              onAddOption(fieldId, { name: search.trim(), color });
              onSelect(search.trim());
              setSearch('');
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[#2D7FF9] hover:bg-[#F5F5F5]"
          >
            Create "{search.trim()}"
          </button>
        )}
      </div>
    </div>
  );
}
