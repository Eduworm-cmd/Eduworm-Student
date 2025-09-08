// Custom hook for exam data management
import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Search,
  AlertCircle,
  Bell,
  CheckCircle,
  Filter,
  CalendarDays,
  Bookmark,
  Share2,
  X,
  BellRing,
  Eye,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../../api/apiService";
import { useSelector } from "react-redux";
import Loader from "../../Loader/Loader";
import { getStudentById } from "../../api/AllApis";
import {
  useCalendarLogic,
  useExamManagement,
  useReminderSystem,
} from "./useExamManagement";

const ExamDatesheet = () => {
  const user = useSelector((state) => state.auth.user);
  const { exams, loading, error, refetch } = useExamManagement(user);
  const { setReminder } = useReminderSystem();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const {
    selectedReminderDate,
    generateCalendarDays,
    selectDate,
    clearSelection,
  } = useCalendarLogic(selectedExam?.date);

  const pageSize = 6;

  const shouldShowReminderButton = useCallback((examDate) => {
    if (!examDate) return false;

    const today = new Date();
    const exam = new Date(examDate);

    const normalizeDate = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return normalizeDate(exam) > normalizeDate(today);
  }, []);

  const getSubjectIcon = useCallback((subject) => {
    const icons = {
      Mathematics: "🧮",
      Science: "🧪",
      English: "📚",
      Hindi: "✍️",
      Computer: "💻",
      Drawing: "🎨",
      Physics: "⚛️",
      Chemistry: "🧬",
      Biology: "🌱",
      History: "📜",
      Geography: "🌍",
      Economics: "💰",
    };
    return icons[subject] || "📝";
  }, []);

  const getSubjectColor = useCallback((subject) => {
    const colors = {
      Mathematics: "from-purple-500 via-pink-500 to-indigo-500",
      Science: "from-blue-400 via-blue-500 to-purple-500",
      English: "from-green-400 via-teal-500 to-blue-500",
      Hindi: "from-orange-400 via-red-500 to-yellow-500",
      Computer: "from-gray-700 via-blue-900 to-indigo-700",
      Drawing: "from-pink-500 via-rose-500 to-red-500",
      Physics: "from-indigo-500 via-purple-500 to-pink-500",
      Chemistry: "from-emerald-500 via-teal-500 to-cyan-500",
      Biology: "from-green-500 via-emerald-500 to-teal-500",
      History: "from-amber-500 via-orange-500 to-red-500",
      Geography: "from-blue-500 via-cyan-500 to-teal-500",
      Economics: "from-yellow-500 via-orange-500 to-red-500",
    };
    return colors[subject] || "from-slate-400 via-slate-500 to-slate-600";
  }, []);

  const getStatusInfo = useCallback((exam) => {
    const dayLeft = exam.dayLeft;
    if (exam.dynamicStatus === "completed") {
      return {
        text: "Completed",
        color:
          "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        priority: "low",
      };
    }
    if (dayLeft === 0) {
      return {
        text: "Today",
        color:
          "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200",
        icon: <AlertCircle className="w-4 h-4" />,
        priority: "high",
      };
    }
    if (dayLeft === 1) {
      return {
        text: "Tomorrow",
        color:
          "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200",
        icon: <Bell className="w-4 h-4" />,
        priority: "high",
      };
    }
    return {
      text: `${dayLeft} days left`,
      color:
        dayLeft <= 3
          ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
          : dayLeft <= 7
          ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200"
          : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200",
      icon: <Calendar className="w-4 h-4" />,
      priority: dayLeft <= 3 ? "high" : dayLeft <= 7 ? "medium" : "low",
    };
  }, []);

  const getDayName = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }, []);

  // Event handlers
  const handleSetReminder = useCallback(async () => {
    if (!selectedReminderDate || !selectedExam || isSettingReminder) return;

    setIsSettingReminder(true);

    try {
      const result = await setReminder(selectedExam, selectedReminderDate);

      if (result.success) {
        // Show success message
        console.log("Reminder set successfully!");

        // Close modal and clear state
        setSelectedExam(null);
        clearSelection();

        // In a real app, you might show a toast notification here
      } else {
        console.error("Failed to set reminder:", result.error);
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
    } finally {
      setIsSettingReminder(false);
    }
  }, [
    selectedReminderDate,
    selectedExam,
    setReminder,
    clearSelection,
    isSettingReminder,
  ]);

  const handleDateSelect = useCallback(
    (day, disabled, date) => {
      if (!disabled && day && date) {
        selectDate(day, disabled, date);
      }
    },
    [selectDate]
  );

  const openReminderModal = useCallback(
    (exam) => {
      setSelectedExam(exam);
      clearSelection();
    },
    [clearSelection]
  );

  const closeReminderModal = useCallback(() => {
    setSelectedExam(null);
    clearSelection();
  }, [clearSelection]);

  const toggleDescription = useCallback((id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // Filtering & pagination
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "upcoming" && exam.dynamicStatus !== "completed") ||
      (activeFilter === "completed" && exam.dynamicStatus === "completed") ||
      (activeFilter === "In Week" &&
        exam.dayLeft <= 3 &&
        exam.dynamicStatus !== "completed");
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredExams.length / pageSize) || 1;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const examsToDisplay = filteredExams.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  if (loading) {
    return <Loader variant="spinner" message="Loading exam schedule" />;
  }

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
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const stats = [
    {
      label: "Total Exams",
      value: exams.length,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Upcoming",
      value: exams.filter((e) => e.dynamicStatus !== "completed").length,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Completed",
      value: exams.filter((e) => e.dynamicStatus === "completed").length,
      icon: CheckCircle,
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50",
    },
    {
      label: "In Week",
      value: exams.filter(
        (e) => e.dayLeft <= 3 && e.dynamicStatus !== "completed"
      ).length,
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white px-4 pt-2 pb-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Exam Schedule
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Stay organized and never miss an exam
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-slate-700 font-medium transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all ${
                showFilters
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white/70 text-slate-700 hover:bg-white/90"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="flex flex-wrap gap-2">
              {["all", "upcoming", "In Week", "completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white/70 text-slate-700 hover:bg-white/90 hover:scale-105"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} flex gap-1 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm`}
            >
              <div className="p-2">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col mt-1">
                <div className="text-2xl sm:text-2xl font-bold text-slate-800">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-600">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Exam Cards Grid */}
        {Array.isArray(examsToDisplay) && examsToDisplay.length > 0 ? (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <AnimatePresence>
              {examsToDisplay.map((exam, index) => {
                const statusInfo = getStatusInfo(exam);
                const dateObj = new Date(exam.date);
                const day = dateObj.getDate();
                const month = dateObj
                  .toLocaleString("default", { month: "short" })
                  .toUpperCase();

                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden min-h-[280px] flex flex-col justify-between"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-14 translate-x-14 opacity-50 group-hover:opacity-70 transition-opacity" />

                    {/* Header */}
                    <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`w-14 h-15 sm:w-16 sm:h-17 bg-gradient-to-br ${getSubjectColor(
                            exam.subject
                          )} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <span className="text-xl sm:text-2xl font-bold">
                            {day}
                          </span>
                          <span className="text-xs">{month}</span>
                          <span className="text-xs">
                            {getDayName(exam.date)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                            {exam.subject}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {exam.examTitle}
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                        {getSubjectIcon(exam.subject)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-3 sm:space-y-4">
                      {/* Timing */}
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{exam.timing}</span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 transition-all duration-300 ease-in-out">
                        <p
                          className={`${
                            expandedDescriptions[exam._id] ? "" : "line-clamp-2"
                          } transition-all duration-300 ease-in-out`}
                        >
                          {exam.description ||
                            "No additional description provided"}
                        </p>

                        {exam.description && exam.description.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(exam._id);
                            }}
                            className="mt-2 text-blue-600 hover:underline text-xs font-medium"
                          >
                            {expandedDescriptions[exam._id]
                              ? "Read Less"
                              : "Read More"}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                        <div className="flex gap-3">
                          {shouldShowReminderButton(exam.date) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openReminderModal(exam);
                              }}
                              className="cursor-pointer flex gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-xs"
                            >
                              <BellRing className="" size={15} />
                              Set Reminder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {statusInfo.priority === "high" && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex justify-center items-end">
            <div className="shadow-sm p-6 bg-sky-300 rounded-2xl text-center flex">
              <h1 className="text-2xl font-semibold text-white">
                No Exam Available
              </h1>
              <TriangleAlert className="text-white ml-3 mt-1" />
            </div>
          </div>
        )}
      </div>

      {/* Exam Set Reminder Modal */}
      <AnimatePresence>
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeReminderModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Set Reminder
                </h2>
                <button
                  onClick={closeReminderModal}
                  className="p-2 cursor-pointer transition-colors bg-gray-300 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() - 1,
                            1
                          )
                        )
                      }
                      className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30"
                      disabled={
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() - 1,
                          1
                        ) <
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        )
                      }
                    >
                      ←
                    </button>

                    <h4 className="text-lg font-semibold text-slate-800">
                      {calendarDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>

                    <button
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() + 1,
                            1
                          )
                        )
                      }
                      className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30"
                      disabled={
                        new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() + 1,
                          1
                        ) >
                        new Date(
                          new Date(selectedExam.date).getFullYear(),
                          new Date(selectedExam.date).getMonth(),
                          1
                        )
                      }
                    >
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-slate-100 p-3 rounded-xl">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, index) => (
                        <div
                          key={index}
                          className="w-10 h-8 flex items-center justify-center text-xs font-semibold text-slate-500"
                        >
                          {day}
                        </div>
                      )
                    )}

                    {generateCalendarDays(calendarDate, selectedExam.date).map(
                      (dayData, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleDateSelect(
                              dayData.day,
                              dayData.disabled,
                              dayData.date
                            )
                          }
                          disabled={dayData.disabled}
                          className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 font-medium
                          ${
                            dayData.disabled
                              ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                              : "text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-1"
                          }
                          ${
                            dayData.isToday
                              ? "ring-2 ring-green-400 bg-green-50 text-green-700 font-bold"
                              : ""
                          }
                          ${
                            dayData.isExamDate
                              ? "bg-blue-600 text-white font-bold ring-2 ring-blue-400 hover:bg-blue-700"
                              : ""
                          }
                          ${
                            dayData.isSelected &&
                            !dayData.isExamDate &&
                            !dayData.isToday
                              ? "bg-purple-100 text-purple-700 ring-2 ring-purple-400 font-bold"
                              : ""
                          }
                        `}
                        >
                          {dayData.day || ""}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-50 ring-2 ring-green-400 rounded"></div>
                      <span className="text-slate-600">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-slate-600">Exam Date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-100 ring-2 ring-purple-400 rounded"></div>
                      <span className="text-slate-600">Selected</span>
                    </div>
                  </div>

                  {selectedReminderDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Reminder Date Selected:
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {selectedReminderDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={clearSelection}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeReminderModal}
                    className="flex-1 py-3 px-4 border cursor-pointer border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSetReminder}
                    disabled={!selectedReminderDate || isSettingReminder}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      selectedReminderDate && !isSettingReminder
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSettingReminder ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Setting...
                      </>
                    ) : (
                      <>
                        <BellRing className="w-4 h-4" />
                        {selectedReminderDate
                          ? "Set Reminder"
                          : "Select Date First"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white/70 text-slate-700 hover:bg-white hover:shadow-md"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/70 text-slate-700 hover:bg-white hover:shadow-md"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white/70 text-slate-700 hover:bg-white hover:shadow-md"
            }`}
          >
            Next
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExamDatesheet;
