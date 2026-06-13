import { useState, useEffect } from 'react';
import { CalendarDays, Info, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import './UnavailabilityCalendar.responsive.css';
import { useTranslation } from 'react-i18next';

interface CustomDateRange {
  start: Date;
  end: Date;
}

interface Props {
  unavailable_periods: (Date | CustomDateRange)[];
  onRemoveRange?: (start_date: Date, end_date: Date) => void;
}

interface InternalDateRange {
  start_date: Date;
  end_date: Date;
}

const UnavailabilityCalendar = ({ unavailable_periods, onRemoveRange }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRanges, setDateRanges] = useState<InternalDateRange[]>([]);
  const { t, i18n } = useTranslation();
  const calendarLocale = i18n.language?.startsWith('bn') ? 'bn-BD' : 'en-US';
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and total days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null); // Empty cells for days before the 1st
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Group individual dates into ranges
  useEffect(() => {
    if (unavailable_periods.length === 0) {
      setDateRanges([]);
      return;
    }

    // Process a mix of Dates and CustomDateRange objects into a flat array of Dates for processing
    const flattenedDates: Date[] = [];
    const directRanges: InternalDateRange[] = [];

    unavailable_periods.forEach(dateItem => {
      if (dateItem instanceof Date) {
        // Simple Date object
        flattenedDates.push(new Date(dateItem));
      } else {
        // It's a CustomDateRange, add it directly to directRanges
        directRanges.push({
          start_date: new Date(dateItem.start),
          end_date: new Date(dateItem.end)
        });
        
        // Also add each day in the range to flattenedDates for the calendar highlighting
        const start = new Date(dateItem.start);
        const end = new Date(dateItem.end);
        const dayCount = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        for (let i = 0; i < dayCount; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          flattenedDates.push(new Date(date));
        }
      }
    });

    // Sort dates
    const sortedDates = [...flattenedDates].sort((a, b) => a.getTime() - b.getTime());
    
    // Group consecutive dates into ranges (for single dates only, ranges are already handled)
    const ranges: InternalDateRange[] = [...directRanges];
    let currentRange: InternalDateRange | null = null;
    
    if (sortedDates.length > 0) {
      sortedDates.forEach((date, index) => {
        if (!currentRange) {
          // Start a new range
          currentRange = {
            start_date: new Date(date),
            end_date: new Date(date)
          };
        } else {
          // Check if this date is consecutive with the current range
          const prevDate = new Date(sortedDates[index - 1]);
          const currentDate = new Date(date);
          const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            // Extend the current range
            currentRange.end_date = new Date(date);
          } else {
            // End the current range and start a new one
            ranges.push(currentRange);
            currentRange = {
              start_date: new Date(date),
              end_date: new Date(date)
            };
          }
        }
        
        // If this is the last date, add the current range
        if (index === sortedDates.length - 1 && currentRange) {
          ranges.push(currentRange);
        }
      });
    }
    
    setDateRanges(ranges);
  }, [unavailable_periods]);
  
  // Function to check if a date is unavailable
  const isDateUnavailable = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0); // Normalize time to start of day
    
    return unavailable_periods.some(date => {
      if (date instanceof Date) {
        const unavailable_period = new Date(date);
        unavailable_period.setHours(0, 0, 0, 0); // Normalize time to start of day
        return checkDate.getTime() === unavailable_period.getTime();
      } else if (typeof date === 'object' && 'start' in date && 'end' in date) {
        const start_date = new Date(date.start);
        const end_date = new Date(date.end);
        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(0, 0, 0, 0);
        return checkDate >= start_date && checkDate <= end_date;
      }
      return false;
    });
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatDateRange = (start_date: Date, end_date: Date) => {
    const formatOptions: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    
    const startFormatted = start_date.toLocaleDateString(calendarLocale, formatOptions);
    const endFormatted = end_date.toLocaleDateString(calendarLocale, formatOptions);
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const handleRemoveRange = (range: InternalDateRange) => {
    if (onRemoveRange) {
      onRemoveRange(range.start_date, range.end_date);
    }
  };

  return (
    <div className="unavailability-calendar-root border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h4 className="unavailability-calendar-title font-medium flex items-center gap-2 mb-4 text-green-700">
        <CalendarDays size={18} className="text-green-600 mr-1" />
        {t('listing.unavailability.calendarTitle')}
      </h4>

      {unavailable_periods.length > 0 ? (
        <div>
          <div className="mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between p-2 bg-green-100 text-green-800">
              <button 
                onClick={goToPreviousMonth}
                className="p-1 rounded-full hover:bg-green-200 text-green-700"
                aria-label={t('listing.unavailability.prevMonth')}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-center font-medium">
                {new Date(currentYear, currentMonth).toLocaleString(calendarLocale, { month: 'long', year: 'numeric' })}
              </div>
              <button 
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-green-200 text-green-700"
                aria-label={t('listing.unavailability.nextMonth')}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-0">
              {[t('weekdays.sun'), t('weekdays.mon'), t('weekdays.tue'), t('weekdays.wed'), t('weekdays.thu'), t('weekdays.fri'), t('weekdays.sat')].map(day => (
                <div key={day} className="unavailability-calendar-weekdays text-center text-xs py-1 bg-green-50 text-green-800 font-medium border-r last:border-r-0">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`unavailability-calendar-day text-center p-2 text-sm border-r last:border-r-0
                    ${day === null ? 'bg-white text-gray-300' : 'bg-white text-gray-700'}
                    ${day !== null && isDateUnavailable(currentYear, currentMonth, day) 
                      ? 'bg-red-400/50 text-red-800 font-medium' 
                      : day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() 
                        ? 'border border-green-300 font-medium' 
                        : ''}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="unavailability-calendar-range font-medium text-sm text-green-700 flex items-center gap-1">
              <CalendarIcon size={14} className="text-green-600" />
              {t('listing.unavailability.rangesTitle')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {dateRanges.map((range, index) => (
                <div key={index} className="unavailability-calendar-range text-sm bg-red-50 text-red-800 px-2 py-1 rounded-md flex items-center gap-2">
                  <span>{formatDateRange(range.start_date, range.end_date)}</span>
                  {onRemoveRange && (
                    <button 
                      onClick={() => handleRemoveRange(range)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={t('listing.unavailability.removeRange')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
          <span className="text-green-600">{t('listing.unavailability.noneSet')}</span>
        </div>
      )}
    </div>
  );
};

export default UnavailabilityCalendar;