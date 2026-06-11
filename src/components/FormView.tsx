import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import useStore from '../store/useStore';
import FieldTypeIcon from './FieldTypeIcon';
import { getSelectColor } from '../utils/helpers';
import type { CellValue } from '../types';

export default function FormView() {
  const table = useStore(s => s.getActiveTable());
  const addRecord = useStore(s => s.addRecord);
  const [formData, setFormData] = useState<{ [fieldId: string]: CellValue }>({});
  const [submitted, setSubmitted] = useState(false);

  const updateFormField = (fieldId: string, value: CellValue) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = () => {
    addRecord(formData);
    setFormData({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F5F5]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-[400px] animate-scaleIn">
          <div className="w-12 h-12 bg-[#20C933]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-[#20C933]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#333] mb-2">Record created!</h3>
          <p className="text-[14px] text-[#666] mb-4">Your record has been added successfully.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-[#2D7FF9] hover:bg-[#1A6AE0] text-white text-[14px] font-medium rounded-lg"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F5] flex justify-center py-8">
      <div className="w-full max-w-[600px]">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form header */}
          <div className="h-[6px] bg-gradient-to-r from-[#2D7FF9] to-[#8B46FF]" />
          <div className="px-8 pt-6 pb-4 border-b border-[#F0F0F0]">
            <h2 className="text-[20px] font-semibold text-[#333]">{table.name}</h2>
            <p className="text-[13px] text-[#999] mt-1">Fill out the fields below to add a new record</p>
          </div>

          {/* Form fields */}
          <div className="px-8 py-6 space-y-5">
            {table.fields.map(field => (
              <div key={field.id}>
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#333] mb-1.5">
                  <FieldTypeIcon type={field.type} size={13} />
                  {field.name}
                </label>

                {/* Text fields */}
                {(field.type === 'singleLineText' || field.type === 'email' || field.type === 'url' || field.type === 'phone') && (
                  <input
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[13px] outline-none focus:border-[#2D7FF9] placeholder-[#BBBBBB]"
                    type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    value={formData[field.id] != null ? String(formData[field.id]) : ''}
                    onChange={e => updateFormField(field.id, e.target.value)}
                  />
                )}

                {/* Long text */}
                {field.type === 'multilineText' && (
                  <textarea
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[13px] outline-none focus:border-[#2D7FF9] min-h-[80px] resize-y placeholder-[#BBBBBB]"
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    value={formData[field.id] != null ? String(formData[field.id]) : ''}
                    onChange={e => updateFormField(field.id, e.target.value)}
                  />
                )}

                {/* Number / Currency */}
                {(field.type === 'number' || field.type === 'currency') && (
                  <input
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[13px] outline-none focus:border-[#2D7FF9]"
                    type="number"
                    placeholder="0"
                    value={formData[field.id] != null ? String(formData[field.id]) : ''}
                    onChange={e => updateFormField(field.id, e.target.value ? Number(e.target.value) : null)}
                  />
                )}

                {/* Percent */}
                {field.type === 'percent' && (
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[13px] outline-none focus:border-[#2D7FF9] pr-8"
                      type="number"
                      placeholder="0"
                      value={formData[field.id] != null ? String(Math.round(Number(formData[field.id]) * 100)) : ''}
                      onChange={e => updateFormField(field.id, e.target.value ? Number(e.target.value) / 100 : null)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#999]">%</span>
                  </div>
                )}

                {/* Date */}
                {field.type === 'date' && (
                  <input
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[13px] outline-none focus:border-[#2D7FF9]"
                    type="date"
                    value={formData[field.id] != null ? String(formData[field.id]) : ''}
                    onChange={e => updateFormField(field.id, e.target.value)}
                  />
                )}

                {/* Checkbox */}
                {field.type === 'checkbox' && (
                  <button
                    className="flex items-center gap-2"
                    onClick={() => updateFormField(field.id, !formData[field.id])}
                  >
                    {formData[field.id] ? (
                      <div className="w-5 h-5 rounded bg-[#2D7FF9] flex items-center justify-center">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-[#D4D4D4]" />
                    )}
                  </button>
                )}

                {/* Rating */}
                {field.type === 'rating' && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => updateFormField(field.id, i === formData[field.id] ? 0 : i)}>
                        <Star
                          size={22}
                          className={i <= (Number(formData[field.id]) || 0) ? 'text-[#FCB400] fill-[#FCB400]' : 'text-[#D4D4D4]'}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Single select */}
                {field.type === 'singleSelect' && field.options && (
                  <div className="flex flex-wrap gap-1.5">
                    {field.options.map(opt => {
                      const selected = formData[field.id] === opt.name;
                      const color = getSelectColor(opt.color);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => updateFormField(field.id, selected ? null : opt.name)}
                          className={`select-tag text-[12px] border-2 transition-colors ${
                            selected ? 'border-[#2D7FF9]' : 'border-transparent'
                          }`}
                          style={{ background: color.bg, color: color.text }}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple selects */}
                {field.type === 'multipleSelects' && field.options && (
                  <div className="flex flex-wrap gap-1.5">
                    {field.options.map(opt => {
                      const vals = Array.isArray(formData[field.id]) ? (formData[field.id] as string[]) : [];
                      const selected = vals.includes(opt.name);
                      const color = getSelectColor(opt.color);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            const newVals = selected ? vals.filter(v => v !== opt.name) : [...vals, opt.name];
                            updateFormField(field.id, newVals);
                          }}
                          className={`select-tag text-[12px] border-2 transition-colors ${
                            selected ? 'border-[#2D7FF9]' : 'border-transparent'
                          }`}
                          style={{ background: color.bg, color: color.text }}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="px-8 py-4 border-t border-[#F0F0F0] bg-[#FAFAFA]">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#2D7FF9] hover:bg-[#1A6AE0] text-white text-[14px] font-medium rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
