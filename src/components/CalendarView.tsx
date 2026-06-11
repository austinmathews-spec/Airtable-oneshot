import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarView() {
  const table = useStore(s => s.getActiveTable());
  const view = useStore(s => s.getActiveView());
  const setExpandedRecordId = useStore(s => s.setExpandedRecordId);

  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarFieldId = view.calendarFieldId ?? table.fields.find(f => f.type === 'date')?.id;
  const primaryField = table.fields.find(f => f.isPrimary);

  if (!calendarFieldId) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#999] text-[14px]">
        <p>Select a date field to display in Calendar view.</p>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getRecordsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return table.records.filter(r => {
      const val = r.cells[calendarFieldId];
      return val && String(val).startsWith(dateStr);
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1.5 rounded hover:bg-[#F3F3F3]"
          >
            <ChevronLeft size={18} className="text-[#666]" />
          </button>
          <h2 className="text-[16px] font-semibold text-[#333]">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1.5 rounded hover:bg-[#F3F3F3]"
          >
            <ChevronRight size={18} className="text-[#666]" />
          </button>
        </div>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1 text-[13px] text-[#2D7FF9] hover:bg-[#F5F5F5] rounded font-medium"
        >
          Today
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#E2E2E2]">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-[12px] font-medium text-[#666]">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-[#E2E2E2]">
        {cells.map((day, i) => {
          const isToday = day !== null && year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          const records = day ? getRecordsForDay(day) : [];

          return (
            <div
              key={i}
              className={`min-h-[100px] border-r border-b border-[#E2E2E2] p-1 ${
                day === null ? 'bg-[#FAFAFA]' : 'bg-white'
              }`}
            >
              {day !== null && (
                <>
                  <div className={`text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-[#2D7FF9] text-white' : 'text-[#666]'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {records.slice(0, 3).map(record => (
                      <button
                        key={record.id}
                        onClick={() => setExpandedRecordId(record.id)}
                        className="w-full text-left px-1.5 py-0.5 text-[11px] bg-[#2D7FF9]/10 text-[#2D7FF9] rounded truncate hover:bg-[#2D7FF9]/20"
                      >
                        {primaryField ? String(record.cells[primaryField.id] ?? 'Unnamed') : 'Unnamed'}
                      </button>
                    ))}
                    {records.length > 3 && (
                      <span className="text-[10px] text-[#999] px-1.5">+{records.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
