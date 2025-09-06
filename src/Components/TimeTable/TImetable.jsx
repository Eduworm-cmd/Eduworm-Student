import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  ChevronRight,
  MapPin,
  Bell,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { allTimeTable, getStudentById } from '../../api/AllApis';
import { apiService } from '../../api/apiService';

// Random color palette for subjects
const colorPalette = [
  {
    gradient: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: '🔢',
  },
  {
    gradient: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '📚',
  },
  {
    gradient: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    icon: '🔬',
  },
  {
    gradient: 'from-amber-400 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: '🕉️',
  },
  {
    gradient: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '🏛️',
  },
  {
    gradient: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🌍',
  },
  {
    gradient: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: '⚛️',
  },
  {
    gradient: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    icon: '🎨',
  },
  {
    gradient: 'from-indigo-400 to-indigo-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: '💡',
  },
  {
    gradient: 'from-teal-400 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    icon: '🔧',
  },
  {
    gradient: 'from-lime-400 to-lime-600',
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-700',
    icon: '🌱',
  },
  {
    gradient: 'from-rose-400 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    icon: '🌹',
  },
];

// Custom hook to fetch branch weekends
const useBranchWeekends = () => {
  const [weekends, setWeekends] = useState([]);
  const [loading, setLoading] = useState(true);
  const branchId = useSelector((state) => state.auth.user.branchId);

  useEffect(() => {
    const fetchBranchWeekends = async () => {
      if (!branchId) {
        setWeekends([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await apiService.get(
          `auth_SchoolBranch/branches/${branchId}`,
        );

        if (response.success && response.data) {
          const branchData = response?.data?.data;

          if (branchData.weekends && Array.isArray(branchData.weekends)) {
            const mappedWeekends = branchData.weekends.map((day) =>
              day.toLowerCase(),
            );
            setWeekends(mappedWeekends);
          } else {
            setWeekends([]);
          }
        } else {
          setWeekends([]);
        }
      } catch (error) {
        console.error('Error fetching branch weekends:', error);
        setWeekends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchWeekends();
  }, [branchId]);

  return { weekends, loading };
};

export const TimeTable = () => {
  const [timetableData, setTimetableData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);
  const [cardColors, setCardColors] = useState([]);

  const user = useSelector((state) => state.auth?.user);
  const { weekends, loading: weekendsLoading } = useBranchWeekends();

  // Function to generate random colors ensuring no consecutive repetition
  const generateRandomColors = useCallback((count) => {
    if (count === 0) return [];

    const colors = [];
    let lastColorIndex = -1;

    for (let i = 0; i < count; i++) {
      let randomIndex;

      // Ensure no consecutive colors are the same
      do {
        randomIndex = Math.floor(Math.random() * colorPalette.length);
      } while (randomIndex === lastColorIndex && colorPalette.length > 1);

      colors.push(colorPalette[randomIndex]);
      lastColorIndex = randomIndex;
    }

    return colors;
  }, []);

  const generateWeekDays = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Get the start of current week (Monday)
    const currentWeekMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekMonday.setDate(today.getDate() + daysFromMonday);
    currentWeekMonday.setHours(0, 0, 0, 0);

    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    // Generate all 7 days of the week (including weekends)
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentWeekMonday);
      dayDate.setDate(currentWeekMonday.getDate() + i);

      const dayIndex = dayDate.getDay();
      const dayName = dayNames[dayIndex];
      const isWeekend = weekends.includes(dayName);

      days.push({
        date: dayDate.getDate(),
        day: dayDate.toLocaleDateString('en', { weekday: 'short' }),
        dayFull: dayName,
        isToday: dayDate.toDateString() === today.toDateString(),
        fullDate: dayDate,
        isWeekend: isWeekend, // Add weekend flag
      });
    }
    return days;
  }, [weekends]);

  const [weekDays, setWeekDays] = useState([]);

  // Update weekDays when weekends data is loaded
  useEffect(() => {
    if (!weekendsLoading) {
      setWeekDays(generateWeekDays());
    }
  }, [weekendsLoading, weekends, generateWeekDays]);

  // Updated getCurrentDayPeriods - Remove weekend filtering
  const getCurrentDayPeriods = useCallback(() => {
    if (!timetableData?.data?.length) return [];

    const targetDay = selectedDay?.dayFull || getTodayName();
    const allPeriods = [];

    timetableData.data.forEach((timetable) => {
      const daySchedule = timetable.schedule?.find((s) => s.day === targetDay);
      if (daySchedule?.periods) {
        allPeriods.push(...daySchedule.periods);
      }
    });

    return allPeriods;
  }, [timetableData, selectedDay]);

  const getTodayName = useCallback(() => {
    const today = new Date();
    return today.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  }, []);

  const getAllSubjects = useCallback(() => {
    if (!timetableData?.data?.length) return [];

    const allPeriods = [];
    timetableData.data.forEach((timetable) => {
      timetable.schedule?.forEach((day) => {
        if (day.periods) {
          allPeriods.push(...day.periods);
        }
      });
    });

    const uniqueSubjects = [
      ...new Set(allPeriods.map((period) => period.subject)),
    ];
    return uniqueSubjects;
  }, [timetableData]);

  const fetchStudent = useCallback(async () => {
    if (!user?.studentId) {
      return;
    }

    setIsStudentLoading(true);
    try {
      const response = await getStudentById(user.studentId);

      if (response?.success && response?.data?.student) {
        setStudentData(response.data?.student);
        setSelectedClass(response.data.student?.class);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setIsStudentLoading(false);
    }
  }, [user?.studentId]);

  const fetchAllTimetable = useCallback(async () => {
    if (!user?.branchId || !studentData?.class) {
      setError('Missing required data (branch ID or student class)');
      return;
    }

    setIsTimetableLoading(true);
    setError(null);

    try {
      const response = await allTimeTable(
        user.branchId,
        studentData.class?._id,
      );

      if (response?.data?.status && response?.data?.data) {
        setTimetableData(response.data);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setIsTimetableLoading(false);
    }
  }, [user?.branchId, studentData?.class]);

  useEffect(() => {
    if (user?.studentId) {
      fetchStudent();
    }
  }, [user?.studentId, fetchStudent]);

  useEffect(() => {
    if (studentData?.class && user?.branchId) {
      fetchAllTimetable();
    }
  }, [studentData?.class, user?.branchId, fetchAllTimetable]);

  useEffect(() => {
    if (timetableData) {
      const subjects = getAllSubjects();
      setAllSubjects(subjects);
    }
  }, [timetableData, getAllSubjects]);

  useEffect(() => {
    const isInitialLoading =
      isStudentLoading || isTimetableLoading || weekendsLoading;
    setIsLoading(isInitialLoading);
  }, [isStudentLoading, isTimetableLoading, weekendsLoading]);

  useEffect(() => {
    if (!selectedDay && weekDays.length > 0) {
      const today = weekDays.find((day) => day.isToday);
      setSelectedDay(today || weekDays[0]);
    }
  }, [selectedDay, weekDays]);

  // Generate random colors when periods change
  useEffect(() => {
    const periods = getCurrentDayPeriods();
    const colors = generateRandomColors(periods.length);
    setCardColors(colors);
  }, [getCurrentDayPeriods, generateRandomColors]);

  const LessonCard = ({ lesson, index, colorStyle }) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-2 hover:scale-105`}
      onClick={() => handleEdit && handleEdit(lesson._id)}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorStyle.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      ></div>

      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${colorStyle.gradient}`}></div>

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colorStyle.bgColor} shadow-md`}>
              <span className="text-2xl">{colorStyle.icon}</span>
            </div>
            <div>
              <h3 className={`font-bold text-xl ${colorStyle.textColor}`}>
                {lesson.subject}
              </h3>
              <span className="text-sm font-medium text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                {lesson.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium">
              Period {index + 1}
            </div>
          </div>
        </div>

        {/* Time and Teacher Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${colorStyle.gradient}`}
            >
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium">Time</div>
              <div className="font-bold text-gray-900">
                {lesson.startTime} - {lesson.endTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 rounded-lg bg-gray-200">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium">Teacher</div>
              <div className="font-semibold text-gray-900 truncate">
                {lesson.teacher || 'Teacher TBA'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Holiday Card Component
  const HolidayCard = () => (
    <div className="col-span-full">
      <div className="relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-400 opacity-5"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-3xl">🏖️</span>
          </div>

          <h3 className="text-2xl font-bold text-orange-800 mb-2">Holiday</h3>
          <p className="text-orange-700 text-lg mb-4">
            It's {selectedDay?.day}! No classes scheduled today.
          </p>

          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-full">
              <span>🏠</span>
              <span>Family Time</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full">
              <span>🎮</span>
              <span>Rest & Play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => {
    const isWeekend = selectedDay?.isWeekend;

    return (
      <div className="text-center py-16 px-8">
        <div className="relative">
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isWeekend
                ? 'bg-gradient-to-br from-orange-100 to-yellow-100'
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }`}
          >
            {isWeekend ? (
              <span className="text-4xl">🏖️</span>
            ) : (
              <Calendar className="w-12 h-12 text-blue-500" />
            )}
          </div>
          <div
            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
              isWeekend ? 'bg-orange-100' : 'bg-yellow-100'
            }`}
          >
            {isWeekend ? (
              <span className="text-xs">🏠</span>
            ) : (
              <Bell className="w-4 h-4 text-yellow-600" />
            )}
          </div>
        </div>

        <h3
          className={`text-xl font-bold mb-3 ${
            isWeekend ? 'text-orange-800' : 'text-gray-800'
          }`}
        >
          {isWeekend ? 'Holiday' : 'No Classes Today'}
        </h3>

        <p className="text-gray-600 max-w-md mx-auto">
          {isWeekend
            ? `It's a holiday! No classes scheduled for ${selectedDay?.day}. Enjoy your day off!`
            : selectedDay
            ? `Enjoy your free time! No classes scheduled for ${selectedDay.day}`
            : 'Select a day to view your schedule'}
        </p>

        <div className="mt-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isWeekend
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>
              {isWeekend ? 'Relax and enjoy!' : 'Take a break and recharge!'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your schedule...</p>
      </div>
    </div>
  );

  // Updated WeekDayCard - Normal for all days
  const WeekDayCard = ({ day, isSelected, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-1 sm:p-4 md:p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 
          ${
            isSelected
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
              : day.isToday
              ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300 shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
          }`}
      >
        {/* Selected state decorations */}
        {isSelected && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 border border-white rounded-full"></div>
          </div>
        )}

        {/* Weekend/Holiday indicator */}
        {day.isWeekend && (
          <div className="absolute right-2 top-2 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white">🏠</span>
          </div>
        )}

        <div className="relative z-10 text-center">
          <div
            className={`font-semibold mb-1 text-[10px] sm:text-xs ${
              isSelected
                ? 'text-blue-100'
                : day.isToday
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {day.isToday ? 'TODAY' : day.day.toUpperCase()}
          </div>

          <div
            className={`font-bold mb-1 text-xl sm:text-2xl md:text-3xl ${
              isSelected ? 'text-white' : 'text-gray-900'
            }`}
          >
            {day.date}
          </div>

          <div
            className={`hidden sm:block font-medium text-[11px] sm:text-sm ${
              isSelected
                ? 'text-blue-100'
                : day.isToday
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}
          >
            {day.fullDate.toLocaleDateString('en', { month: 'short' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-8xl mx-auto px-4 py-2">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">📚</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-0">
                  My Timetable
                </h1>
                <p className="text-gray-600 text-lg">
                  {studentData?.firstName
                    ? `${studentData.firstName}'s weekly schedule`
                    : 'Manage your class schedule'}
                </p>
              </div>
            </div>
            {studentData?.class && (
              <div className="hidden sm:flex items-center justify-end gap-2 mt-2">
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {studentData.class.className}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">
                  Loading schedule...
                </span>
              </div>
            )}
          </div>

          {/* Week Days Navigation */}
          <div className="mt-8">
            {weekDays.length > 0 ? (
              <div
                className="grid gap-2 sm:gap-4"
                style={{
                  gridTemplateColumns: `repeat(${weekDays.length}, 1fr)`,
                }}
              >
                {weekDays.map((day, index) => (
                  <WeekDayCard
                    key={index}
                    day={day}
                    isSelected={selectedDay?.dayFull === day.dayFull}
                    onClick={() => setSelectedDay(day)}
                  />
                ))}
              </div>
            ) : (
              !weekendsLoading && (
                <div className="text-center py-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-700 font-medium">
                    No school days this week (all days are configured as
                    weekends)
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Current Day Schedule */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedDay
                  ? `${selectedDay.day}'s Schedule`
                  : "Today's Schedule"}
              </h2>
              <p className="text-gray-600">
                {selectedDay?.isWeekend
                  ? 'Holiday'
                  : `${getCurrentDayPeriods().length} classes scheduled`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentDayPeriods().length > 0 ? (
                getCurrentDayPeriods().map((period, index) => (
                  <LessonCard
                    key={`${period._id || index}`}
                    lesson={period}
                    index={index}
                    colorStyle={cardColors[index] || colorPalette[0]}
                  />
                ))
              ) : selectedDay?.isWeekend ? (
                <HolidayCard /> // Show holiday card for weekends
              ) : (
                <div className="col-span-full">
                  <EmptyState />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
