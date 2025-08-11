import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';

const SchoolHoliday = () => {
  const branchId = useSelector((state) => state.auth.user.branchId);
  const studentId = useSelector((state) => state.auth.user.studentId);
  const currentSchoolId = useSelector((state) => state.auth.user.schoolId);

  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [activeTooltipDate, setActiveTooltipDate] = useState(null);


  const handleDayClick = (event, dateStr) => {
    const dayData = calendarData?.calendar?.find(
      (d) => d.date === dateStr && d.isHoliday,
    );

    if (dayData) {
      // Get click position
      const rect = event.target.getBoundingClientRect();
      setPopupPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setSelectedHoliday(dayData);
    }
  };


useEffect(() => {
  const handleClickOutside = (e) => {
    const isTooltip = e.target.closest('.holiday-tooltip');
    const isDayCell = e.target.closest('.holiday-day-cell');

    // only close tooltip if clicked outside both tooltip and calendar day
    if (!isTooltip && !isDayCell) {
      setActiveTooltipDate(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);



  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await apiService.get(
        `attendance/calendar/${branchId}/${year}/${month}`,
      );

      setCalendarData(response.data);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Calendar API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedHoliday(null); // Close popup when changing months
  };

  const getHolidayTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'national':
        return 'bg-red-500';
      case 'religious':
        return 'bg-orange-500';
      case 'regional':
        return 'bg-blue-500';
      default:
        return 'bg-orange-300';
    }
  };

  const getHolidayTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'national':
        return '🇮🇳';
      case 'religious':
        return '🕉️';
      case 'regional':
        return '🏛️';
      default:
        return '🎉';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderCalendarGrid = () => {
    if (!calendarData) return null;

    const { monthInfo, calendar } = calendarData;
    const daysInMonth = new Date(monthInfo.year, monthInfo.month, 0).getDate();
    const firstDay = new Date(monthInfo.year, monthInfo.month - 1, 1).getDay();
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === monthInfo.year &&
      today.getMonth() + 1 === monthInfo.month;

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthInfo.year}-${monthInfo.month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayData = calendar.find((d) => d.date === dateStr);
      const isToday = isCurrentMonth && today.getDate() === day;
      const isHoliday = dayData?.isHoliday;

    days.push(
      <div
        key={day}
        onClick={() => {
          if (isHoliday) {
            setActiveTooltipDate(
              activeTooltipDate === dateStr ? null : dateStr,
            );
          }
        }}
        className={`relative group holiday-day-cell aspect-square w-full p-1 md:p-2 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
          isToday
            ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
            : 'bg-white'
        } ${
          isHoliday
            ? 'bg-gradient-to-br from-orange-300 to-orange-100 border-blue-500'
            : ''
        }`}
      >
        <div className="flex flex-col h-full items-center justify-center text-center">
          <span
            className={`text-xs md:text-lg font-medium ${
              isToday ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </span>
        </div>

        {isHoliday && (
          <div
            className={`holiday-tooltip absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-30 text-xs bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg p-3
      ${activeTooltipDate === dateStr ? 'block' : 'hidden'} 
      group-hover:block
    `}
          >
            <div className="flex items-center mb-1">
              <div
                className={`w-6 h-6 rounded-full ${getHolidayTypeColor(
                  dayData?.holidayInfo?.type,
                )} flex items-center justify-center text-white mr-2 text-sm`}
              >
                {getHolidayTypeIcon(dayData?.holidayInfo?.type)}
              </div>
              <span className="font-semibold">
                {dayData?.holidayInfo?.name || 'Holiday'}
              </span>
            </div>
          </div>
        )}
      </div>,
    );


    }

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2 relative">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-8 md:h-10 flex items-center justify-center font-semibold text-gray-600 text-xs md:text-sm"
          >
            {day}
          </div>
        ))}
        {/* Calendar days */}
        {days}
      </div>
    );
  };

  const renderHolidaysList = () => {
    if (!calendarData) return null;

    const holidays = calendarData.calendar.filter(
      (day) => day.isHoliday && day.holidayInfo?.schoolId === currentSchoolId,
    );

    if (holidays.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No holidays this month</p>
          <p className="text-sm">Enjoy your regular schedule!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {holidays.map((holiday, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full ${getHolidayTypeColor(
                      holiday.holidayInfo?.type,
                    )} flex items-center justify-center text-white text-xl`}
                  >
                    {getHolidayTypeIcon(holiday.holidayInfo?.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {holiday.holidayInfo?.name || 'Holiday'}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3.5 py-2.5 rounded-full text-xs font-large ${getHolidayTypeColor(
                        holiday.holidayInfo?.type,
                      )} text-black`}
                    >
                      {holiday.holidayInfo?.type || 'Holiday'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(holiday.date)}
                  </div>
                  {holiday.holidayInfo?.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {holiday.holidayInfo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-white" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchCalendarData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-2 rounded-sm overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Calendar Navigation */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200">
            <div className="p-4 md:p-1 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 md:p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                </button>

                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'long',
                      year: 'numeric',
                    }).format(currentDate)}
                  </h2>
                  <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>
                      🎉 {calendarData?.monthInfo?.holidays || 0} Holidays
                    </span>
                    <span>
                      📅 {calendarData?.monthInfo?.totalDays || 0} Days
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 md:p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 relative">
              {renderCalendarGrid()}

              {/* Holiday Popup */}
            
            </div>
          </div>

          {/* Holidays List */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200">
            <div className="p-4 md:p-4 border-b border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500" />
                Holidays This Month
              </h3>
            </div>
            <div className="p-4 md:p-6 max-h-[490px] overflow-y-auto">
              {renderHolidaysList()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolHoliday;
