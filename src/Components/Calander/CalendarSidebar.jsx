import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Plus, Briefcase, FileText, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import { getStudentById } from '../../api/AllApis';
import { useNavigate } from 'react-router-dom';

const mockUpcomingTasks = [
    { icon: <Briefcase />, title: "Science Project", subtitle: "Photosynthesis Model", bgColor: "bg-sky-100", iconColor: "text-sky-600" },
    { icon: <FileText />, title: "Math Assignment 3", subtitle: "Algebraic Expressions", bgColor: "bg-rose-100", iconColor: "text-rose-600" },
];

const ProfileCard = () => {
    const studentId = useSelector((state) => state.auth?.user?.studentId);
    const [studentData, setStudentData] = useState();
    const [loading, setLoading] = useState(true);

    const userDetails = async () => {
        if (!studentId) {
            setLoading(false);
            return;
        }
        try {
            const response = await getStudentById(studentId);
            setStudentData(response.data.student);
        } catch (error) {
            console.log('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        userDetails();
    }, [studentId])

    if (loading) {
        return (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center">
                <img
                    src={studentData?.avatar || '/api/placeholder/64/64'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white ring-2 ring-indigo-200"
                />
                <div className="ml-4">
                    <h3 className="font-bold text-lg text-slate-800">{studentData?.firstName || 'Student'}</h3>
                    <p className="text-sm text-slate-500">{studentData?.uniqueId || 'N/A'}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-4 bg-slate-50 p-2 rounded-xl">
                <div>
                    <p className="font-bold text-indigo-600 text-lg">95.2%</p>
                    <p className="text-xs text-slate-500">Attendance</p>
                </div>
                <div>
                    <p className="font-bold text-indigo-600 text-lg">A+</p>
                    <p className="text-xs text-slate-500">Grade</p>
                </div>
                <div>
                    <p className="font-bold text-indigo-600 text-lg">5</p>
                    <p className="text-xs text-slate-500">Awards</p>
                </div>
            </div>
        </div>
    );
};

const CalendarCard = ({
    currentMonth,
    onMonthChange,
    calendarData,
    selectedDate,
    onDateSelect,
    loading,
    attendancePercentage
}) => {

    const renderCalendarGrid = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const today = new Date();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Empty slots before first day of the month
        const days = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`prev-${i}`}></div>);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toLocaleDateString('en-CA');
            const dayData = calendarData.find(d => d.date === dateStr);
            const isToday = date.toDateString() === today.toDateString();
            const isFutureDate = date > today;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday

            let dotColor = '';
            let status = '';

            // Determine status and background color
            if (isToday) {
                dotColor = 'bg-blue-500 text-white';
                status = 'Today';
            } else if (dayData?.isHoliday) {
                dotColor = 'bg-purple-500 text-white';
                status = 'Holiday';
            } else if (dayData?.attendance) {
                switch (dayData.attendance.status) {
                    case 'present':
                        dotColor = isWeekend ? 'bg-gray-200 text-slate-700' : 'bg-green-500 text-white';
                        status = 'Present';
                        break;
                    case 'absent':
                        dotColor = isWeekend ? 'bg-gray-200 text-slate-700' : 'bg-red-500 text-white';
                        status = 'Absent';
                        break;
                    case 'leave':
                        dotColor = isWeekend ? 'bg-gray-200 text-slate-700' : 'bg-yellow-500 text-white';
                        status = 'Leave';
                        break;
                    default:
                        dotColor = isWeekend ? 'bg-gray-200 text-slate-700' : '';
                        break;
                }
            } else if (isWeekend) {
                dotColor = 'bg-gray-200 text-slate-500';
                status = date.getDay() === 0 ? 'Sunday' : 'Saturday';
            }

            days.push(
                <div
                    key={day}
                    onClick={() => !isFutureDate && onDateSelect(date)}
                    className={`flex flex-col items-center cursor-pointer py-1 transition-all relative group ${isFutureDate ? 'cursor-not-allowed' : ''
                        }`}
                >
                    <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${dotColor || (isFutureDate
                                ? 'text-slate-400'
                                : 'text-slate-700 hover:bg-slate-100'
                            )
                            }`}
                    >
                        {day}
                    </span>
                    {status && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {status}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-bold text-lg text-slate-800">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                    {attendancePercentage !== null && (
                        <p className="text-sm text-slate-500">
                            Attendance: <span className="font-semibold text-indigo-600">{attendancePercentage}%</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() =>  (-1)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <button onClick={() => onMonthChange(1)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-slate-400 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-7 gap-y-1 place-items-center mb-4">
                        {renderCalendarGrid()}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-slate-600">Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-slate-600">Absent</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-slate-600">Leave</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-slate-600">Holiday</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const UpcomingTasksCard = ({ tasks }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-slate-800">Upcoming Tasks</h3>
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:underline">See all</a>
        </div>
        <div className="space-y-3">
            {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${task.bgColor}`}>
                        {React.cloneElement(task.icon, { className: `w-5 h-5 ${task.iconColor}` })}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-700">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const QuickActionsCard = ({onApplyLeave}) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
            <button className="w-full flex items-center cursor-pointer gap-3 text-left p-3 rounded-lg hover:bg-slate-100 transition-colors" onClick={onApplyLeave}>
                <Edit size={18} className="text-indigo-500" />
                <span className="font-semibold text-sm text-slate-700">Apply for Leave</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Plus size={18} className="text-indigo-500" />
                <span className="font-semibold text-sm text-slate-700">Add New Task</span>
            </button>
        </div>
    </div>
);

// ========================================================================
// 🏛️ MAIN COMPONENT
// ========================================================================
const DashboardRightPanel = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarData, setCalendarData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [attendancePercentage, setAttendancePercentage] = useState(null);
    const [monthInfo, setMonthInfo] = useState({});
    const [attendanceStats, setAttendanceStats] = useState({});

    const studentId = useSelector((state) => state.auth?.user?.studentId);
    const schoolBranch = useSelector((state) => state.auth?.user?.branchId);

    const onMonthChange = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    const calculateAttendancePercentage = (data) => {
        if (!data || data.length === 0) return 0;

        const workingDays = data.filter(day =>
            !day.isWeekend &&
            !day.isHoliday &&
            !day.isFutureDate &&
            day.attendance
        );

        if (workingDays.length === 0) return 0;

        const presentDays = workingDays.filter(day =>
            day.attendance?.status === 'present'
        ).length;

        return Math.round((presentDays / workingDays.length) * 100);
    };

    const fetchCalendarData = async (year, month) => {
        if (!studentId || !schoolBranch) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.get(
                `attendance/student-calendar/${schoolBranch}/${studentId}/${year}/${month}`,
            );

            if (response.status === 200 && response.data && Array.isArray(response.data.calendar)) {
                const calendarData = response.data.calendar;
                setCalendarData(calendarData);
                setMonthInfo(response.data.monthInfo || {});
                setAttendanceStats(response.data.attendanceStats || {});

                // Calculate attendance percentage
                const percentage = calculateAttendancePercentage(calendarData);
                setAttendancePercentage(percentage);
            } else {
                setCalendarData([]);
                setMonthInfo({});
                setAttendanceStats({});
                setAttendancePercentage(0);
            }
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setCalendarData([]);
            setAttendancePercentage(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        fetchCalendarData(year, month);
    }, [currentMonth, studentId, schoolBranch]);

    const navigate = useNavigate();

     const handleLeaveApply = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            navigate('/LeaveApplication');
        } else {
            navigate('/main/LeaveApplication');
        }
    };
    return (
        <div className="max-w-sm mx-auto space-y-6">
            <ProfileCard />
            <CalendarCard
                currentMonth={currentMonth}
                onMonthChange={onMonthChange}
                calendarData={calendarData}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                loading={loading}
                attendancePercentage={attendancePercentage}
            />
            <UpcomingTasksCard tasks={mockUpcomingTasks} />
            <QuickActionsCard  onApplyLeave={handleLeaveApply}/>
        </div>
    );
};

export default DashboardRightPanel;