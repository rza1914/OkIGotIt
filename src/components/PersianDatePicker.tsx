import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { formatPersianDate, toPersianNumber } from '../utils/persian';

interface PersianDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const persianDays = [
    'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
  ];

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  // Simple Gregorian calendar for now - in a real app, you'd use a proper Persian calendar library
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < (firstDay + 1) % 7; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setSelectedDate(newDate);
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    return formatPersianDate(new Date(value));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={formatDisplayValue()}
          placeholder={placeholder}
          className={`input-field pr-10 cursor-pointer ${className}`}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-80 right-0">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-reverse space-x-2">
              <button
                onClick={() => navigateYear('next')}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                &#8249;&#8249;
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                &#8249;
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">
                {persianMonths[currentMonth]} {toPersianNumber(currentYear)}
              </div>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                &#8250;
              </button>
              <button
                onClick={() => navigateYear('prev')}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                &#8250;&#8250;
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {persianDays.map((day, index) => (
              <div
                key={index}
                className="text-center text-xs font-medium text-gray-500 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2"></div>;
              }

              const isSelected = value && 
                new Date(value).getDate() === day &&
                new Date(value).getMonth() === currentMonth &&
                new Date(value).getFullYear() === currentYear;

              const isToday = 
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    p-2 text-sm rounded hover:bg-rose-50 transition-colors
                    ${isSelected 
                      ? 'bg-rose-500 text-white font-semibold' 
                      : isToday 
                        ? 'bg-rose-100 text-rose-700 font-medium'
                        : 'text-gray-700 hover:text-rose-600'
                    }
                  `}
                >
                  {toPersianNumber(day)}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const today = new Date();
                setSelectedDate(today);
                onChange(today.toISOString());
                setIsOpen(false);
              }}
              className="text-sm text-rose-600 hover:text-rose-800 font-medium transition-colors"
            >
              امروز
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;