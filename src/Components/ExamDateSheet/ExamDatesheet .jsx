import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Search,
  AlertCircle,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { useSelector } from 'react-redux';
import Loader from '../../Loader/Loader';
import { getStudentById } from '../../api/AllApis';

const ExamDatesheet = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchClassAndExams = async () => {
      try {
        setLoading(true);
        const classRes = await getStudentById(user?.studentId);
        const classId = classRes?.data?.student?.class?._id;
        if (!classId) throw new Error('Class ID not found');
        const examRes = await apiService.get(
          `/datesheet/${user.branchId}/${classId}`,
        );
        setExams(examRes.data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.studentId) fetchClassAndExams();
  }, [user?.studentId, user?.branchId]);

  const getSubjectIcon = (subject) => {
    const icons = {
      Mathematics: '🧮',
      Science: '🧪',
      English: '📚',
      Hindi: '✍️',
      Computer: '💻',
      Drawing: '🎨',
    };
    return icons[subject] || '📝';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: 'from-purple-500 via-pink-500 to-indigo-500',
      Science: 'from-blue-400 via-blue-500 to-purple-500',
      English: 'from-green-400 via-teal-500 to-blue-500',
      Hindi: 'from-orange-400 via-red-500 to-yellow-500',
      Computer: 'from-gray-700 via-blue-900 to-indigo-700',
      Drawing: 'from-pink-500 via-rose-500 to-red-500',
    };
    return colors[subject] || 'from-slate-400 via-slate-500 to-slate-600';
  };

  const getStatusInfo = (exam) => {
    const dayLeft = exam.dayLeft;
    if (exam.dynamicStatus === 'completed') {
      return {
        text: 'Completed',
        color: 'bg-green-100 text-green-900 shadow-md',
        icon: <CheckCircle className="w-5 h-5" />,
      };
    }
    if (dayLeft === 0) {
      return {
        text: 'Today',
        color:
          'bg-orange-300/80 text-orange-900 shadow rounded shadow-orange-300',
        icon: <AlertCircle className="w-5 h-5" />,
      };
    }
    if (dayLeft === 1) {
      return {
        text: 'Tomorrow',
        color: 'bg-emerald-100 text-emerald-900 shadow-sm',
        icon: <Bell className="w-5 h-5" />,
      };
    }
    return {
      text: `${dayLeft} days left`,
      color:
        dayLeft <= 3
          ? 'bg-red-200 text-red-900'
          : dayLeft <= 7
          ? 'bg-yellow-200 text-yellow-900'
          : 'bg-blue-100 text-blue-800',
      icon: <Calendar className="w-5 h-5" />,
    };
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Filtering & pagination
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'upcoming' && exam.dynamicStatus !== 'completed') ||
      (activeFilter === 'completed' && exam.dynamicStatus === 'completed');
    return matchesSearch && matchesFilter;
  });
  const totalPages = Math.ceil(filteredExams.length / pageSize) || 1;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const examsToDisplay = filteredExams.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  if (loading)
    return <Loader variant="spinner" message="Loading exam schedule" />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100/70 via-slate-100 to-teal-100/90">
        <div className="text-center p-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-300/40">
          <AlertCircle className="w-20 h-20 mx-auto text-red-400 mb-6" />
          <h3 className="text-2xl font-bold mb-2 text-slate-700">
            Error loading exams
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Exams',
      value: exams.length,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Upcoming',
      value: exams.filter((e) => e.dynamicStatus !== 'completed').length,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Completed',
      value: exams.filter((e) => e.dynamicStatus === 'completed').length,
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
    },
    {
      label: 'Today',
      value: exams.filter((e) => e.dayLeft === 0).length,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tl from-indigo-50 via-blue-100/70 to-white px-2 pt-10 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* -------- Search & Filters -------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-md rounded-full border border-blue-300/30 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-slate-700 font-medium text-base transition-all"
              style={{ boxShadow: '0 2px 24px 0 #b2cafd22' }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'upcoming', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-xl scale-110'
                    : 'bg-slate-100/60 text-slate-700 hover:shadow-lg hover:scale-105'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* -------- Stats -------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white/80 rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform will-change-transform group`}
              style={{ boxShadow: '0 4px 32px 0 #c9d1fa1a' }}
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-105`}
              >
                <stat.icon className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              <div className="text-3xl font-extrabold text-slate-800">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* -------- Main Exam Cards as Glassmorphism -------- */}
        <div className="flex flex-wrap gap-10 justify-center">
          {examsToDisplay.map((exam) => {
            const statusInfo = getStatusInfo(exam);
            const dateObj = new Date(exam.date);
            const day = dateObj.getDate();
            const month = dateObj
              .toLocaleString('default', { month: 'short' })
              .toUpperCase();

            return (
              <div
                key={exam._id}
                className="relative max-w-xs min-w-[300px] flex-1 group bg-white/80 glass-card rounded-3xl p-7 pt-5 shadow-2xl border border-blue-100/40
                 hover:-translate-y-4 hover:scale-105 transition-all will-change-transform duration-400 backdrop-blur-2xl hover:border-blue-400 cursor-pointer"
                style={{
                  boxShadow: '0 10px 40px #1497f343, 0 2px 16px #cdd7ee3b',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor(
                        exam.subject,
                      )} rounded-xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-3xl font-black tracking-wider drop-shadow">
                        {day}
                      </span>
                      <span className="text-xs tracking-wide">{month}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors tracking-wide">
                        {exam.subject}
                      </h3>
                      <p className="text-slate-500 text-xs">
                        {getDayName(exam.date)} • {exam.examTitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-5xl drop-shadow">
                    {getSubjectIcon(exam.subject)}
                  </span>
                </div>

                <div className="my-5 border-b border-blue-200/30"></div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <Clock className="w-5 h-5" />
                    <span className="text-base font-semibold tracking-wider">
                      {exam.timing}
                    </span>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3 mt-2 text-slate-700 text-sm font-medium min-h-[36px]">
                    {exam.description || 'No additional description provided'}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </span>
                    <button className="text-blue-600 hover:text-blue-900 text-xs font-bold underline underline-offset-2">
                      Set Reminder
                    </button>
                  </div>
                </div>
                <div className="absolute top-5 right-5 opacity-25 text-5xl pointer-events-none rotate-12 select-none">
                  {getSubjectIcon(exam.subject)}
                </div>
              </div>
            );
          })}
        </div>

        {/* ----------- Custom Pagination ----------- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-14">
            <button
              className={`px-4 py-2 rounded-xl font-bold text-blue-700 bg-white/70 border shadow-sm hover:bg-blue-50 transition
                ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 rounded-full mx-0.5 font-bold text-base transition
                  ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'bg-white text-blue-700 hover:bg-blue-200/70'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className={`px-4 py-2 rounded-xl font-bold text-blue-700 bg-white/70 border shadow-sm hover:bg-blue-50 transition
                ${
                  currentPage === totalPages
                    ? 'opacity-50 pointer-events-none'
                    : ''
                }`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}

        {/* ----------- No data message ----------- */}
        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No exams found
            </h3>
            <p className="text-slate-500 font-medium">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDatesheet;
