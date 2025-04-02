import { useState } from 'react';
import { CalendarDays, Info, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  unavailableDates: Date[];
}

const AvailabilityCalendar = ({ unavailableDates }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  
  // Function to check if a date is unavailable
  const isDateUnavailable = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day).getTime();
    return unavailableDates.some(date => date.getTime() === checkDate);
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
        Unavailability Calendar
      </h4>

      {unavailableDates.length > 0 ? (
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
            
            <div className="grid grid-cols-7 gap-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs py-1 bg-green-50 text-green-800 font-medium border-r last:border-r-0">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`
                    text-center p-2 text-sm border-r last:border-r-0
                    ${day === null ? 'bg-white text-gray-300' : 'bg-white text-gray-700'}
                    ${day !== null && isDateUnavailable(currentYear, currentMonth, day) 
                      ? 'bg-red-200/50 text-red-800 font-medium relative' 
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
            <h4 className="font-medium text-sm text-green-700 flex items-center gap-1">
              <CalendarIcon size={14} className="text-green-600" />
              Unavailable Dates:
            </h4>
            <div className="flex flex-wrap gap-2">
              {unavailableDates.map((date, index) => (
                <div key={index} className="text-sm bg-red-50 text-red-800 px-2 py-1 rounded-md">
                  {date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
          <span className="text-green-600">No unavailable dates set</span>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;