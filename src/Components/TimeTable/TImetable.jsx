import { useState, useEffect, useCallback } from "react";
import { Clock, User, BookOpen, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { allTimeTable,getStudentById } from "../../api/AllApis";
import Loader from "../../Loader/Loader";

export const TimeTable = () => {
    const { enqueueSnackbar } = useSnackbar();
        const [timetableData, setTimetableData] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDay, setSelectedDay] = useState(null);
    const [allSubjects, setAllSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStudentLoading, setIsStudentLoading] = useState(false);
    const [isTimetableLoading, setIsTimetableLoading] = useState(false);
    
    const user = useSelector((state) => state.auth?.user);

    // Utility functions
    const generateWeekDays = useCallback(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);

        const days = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                date: date.getDate(),
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                dayFull: date.toLocaleDateString('en', { weekday: 'long' }).toLowerCase(),
                isToday: date.toDateString() === today.toDateString(),
                fullDate: date,
            });
        }
        return days;
    }, []);

    const [weekDays] = useState(() => generateWeekDays());

    const subjects = [
        { name: 'Mathematics', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🔢' },
        { name: 'English', color: 'bg-red-100 text-red-800 border-red-200', icon: '📚' },
        { name: 'Science', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: '🔬' },
        { name: 'Hindi', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '🕉️' },
        { name: 'History', color: 'bg-green-100 text-green-800 border-green-200', icon: '🏛️' },
        { name: 'Geography', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🌍' },
        { name: 'Physics', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '⚛️' },
    ];

    const getSubjectStyle = useCallback((subjectName) => {
        const subject = subjects.find((s) => s.name === subjectName);
        return subject ? subject.color : 'bg-gray-100 text-gray-800 border-gray-200';
    }, []);

    const getSubjectIcon = useCallback((subjectName) => {
        const subject = subjects.find((s) => s.name === subjectName);
        return subject ? subject.icon : '📚';
    }, []);

    const getCurrentDayPeriods = useCallback(() => {
        if (!timetableData?.data?.length) return [];

        const targetDay = selectedDay?.dayFull || getTodayName();
        const allPeriods = [];

        timetableData.data.forEach(timetable => {
            const daySchedule = timetable.schedule?.find(s => s.day === targetDay);
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
        timetableData.data.forEach(timetable => {
            timetable.schedule?.forEach(day => {
                if (day.periods) {
                    allPeriods.push(...day.periods);
                }
            });
        });

        const uniqueSubjects = [...new Set(allPeriods.map(period => period.subject))];
        return uniqueSubjects;
    }, [timetableData]);

    const fetchStudent = useCallback(async () => {
        if (!user?.studentId) {
            return;
        }

        setIsStudentLoading(true);
        try {
            const response = await getStudentById(user.studentId);
            
            if (response?.status && response?.data?.student) {
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
            setError("Missing required data (branch ID or student class)");
            return;
        }

        setIsTimetableLoading(true);
        setError(null);

        try {
            const response = await allTimeTable(user.branchId, studentData.class?._id);
            
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
        const isInitialLoading = isStudentLoading || isTimetableLoading;
        setIsLoading(isInitialLoading);
    }, [isStudentLoading, isTimetableLoading]);

    useEffect(() => {
        if (!selectedDay) {
            const today = weekDays.find(day => day.isToday);
            setSelectedDay(today || weekDays[0]);
        }
    }, [selectedDay, weekDays]);

    const LessonCard = ({ lesson }) => (
        <div 
            className={`${getSubjectStyle(lesson?.subject)} rounded-md border-2 p-3 hover:shadow-xl transition-all duration-300 cursor-pointer group min-h-[120px] transform hover:scale-105`}
            onClick={() => handleEdit(lesson._id)}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-2xl p-2 bg-white bg-opacity-50 rounded-full">
                        {getSubjectIcon(lesson.subject)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{lesson.subject}</h3>
                        <span className="text-sm opacity-75 capitalize">{lesson.type}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.startTime} - {lesson.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="truncate">{lesson.teacher || 'Teacher TBA'}</span>
                </div>
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Classes Today</h3>
            <p className="text-gray-500">
                {selectedDay ? `No classes scheduled for ${selectedDay.day}` : 'Select a day to view schedule'}
            </p>
        </div>
    );

    const LoadingState = () => (
        <Loader variant="spinner" message="loading"/>
    );

    return (
        <div className="max-w-8xl mx-auto w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-auto p-1">
            <div className="bg-white rounded-sm shadow-sm p-4 mb-6">
                <div className="md:flex flex-row items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-sm">
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Timetable</h1>
                            <p className="text-gray-600">
                                {studentData?.name ? `${studentData.name}'s schedule` : 'Manage your class schedule'}
                            </p>
                        </div>
                    </div>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    )}
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-5 gap-4 mb-8 bg-gray-100 p-2 rounded-md">
                    {weekDays.map((day, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedDay(day)}
                            className={`text-center p-2 rounded-md transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                selectedDay?.dayFull === day.dayFull
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                    : day.isToday
                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <div className="text-xs font-medium mb-2 opacity-75">
                                {day.isToday ? 'Today' : day.day}
                            </div>
                            <div className="text-2xl font-bold mb-1">{day.date}</div>
                            <div className="text-sm font-medium">{day.day}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Day Schedule */}
            <div className="bg-white rounded-md shadow-md p-4 mt-3">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedDay ? `${selectedDay.day}'s Schedule` : "Today's Schedule"}
                    </h2>
                </div>

                {isLoading ? (
                    <LoadingState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getCurrentDayPeriods().length > 0 ? (
                            getCurrentDayPeriods().map((period, index) => (
                                <LessonCard key={`${period._id || index}`} lesson={period} />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <EmptyState />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* All Subjects */}
            <div className="bg-white rounded-md shadow-md p-4 mt-5">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">All Subjects</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            className={`${subject.color} rounded-xl border-2 p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                        >
                            <div className="text-3xl mb-2">{subject.icon}</div>
                            <div className="text-sm font-semibold">{subject.name}</div>
                        </div>
                    ))}
                </div>

                {allSubjects.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Subjects in Current Timetable
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allSubjects.map((subject, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};