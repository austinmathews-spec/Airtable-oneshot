import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star, Check, ExternalLink, MessageSquare, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import FieldTypeIcon from './FieldTypeIcon';
import { getSelectColor, formatCellValue } from '../utils/helpers';
import type { CellValue, Field, SelectOption } from '../types';

export default function RecordDetail() {
  const expandedRecordId = useStore(s => s.ui.expandedRecordId);
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);
  const table = useStore(s => s.getActiveTable());
  const updateCell = useStore(s => s.updateCell);
  const addSelectOption = useStore(s => s.addSelectOption);

  if (!expandedRecordId) return null;

  const record = table.records.find(r => r.id === expandedRecordId);
  if (!record) return null;

  const recordIndex = table.records.findIndex(r => r.id === expandedRecordId);
  const hasPrev = recordIndex > 0;
  const hasNext = recordIndex < table.records.length - 1;

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < table.records.length) {
      setExpandedRecordId(table.records[idx].id);
    }
  };

  const primaryField = table.fields.find(f => f.isPrimary);
  const primaryValue = primaryField ? record.cells[primaryField.id] : '';

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setExpandedRecordId(null)} />
      <div className="fixed right-0 top-0 bottom-0 w-[640px] max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedRecordId(null)}
              className="p-1 rounded hover:bg-[#F3F3F3]"
            >
              <X size={18} className="text-[#666]" />
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => hasPrev && goTo(recordIndex - 1)}
                disabled={!hasPrev}
                className="p-1 rounded hover:bg-[#F3F3F3] disabled:opacity-30"
              >
                <ChevronLeft size={16} className="text-[#666]" />
              </button>
              <button
                onClick={() => hasNext && goTo(recordIndex + 1)}
                disabled={!hasNext}
                className="p-1 rounded hover:bg-[#F3F3F3] disabled:opacity-30"
              >
                <ChevronRight size={16} className="text-[#666]" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#F3F3F3] text-[#666] text-[13px]">
              <MessageSquare size={14} />
              <span>Comments</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#F3F3F3] text-[#666] text-[13px]">
              <Clock size={14} />
              <span>Activity</span>
            </button>
          </div>
        </div>

        {/* Record title */}
        <div className="px-6 pt-4 pb-2">
          <h2 className="text-[20px] font-semibold text-[#333]">
            {primaryValue ? String(primaryValue) : 'Unnamed record'}
          </h2>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {table.fields.map(field => (
            <FieldRow
              key={field.id}
              field={field}
              value={record.cells[field.id]}
              recordId={record.id}
              onUpdate={(val) => updateCell(record.id, field.id, val)}
              onAddOption={addSelectOption}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function FieldRow({ field, value, onUpdate }: {
  field: Field;
  value: CellValue;
  recordId: string;
  onUpdate: (val: CellValue) => void;
  onAddOption: (fieldId: string, option: Omit<SelectOption, 'id'>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleStartEdit = () => {
    setEditing(true);
    if (field.type === 'singleSelect' || field.type === 'multipleSelects') {
      setShowOptions(true);
    } else if (field.type === 'percent') {
      setEditValue(value != null ? String(Math.round(Number(value) * 100)) : '');
    } else {
      setEditValue(value != null ? String(value) : '');
    }
  };

  const handleSave = () => {
    setEditing(false);
    setShowOptions(false);
    let newVal: CellValue = editValue;
    if (field.type === 'number' || field.type === 'currency' || field.type === 'rating') {
      newVal = editValue ? Number(editValue) : null;
    } else if (field.type === 'percent') {
      newVal = editValue ? Number(editValue) / 100 : null;
    }
    onUpdate(newVal);
  };

  return (
    <div className="flex py-2.5 border-b border-[#F0F0F0] gap-4">
      {/* Field name */}
      <div className="w-[160px] min-w-[160px] flex items-start gap-2 pt-1">
        <FieldTypeIcon type={field.type} size={14} />
        <span className="text-[13px] text-[#666] truncate">{field.name}</span>
      </div>

      {/* Field value */}
      <div className="flex-1 min-w-0">
        {/* Checkbox */}
        {field.type === 'checkbox' && (
          <button
            onClick={() => onUpdate(!value)}
            className="flex items-center"
          >
            {value ? (
              <div className="w-4 h-4 rounded-sm bg-[#2D7FF9] flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-sm border-2 border-[#D4D4D4] hover:border-[#999]" />
            )}
          </button>
        )}

        {/* Rating */}
        {field.type === 'rating' && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => onUpdate(i === value ? 0 : i)}>
                <Star
                  size={18}
                  className={i <= (typeof value === 'number' ? value : 0) ? 'text-[#FCB400] fill-[#FCB400]' : 'text-[#D4D4D4]'}
                />
              </button>
            ))}
          </div>
        )}

        {/* Single select */}
        {field.type === 'singleSelect' && (
          <div className="relative">
            <div
              className="cursor-pointer min-h-[28px] flex items-center"
              onClick={() => setShowOptions(!showOptions)}
            >
              {value ? (() => {
                const opt = field.options?.find(o => o.name === value);
                const color = opt ? getSelectColor(opt.color) : { bg: '#EEE', text: '#333' };
                return <span className="select-tag" style={{ background: color.bg, color: color.text }}>{String(value)}</span>;
              })() : (
                <span className="text-[13px] text-[#BBBBBB]">Empty</span>
              )}
            </div>
            {showOptions && (
              <div className="absolute left-0 top-full z-20 bg-white border border-[#E5E5E5] rounded-lg shadow-xl min-w-[200px] py-1 animate-fadeIn">
                {field.options?.map(opt => {
                  const color = getSelectColor(opt.color);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onUpdate(opt.name === value ? null : opt.name);
                        setShowOptions(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] hover:bg-[#F5F5F5]"
                    >
                      <span className="select-tag" style={{ background: color.bg, color: color.text }}>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Multiple selects */}
        {field.type === 'multipleSelects' && (
          <div className="relative">
            <div
              className="cursor-pointer min-h-[28px] flex items-center gap-1 flex-wrap"
              onClick={() => setShowOptions(!showOptions)}
            >
              {Array.isArray(value) && value.length > 0 ? value.map((v, i) => {
                const opt = field.options?.find(o => o.name === v);
                const color = opt ? getSelectColor(opt.color) : { bg: '#EEE', text: '#333' };
                return <span key={i} className="select-tag" style={{ background: color.bg, color: color.text }}>{v}</span>;
              }) : (
                <span className="text-[13px] text-[#BBBBBB]">Empty</span>
              )}
            </div>
            {showOptions && (
              <div className="absolute left-0 top-full z-20 bg-white border border-[#E5E5E5] rounded-lg shadow-xl min-w-[200px] py-1 animate-fadeIn">
                {field.options?.map(opt => {
                  const vals = Array.isArray(value) ? value : [];
                  const selected = vals.includes(opt.name);
                  const color = getSelectColor(opt.color);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        const newVals = selected
                          ? vals.filter(v => v !== opt.name)
                          : [...vals, opt.name];
                        onUpdate(newVals);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 text-[13px] hover:bg-[#F5F5F5] ${selected ? 'bg-[#F0F5FF]' : ''}`}
                    >
                      <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${selected ? 'bg-[#2D7FF9] border-[#2D7FF9]' : 'border-[#D4D4D4]'}`}>
                        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="select-tag" style={{ background: color.bg, color: color.text }}>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* URL */}
        {field.type === 'url' && !editing && (
          <div
            className="min-h-[28px] flex items-center cursor-pointer"
            onClick={handleStartEdit}
          >
            {value ? (
              <a href={String(value).startsWith('http') ? String(value) : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-[#2D7FF9] text-[13px] hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                {String(value)}
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-[13px] text-[#BBBBBB]">Empty</span>
            )}
          </div>
        )}

        {/* Email */}
        {field.type === 'email' && !editing && (
          <div
            className="min-h-[28px] flex items-center cursor-pointer"
            onClick={handleStartEdit}
          >
            {value ? (
              <a href={`mailto:${value}`} className="text-[#2D7FF9] text-[13px] hover:underline" onClick={e => e.stopPropagation()}>
                {String(value)}
              </a>
            ) : (
              <span className="text-[13px] text-[#BBBBBB]">Empty</span>
            )}
          </div>
        )}

        {/* Text / Number / Date / etc editing */}
        {!['checkbox', 'rating', 'singleSelect', 'multipleSelects'].includes(field.type) && (
          editing ? (
            field.type === 'multilineText' ? (
              <textarea
                autoFocus
                className="w-full px-2 py-1.5 text-[13px] border border-[#2D7FF9] rounded outline-none min-h-[80px] resize-y"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => { if (e.key === 'Escape') { setEditing(false); } }}
              />
            ) : (
              <input
                autoFocus
                className="w-full px-2 py-1.5 text-[13px] border border-[#2D7FF9] rounded outline-none"
                type={field.type === 'number' || field.type === 'currency' || field.type === 'percent' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditing(false);
                }}
              />
            )
          ) : (
            !['url', 'email'].includes(field.type) && (
              <div
                className="min-h-[28px] flex items-center cursor-pointer rounded px-2 -mx-2 hover:bg-[#F5F5F5]"
                onClick={handleStartEdit}
              >
                <span className={`text-[13px] ${value != null && value !== '' ? 'text-[#333]' : 'text-[#BBBBBB]'}`}>
                  {value != null && value !== '' ? formatCellValue(value, field) : 'Empty'}
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
