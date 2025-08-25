import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface PersianDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showTime?: boolean;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  className = '',
  disabled = false,
  showTime = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedTime, setSelectedTime] = useState(
    value ? { hours: value.getHours(), minutes: value.getMinutes() } : { hours: 12, minutes: 0 }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  // Convert Gregorian to Persian (simplified - for demo purposes)
  const gregorianToPersian = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified conversion (you would use a proper library like moment-jalaali)
    const pYear = year - 621;
    const pMonth = month;
    const pDay = day;
    
    return { year: pYear, month: pMonth, day: pDay };
  };

  // Convert Persian to Gregorian (simplified - for demo purposes)
  const persianToGregorian = (pYear: number, pMonth: number, pDay: number) => {
    // Simplified conversion
    const gYear = pYear + 621;
    return new Date(gYear, pMonth - 1, pDay, selectedTime.hours, selectedTime.minutes);
  };

  const persianDate = gregorianToPersian(currentDate);

  // Get days in Persian month (simplified)
  const getDaysInPersianMonth = (pYear: number, pMonth: number) => {
    if (pMonth <= 6) return 31;
    if (pMonth <= 11) return 30;
    return 29; // Simplified leap year logic
  };

  // Get first day of Persian month
  const getFirstDayOfPersianMonth = (pYear: number, pMonth: number) => {
    const gregorianDate = persianToGregorian(pYear, pMonth, 1);
    return (gregorianDate.getDay() + 1) % 7; // Adjust for Persian week starting Saturday
  };

  const handleDateClick = (day: number) => {
    const newDate = persianToGregorian(persianDate.year, persianDate.month, day);
    onChange(newDate);
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = () => {
    if (value) {
      const newDate = new Date(value);
      newDate.setHours(selectedTime.hours, selectedTime.minutes);
      onChange(newDate);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = persianDate.month === 1 ? 12 : persianDate.month - 1;
    const newYear = persianDate.month === 1 ? persianDate.year - 1 : persianDate.year;
    setCurrentDate(persianToGregorian(newYear, newMonth, 1));
  };

  const handleNextMonth = () => {
    const newMonth = persianDate.month === 12 ? 1 : persianDate.month + 1;
    const newYear = persianDate.month === 12 ? persianDate.year + 1 : persianDate.year;
    setCurrentDate(persianToGregorian(newYear, newMonth, 1));
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInPersianMonth(persianDate.year, persianDate.month);
    const firstDay = getFirstDayOfPersianMonth(persianDate.year, persianDate.month);
    const days = [];

    // Empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && 
        gregorianToPersian(value).year === persianDate.year &&
        gregorianToPersian(value).month === persianDate.month &&
        gregorianToPersian(value).day === day;

      const isToday = (() => {
        const today = new Date();
        const todayPersian = gregorianToPersian(today);
        return todayPersian.year === persianDate.year &&
               todayPersian.month === persianDate.month &&
               todayPersian.day === day;
      })();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-rose-600 text-white'
              : isToday
              ? 'bg-rose-100 text-rose-600 font-semibold'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {toPersianNumber(day)}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      >
        <input
          type="text"
          readOnly
          value={value ? formatPersianDateTime(value) : ''}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          }`}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 min-w-72" dir="rtl">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {persianMonths[persianDate.month - 1]} {toPersianNumber(persianDate.year)}
              </div>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {persianDays.map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {renderCalendarDays()}
          </div>

          {/* Time Picker */}
          {showTime && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">ساعت:</label>
                  <select
                    value={selectedTime.hours}
                    onChange={(e) => {
                      setSelectedTime(prev => ({ ...prev, hours: Number(e.target.value) }));
                      handleTimeChange();
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {toPersianNumber(i.toString().padStart(2, '0'))}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">دقیقه:</label>
                  <select
                    value={selectedTime.minutes}
                    onChange={(e) => {
                      setSelectedTime(prev => ({ ...prev, minutes: Number(e.target.value) }));
                      handleTimeChange();
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {toPersianNumber(i.toString().padStart(2, '0'))}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={() => {
                if (value) {
                  onChange(new Date());
                  setIsOpen(false);
                }
              }}
              className="px-3 py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
            >
              امروز
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;