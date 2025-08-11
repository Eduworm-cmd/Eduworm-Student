import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Plus, Briefcase, FileText} from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import { getStudentById } from '../../api/AllApis';

// --- Mock Data for demonstration ---
const mockCalendarData = [
    { date: '2025-08-01', status: 'present' }, { date: '2025-08-04', status: 'present' },
    { date: '2025-08-05', status: 'present' }, { date: '2025-08-06', status: 'absent' },
    { date: '2025-08-07', status: 'present' }, { date: '2025-08-08', status: 'present' },
    { date: '2025-08-15', status: 'holiday' }, { date: '2025-08-26', status: 'holiday' },
];
const mockUpcomingTasks = [
    { icon: <Briefcase />, title: "Science Project", subtitle: "Photosynthesis Model", bgColor: "bg-sky-100", iconColor: "text-sky-600" },
    { icon: <FileText />, title: "Math Assignment 3", subtitle: "Algebraic Expressions", bgColor: "bg-rose-100", iconColor: "text-rose-600" },
];

const ProfileCard = () => {
    const studentId = useSelector((state) => state.auth?.user?.studentId);
    const [studentData, setStudentData] = useState(); 
    const userDetails = async() =>{

        if(!studentId){
            return;
        }
        try {
            const response = await getStudentById(studentId);
            setStudentData(response.data.student);
        } catch (error) {
            console.log();
        }
    }

    useEffect(() =>{
        userDetails();
    },[studentId])
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center">
                <img
                    src={studentData?.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white ring-2 ring-indigo-200"
                />
                <div className="ml-4">
                    <h3 className="font-bold text-lg text-slate-800">{studentData?.firstName}</h3>
                    <p className="text-sm text-slate-500">{studentData?.uniqueId}</p>
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

const CalendarCard = ({ currentMonth, onMonthChange, calendarData, selectedDate, onDateSelect }) => {
    const renderCalendarGrid = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const today = new Date();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`prev-${i}`}></div>);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = calendarData.find(d => d.date === dateStr);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();

            const dotColors = {
                present: 'bg-green-500',
                absent: 'bg-red-500',
                holiday: 'bg-orange-400',
            };

            days.push(
                <div key={day} onClick={() => onDateSelect(date)} className="flex flex-col items-center cursor-pointer py-1">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition-all ${
                        isSelected ? 'bg-indigo-600 text-white' : isToday ? 'bg-indigo-100 text-indigo-600' : 'text-slate-700 hover:bg-slate-100'
                    }`}>
                        {day}
                    </span>
                    {dayData?.status && <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotColors[dayData.status]}`}></div>}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-lg text-slate-800">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-1">
                    <button onClick={() => onMonthChange(-1)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
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
            <div className="grid grid-cols-7 gap-y-1 place-items-center">
                {renderCalendarGrid()}
            </div>
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

const QuickActionsCard = () => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
            <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Edit size={18} className="text-indigo-500"/>
                <span className="font-semibold text-sm text-slate-700">Apply for Leave</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Plus size={18} className="text-indigo-500"/>
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
  const [calendarData, setCalendarData] = useState(mockCalendarData);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onMonthChange = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
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
        />
        <UpcomingTasksCard tasks={mockUpcomingTasks} />
        <QuickActionsCard />
    </div>
  );
};

export default DashboardRightPanel;