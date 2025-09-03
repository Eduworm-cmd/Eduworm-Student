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
          const branchData = response.data.data;

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

  const user = useSelector((state) => state.auth?.user);
  const { weekends, loading: weekendsLoading } = useBranchWeekends();

  // Utility functions
  const generateWeekDays = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
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

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentWeekMonday);
      dayDate.setDate(currentWeekMonday.getDate() + i);

      const dayIndex = dayDate.getDay();
      const dayName = dayNames[dayIndex];

      // Only add days that are not weekends
      if (weekends.length === 0 || !weekends.includes(dayName)) {
        days.push({
          date: dayDate.getDate(),
          day: dayDate.toLocaleDateString('en', { weekday: 'short' }),
          dayFull: dayName,
          isToday: dayDate.toDateString() === today.toDateString(),
          fullDate: dayDate,
        });
      }
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

  const subjects = [
    {
      name: 'Mathematics',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      icon: '🔢',
    },
    {
      name: 'English',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      icon: '📚',
    },
    {
      name: 'Science',
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      icon: '🔬',
    },
    {
      name: 'Hindi',
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      icon: '🕉️',
    },
    {
      name: 'History',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: '🏛️',
    },
    {
      name: 'Geography',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: '🌍',
    },
    {
      name: 'Physics',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      icon: '⚛️',
    },
  ];

  const getSubjectStyle = useCallback((subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    return subject ? subject.color : 'from-gray-400 to-gray-600';
  }, []);

  const getSubjectBgColor = useCallback((subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    return subject ? subject.bgColor : 'bg-gray-50';
  }, []);

  const getSubjectTextColor = useCallback((subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    return subject ? subject.textColor : 'text-gray-700';
  }, []);

  const getSubjectIcon = useCallback((subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    return subject ? subject.icon : '📚';
  }, []);

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

  const handleEdit = (lessonId) => {
    // Handle edit functionality
    console.log('Edit lesson:', lessonId);
  };

  const LessonCard = ({ lesson, index }) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:-translate-y-2 hover:scale-105`}
      onClick={() => handleEdit(lesson._id)}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getSubjectStyle(
          lesson?.subject,
        )} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      ></div>

      {/* Top accent bar */}
      <div
        className={`h-1 bg-gradient-to-r ${getSubjectStyle(lesson?.subject)}`}
      ></div>

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${getSubjectBgColor(
                lesson.subject,
              )} shadow-md`}
            >
              <span className="text-2xl">{getSubjectIcon(lesson.subject)}</span>
            </div>
            <div>
              <h3
                className={`font-bold text-xl ${getSubjectTextColor(
                  lesson.subject,
                )}`}
              >
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
              className={`p-2 rounded-lg bg-gradient-to-r ${getSubjectStyle(
                lesson.subject,
              )}`}
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

        {/* Hover effect indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 rounded-full bg-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16 px-8">
      <div className="relative">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-blue-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Bell className="w-4 h-4 text-yellow-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">No Classes Today</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {selectedDay
          ? `Enjoy your free time! No classes scheduled for ${selectedDay.day}`
          : 'Select a day to view your schedule'}
      </p>
      <div className="mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <MapPin className="w-4 h-4" />
          <span>Take a break and recharge!</span>
        </div>
      </div>
    </div>
  );

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

  const WeekDayCard = ({ day, isSelected, onClick }) => (
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
      {isSelected && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 border border-white rounded-full"></div>
        </div>
      )}

      <div className="relative z-10 text-center">
        <div
          className={`font-semibold mb-1  text-[10px] sm:text-xs ${
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
          {day.dayFull.toLowerCase()}
        </div>
      </div>
    </div>
  );

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
                {getCurrentDayPeriods().length} classes scheduled
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
                  />
                ))
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
