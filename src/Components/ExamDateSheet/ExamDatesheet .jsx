import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Search,
  AlertCircle,
  Bell,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Target,
  Zap,
  CalendarDays,
  Award,
  Brain,
  Sparkles,
  Eye,
  Bookmark,
  Share2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedExam, setSelectedExam] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 6;

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
      Physics: '⚛️',
      Chemistry: '🧬',
      Biology: '🌱',
      History: '📜',
      Geography: '🌍',
      Economics: '💰',
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
      Physics: 'from-indigo-500 via-purple-500 to-pink-500',
      Chemistry: 'from-emerald-500 via-teal-500 to-cyan-500',
      Biology: 'from-green-500 via-emerald-500 to-teal-500',
      History: 'from-amber-500 via-orange-500 to-red-500',
      Geography: 'from-blue-500 via-cyan-500 to-teal-500',
      Economics: 'from-yellow-500 via-orange-500 to-red-500',
    };
    return colors[subject] || 'from-slate-400 via-slate-500 to-slate-600';
  };

  const getStatusInfo = (exam) => {
    const dayLeft = exam.dayLeft;
    if (exam.dynamicStatus === 'completed') {
      return {
        text: 'Completed',
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        priority: 'low',
      };
    }
    if (dayLeft === 0) {
      return {
        text: 'Today',
        color: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200',
        icon: <AlertCircle className="w-4 h-4" />,
        priority: 'high',
      };
    }
    if (dayLeft === 1) {
      return {
        text: 'Tomorrow',
        color: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200',
        icon: <Bell className="w-4 h-4" />,
        priority: 'high',
      };
    }
    return {
      text: `${dayLeft} days left`,
      color:
        dayLeft <= 3
          ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
          : dayLeft <= 7
          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
          : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
      icon: <Calendar className="w-4 h-4" />,
      priority: dayLeft <= 3 ? 'high' : dayLeft <= 7 ? 'medium' : 'low',
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
      (activeFilter === 'completed' && exam.dynamicStatus === 'completed') ||
      (activeFilter === 'urgent' && exam.dayLeft <= 3 && exam.dynamicStatus !== 'completed');
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100/70 via-slate-100 to-teal-100/90"
      >
        <div className="text-center p-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-300/40">
          <AlertCircle className="w-20 h-20 mx-auto text-red-400 mb-6" />
          <h3 className="text-2xl font-bold mb-2 text-slate-700">
            Error loading exams
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
        </div>
      </motion.div>
    );
  }

  const stats = [
    {
      label: 'Total Exams',
      value: exams.length,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Upcoming',
      value: exams.filter((e) => e.dynamicStatus !== 'completed').length,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Completed',
      value: exams.filter((e) => e.dynamicStatus === 'completed').length,
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Urgent',
      value: exams.filter((e) => e.dayLeft <= 3 && e.dynamicStatus !== 'completed').length,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white px-4 pt-6 pb-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Exam Schedule</h1>
              <p className="text-slate-600">Stay organized and never miss an exam</p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-slate-700 font-medium transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all ${
                showFilters 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/70 text-slate-700 hover:bg-white/90'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex gap-2">
              {['all', 'upcoming', 'urgent', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/70 text-slate-700 hover:bg-white/90 hover:scale-105'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Exam Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {examsToDisplay.map((exam, index) => {
              const statusInfo = getStatusInfo(exam);
              const dateObj = new Date(exam.date);
              const day = dateObj.getDate();
              const month = dateObj
                .toLocaleString('default', { month: 'short' })
                .toUpperCase();

              return (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedExam(exam)}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity" />
                  
                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor(exam.subject)} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl font-bold">{day}</span>
                        <span className="text-xs font-medium">{month}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                          {exam.subject}
                        </h3>
                        <p className="text-sm text-slate-600">{getDayName(exam.date)}</p>
                        <p className="text-xs text-slate-500">{exam.examTitle}</p>
                      </div>
                    </div>
                    <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                      {getSubjectIcon(exam.subject)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{exam.timing}</span>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 min-h-[48px] flex items-center">
                      {exam.description || 'No additional description provided'}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  {statusInfo.priority === 'high' && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-8">
            <button
              className={`p-3 rounded-xl font-medium transition-all ${
                currentPage === 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  currentPage === idx + 1
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-blue-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            
            <button
              className={`p-3 rounded-xl font-medium transition-all ${
                currentPage === totalPages 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* No Data Message */}
        {filteredExams.length === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No exams found
            </h3>
            <p className="text-slate-500 font-medium">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>

      {/* Exam Detail Modal */}
      <AnimatePresence>
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedExam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Exam Details</h2>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor(selectedExam.subject)} rounded-2xl flex items-center justify-center text-white`}>
                    <span className="text-2xl">{getSubjectIcon(selectedExam.subject)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedExam.subject}</h3>
                    <p className="text-slate-600">{selectedExam.examTitle}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(selectedExam.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span>{selectedExam.timing}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700">{selectedExam.description || 'No additional description provided'}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Set Reminder
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExamDatesheet;
