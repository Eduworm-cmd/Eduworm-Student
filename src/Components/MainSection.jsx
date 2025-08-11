import { useState, useRef, useEffect } from 'react';
import {
  Search,
  UserPlus,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cardsPerView, setCardsPerView] = useState(4);
  const scrollRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dashboardCards = [
    {
      title: 'Play Quiz',
      icon: <UserPlus className="w-8 h-8" />,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Assignments',
      icon: <FileText className="w-8 h-8" />,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      url: '/ExamDatesheet',
    },
    {
      title: 'School Holiday',
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      url: '/ExamDatesheet',
    },
    {
      title: 'Time Table',
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Date Sheet',
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Change Password',
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
    {
      title: 'Events',
      icon: <CheckSquare className="w-8 h-8" />,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      url: '/events',

    },
  ];

  const courses = [
    {
      id: 'B',
      title: 'Class XI B',
      subject: 'Physics',
      students: 76,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      avatars: [
        { color: 'bg-red-500' },
        { color: 'bg-green-500' },
        { color: 'bg-yellow-500' },
        { color: 'bg-purple-500' },
        { color: 'bg-gray-700', count: '+30' },
      ],
    },
    {
      id: 'C',
      title: 'Class XII C',
      subject: 'Chemistry',
      students: 90,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      avatars: [
        { color: 'bg-red-500' },
        { color: 'bg-green-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-orange-500' },
        { color: 'bg-gray-700', count: '+30' },
      ],
    },
    {
      id: 'D',
      title: 'Class XII D',
      subject: 'Chemistry',
      students: 90,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      avatars: [
        { color: 'bg-red-500' },
        { color: 'bg-green-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-orange-500' },
        { color: 'bg-gray-700', count: '+30' },
      ],
    },
    {
      id: 'E',
      title: 'Class XII E',
      subject: 'Biology',
      students: 85,
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      avatars: [
        { color: 'bg-red-500' },
        { color: 'bg-green-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-orange-500' },
        { color: 'bg-gray-700', count: '+25' },
      ],
    },
    {
      id: 'F',
      title: 'Class XI F',
      subject: 'Mathematics',
      students: 72,
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      avatars: [
        { color: 'bg-red-500' },
        { color: 'bg-green-500' },
        { color: 'bg-blue-500' },
        { color: 'bg-orange-500' },
        { color: 'bg-gray-700', count: '+28' },
      ],
    },
  ];

  // Calendar data - sample attendance data
  const attendanceData = {
    // Present days
    '2025-06-01': 'present',
    '2025-06-03': 'present',
    '2025-06-05': 'present',
    '2025-06-06': 'present',
    '2025-06-10': 'present',
    '2025-06-12': 'present',
    '2025-06-14': 'present',
    '2025-06-17': 'present',

    // Absent days
    '2025-06-04': 'absent',
    '2025-06-11': 'absent',

    // Holiday
    '2025-06-07': 'holiday',
    '2025-06-08': 'holiday',
  };

  const maxIndex = Math.max(0, dashboardCards.length - cardsPerView);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  function renderCalendarDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Empty days at start
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day,
      ).padStart(2, '0')}`;
      const status = attendanceData[dateStr];
      const today =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      let dayClass =
        'h-8 w-8 flex items-center justify-center text-sm rounded-full';

      if (today) {
        dayClass += ' bg-blue-500 text-white font-bold';
      } else if (status === 'present') {
        dayClass += ' bg-green-500 text-white';
      } else if (status === 'absent') {
        dayClass += ' bg-red-500 text-white';
      } else if (status === 'holiday') {
        dayClass += ' bg-blue-300 text-white';
      } else {
        dayClass += ' text-gray-700 hover:bg-gray-100';
      }

      days.push(
        <div key={day} className={dayClass}>
          {day}
        </div>,
      );
    }

    return days;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden max-w-8xl mx-auto">
      {/* Left Content Area */}
      <div className="flex-1 p-6 w-full md:w-3/4">
        {/* Dashboard Cards Swiper */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dashboardCards.slice(0, 10).map((card, index) => (
              <Link to={card.url}>
                <div
                  key={index}
                  className="bg-white flex flex-col items-center rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >

                  <div
                    className={`${card.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <div className={card.iconColor}>{card.icon}</div>
                  </div>
                  <h3 className="text-gray-700 font-medium text-center text-sm">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search group"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className={`${course.bgColor} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${course.bgColor.includes('600')
                            ? 'bg-white text-gray-700'
                            : 'bg-gray-400 text-white'
                          } rounded-full flex items-center justify-center font-bold text-lg mr-4`}
                      >
                        {course.id}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-semibold mb-1 ${course.textColor}`}
                        >
                          {course.title}
                        </h3>
                        <p
                          className={`text-sm ${course.textColor === 'text-white'
                              ? 'text-white opacity-80'
                              : 'text-gray-500'
                            }`}
                        >
                          {course.subject}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className={`text-3xl font-bold ${course.textColor}`}>
                        {course.students}
                      </p>
                      <p
                        className={`text-sm ${course.textColor === 'text-white'
                            ? 'text-white opacity-80'
                            : 'text-gray-500'
                          }`}
                      >
                        Students
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {course.avatars.map((avatar, avatarIndex) => (
                        <div
                          key={avatarIndex}
                          className={`${avatar.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                        >
                          {avatar.count || ''}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Full Height */}
      <div className="w-full md:w-80 bg-white shadow-lg p-6 flex flex-col">
        {/* Profile Section */}
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <div
              className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4"
              onClick={() => navigate('/main/profile')}
            >
              B
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Class XI 65
              </h3>
              <p className="text-gray-500">Mathematicsshjfkj (Group)</p>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex space-x-2 mb-8">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              ATTENDANCE
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300">
              HOLIDAY
            </button>
          </div>

          {/* Calendar Section */}
          <div className="overflow-hidden">
            <div className="bg-white rounded-lg p-4">
              {/* Calendar header and days grid */}
              <div className="max-w-[300px] mx-auto">
                {renderCalendarDays()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
