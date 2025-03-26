import { useState } from 'react';
import { AvailabilityPeriod } from '@/types/listings';
import { CalendarDays, Info, Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  availabilityPeriods: AvailabilityPeriod[];
}

const AvailabilityCalendar = ({ availabilityPeriods }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const isLongTermAvailability = availabilityPeriods.some(period => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);

    // If the period is longer than 90 days, consider it "available anytime"
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90 && period.notes === 'Available anytime';
  });
  
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
  
  // Function to check if a date is within any availability period
  const isDateAvailable = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day).getTime();
    
    return availabilityPeriods.some(period => {
      const startDate = new Date(period.startDate).getTime();
      const endDate = new Date(period.endDate).getTime();
      return checkDate >= startDate && checkDate <= endDate;
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h4 className="font-medium flex items-center gap-2 mb-4 text-green-700">
        <CalendarDays size={18} className="text-green-600 mr-1" />
        Availability Calendar
      </h4>

      {isLongTermAvailability ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <Info size={18} className="text-green-600" />
          <span className="text-green-800">Available anytime</span>
        </div>
      ) : availabilityPeriods.length > 0 ? (
        <div>
          <div className="mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between p-2 bg-green-100 text-green-800">
              <button 
                onClick={goToPreviousMonth}
                className="p-1 rounded-full hover:bg-green-200 text-green-700"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-center font-medium">
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <button 
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-green-200 text-green-700"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs py-1 bg-green-50 text-green-800 font-medium">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`
                    text-center p-2 text-sm 
                    ${day === null ? 'bg-white text-gray-300' : 'bg-white text-gray-700'}
                    ${day !== null && isDateAvailable(currentYear, currentMonth, day) 
                      ? 'bg-green-50 text-green-800 font-medium relative' 
                      : day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() 
                        ? 'border border-green-300 font-medium' 
                        : ''}
                  `}
                >
                  {day}
                  {day !== null && isDateAvailable(currentYear, currentMonth, day) && (
                    <span className="absolute bottom-0 right-0">
                      <Check size={12} className="text-green-600" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm text-green-700 flex items-center gap-1">
              <CalendarIcon size={14} className="text-green-600" />
              Available Periods:
            </h4>
            {availabilityPeriods.map((period, index) => (
              <div key={index} className="text-sm border-l-2 border-green-500 pl-2 bg-white p-2 rounded shadow-sm">
                <span className="text-green-800 font-medium">
                  {new Date(period.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} - {new Date(period.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {period.notes && <p className="text-green-600 text-xs mt-1">{period.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
          <span className="text-green-600">No availability periods set</span>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;