import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Info,
  X,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  Gift,
  Home,
  Heart,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';

const SchoolHoliday = () => {
  const branchId = useSelector((state) => state.auth.user.branchId);
  const studentId = useSelector((state) => state.auth.user.studentId);
  const currentSchoolId = useSelector((state) => state.auth.user.schoolId);

  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [activeTooltipDate, setActiveTooltipDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  const handleDayClick = (event, dateStr) => {
    const dayData = calendarData?.calendar?.find(
      (d) => d.date === dateStr && d.isHoliday,
    );

    if (dayData) {
      const rect = event.target.getBoundingClientRect();
      setSelectedHoliday(dayData);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isTooltip = e.target.closest('.holiday-tooltip');
      const isDayCell = e.target.closest('.holiday-day-cell');

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
    setSelectedHoliday(null);
  };

  const getHolidayTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'national':
        return 'from-red-500 to-red-600';
      case 'religious':
        return 'from-orange-500 to-orange-600';
      case 'regional':
        return 'from-blue-500 to-blue-600';
      case 'school':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-orange-400 to-orange-500';
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
      case 'school':
        return '🎓';
      default:
        return '🎉';
    }
  };

  const getHolidayTypeBg = (type) => {
    switch (type?.toLowerCase()) {
      case 'national':
        return 'bg-red-50 border-red-200';
      case 'religious':
        return 'bg-orange-50 border-orange-200';
      case 'regional':
        return 'bg-blue-50 border-blue-200';
      case 'school':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-orange-50 border-orange-200';
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

  const getDaysUntilHoliday = (dateStr) => {
    const holidayDate = new Date(dateStr);
    const today = new Date();
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      days.push(<div key={`empty-${i}`} className="h-16 md:h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthInfo.year}-${monthInfo.month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayData = calendar.find((d) => d.date === dateStr);
      const isToday = isCurrentMonth && today.getDate() === day;
      const isHoliday = dayData?.isHoliday;
      const daysUntil = isHoliday ? getDaysUntilHoliday(dateStr) : null;

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          onClick={() => {
            if (isHoliday) {
              setActiveTooltipDate(
                activeTooltipDate === dateStr ? null : dateStr,
              );
            }
          }}
          className={`relative group holiday-day-cell aspect-square w-full p-1 md:p-2 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isToday
              ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 ring-2 ring-blue-300'
              : 'bg-white hover:bg-gray-50'
          } ${
            isHoliday
              ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 shadow-md hover:shadow-xl'
              : ''
          }`}
        >
          <div className="flex flex-col h-full items-center justify-center text-center">
            <span
              className={`text-sm md:text-lg font-semibold ${
                isToday ? 'text-blue-700' : isHoliday ? 'text-orange-800' : 'text-gray-700'
              }`}
            >
              {day}
            </span>
            {isHoliday && (
              <div className="mt-1">
                <span className="text-xs text-orange-600 font-medium">
                  {getHolidayTypeIcon(dayData?.holidayInfo?.type)}
                </span>
              </div>
            )}
          </div>

          {isHoliday && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: activeTooltipDate === dateStr ? 1 : 0,
                y: activeTooltipDate === dateStr ? 0 : 10
              }}
              className={`holiday-tooltip absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-xl p-4 ${
                activeTooltipDate === dateStr ? 'block' : 'hidden'
              }`}
            >
              <div className="flex items-center mb-2">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${getHolidayTypeColor(
                    dayData?.holidayInfo?.type,
                  )} flex items-center justify-center text-white mr-3 text-sm`}
                >
                  {getHolidayTypeIcon(dayData?.holidayInfo?.type)}
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    {dayData?.holidayInfo?.name || 'Holiday'}
                  </span>
                  <div className="text-xs text-gray-500">
                    {daysUntil > 0 ? `${daysUntil} days away` : daysUntil === 0 ? 'Today!' : 'Past'}
                  </div>
                </div>
              </div>
              {dayData?.holidayInfo?.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {dayData.holidayInfo.description}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2 md:gap-3 relative">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-10 md:h-12 flex items-center justify-center font-bold text-gray-600 text-sm md:text-base"
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Holidays This Month</h3>
          <p className="text-gray-600">Enjoy your regular schedule!</p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4">
        {holidays.map((holiday, index) => {
          const daysUntil = getDaysUntilHoliday(holiday.date);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getHolidayTypeColor(
                        holiday.holidayInfo?.type,
                      )} flex items-center justify-center text-white text-2xl shadow-lg`}
                    >
                      {getHolidayTypeIcon(holiday.holidayInfo?.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {holiday.holidayInfo?.name || 'Holiday'}
                      </h3>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getHolidayTypeBg(
                          holiday.holidayInfo?.type,
                        )}`}
                      >
                        {holiday.holidayInfo?.type || 'Holiday'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(holiday.date)}
                    </div>
                    {daysUntil > 0 && (
                      <div className="flex items-center text-sm text-blue-600 mb-3">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {daysUntil} days until this holiday!
                      </div>
                    )}
                    {holiday.holidayInfo?.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {holiday.holidayInfo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const stats = [
    {
      label: 'Total Holidays',
      value: calendarData?.monthInfo?.holidays || 0,
      icon: Gift,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Days This Month',
      value: calendarData?.monthInfo?.totalDays || 0,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Upcoming Holidays',
      value: calendarData?.calendar?.filter(d => d.isHoliday && getDaysUntilHoliday(d.date) > 0).length || 0,
      icon: Star,
      color: 'from-orange-500 to-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading holiday calendar...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-white" />
          </div>
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={fetchCalendarData}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">School Holidays</h1>
              <p className="text-slate-600">Plan your breaks and stay updated with school calendar</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              📅 Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              📋 List View
            </button>
          </div>
        </motion.div>

        {viewMode === 'calendar' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Calendar Navigation */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'long',
                      year: 'numeric',
                    }).format(currentDate)}
                  </h2>
                  <div className="flex items-center justify-center space-x-6 mt-2 text-sm opacity-90">
                    <span className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {calendarData?.monthInfo?.holidays || 0} Holidays
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {calendarData?.monthInfo?.totalDays || 0} Days
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {renderCalendarGrid()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <MapPin className="w-6 h-6 mr-3" />
                Holidays This Month
              </h3>
            </div>
            <div className="p-6 md:p-8 max-h-[600px] overflow-y-auto">
              {renderHolidaysList()}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolHoliday;
