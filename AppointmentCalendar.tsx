import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentCalendarProps {
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export function AppointmentCalendar({ 
  onDateSelect, 
  onTimeSelect, 
  selectedDate, 
  selectedTime 
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots: TimeSlot[] = [
    { time: "9:00 AM", available: true },
    { time: "9:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: false },
    { time: "2:00 PM", available: true },
    { time: "2:30 PM", available: true },
    { time: "3:00 PM", available: true },
    { time: "3:30 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "4:30 PM", available: true },
  ];

  const morningSlots = timeSlots.filter(slot => slot.time.includes("AM"));
  const afternoonSlots = timeSlots.filter(slot => slot.time.includes("PM"));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const isDateAvailable = (date: number) => {
    const today = new Date();
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    return checkDate >= today;
  };

  const isDateSelected = (date: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === date &&
           selectedDate.getMonth() === currentMonth.getMonth() &&
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const handleDateClick = (date: number) => {
    if (!isDateAvailable(date)) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
    onDateSelect(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const available = isDateAvailable(date);
      const selected = isDateSelected(date);
      
      days.push(
        <button
          key={date}
          onClick={() => handleDateClick(date)}
          disabled={!available}
          className={`p-2 text-sm rounded hover:bg-blue-50 transition-colors ${
            selected 
              ? 'bg-blue-600 text-white' 
              : available 
                ? 'text-gray-900 hover:bg-blue-50' 
                : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {date}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Calendar */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-gray-500 font-medium">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
      
      {/* Time Slots */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Times</h3>
        {selectedDate && (
          <p className="text-sm text-gray-600 mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Morning</h4>
            <div className="grid grid-cols-2 gap-2">
              {morningSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => slot.available && onTimeSelect(slot.time)}
                  className={`p-3 text-sm transition-colors ${
                    selectedTime === slot.time 
                      ? 'bg-blue-600 text-white' 
                      : slot.available 
                        ? 'hover:bg-blue-50 hover:border-blue-600' 
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Afternoon</h4>
            <div className="grid grid-cols-2 gap-2">
              {afternoonSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => slot.available && onTimeSelect(slot.time)}
                  className={`p-3 text-sm transition-colors ${
                    selectedTime === slot.time 
                      ? 'bg-blue-600 text-white' 
                      : slot.available 
                        ? 'hover:bg-blue-50 hover:border-blue-600' 
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
