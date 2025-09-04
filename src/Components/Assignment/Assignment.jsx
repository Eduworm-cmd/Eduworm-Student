import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayCircle,
  FileText,
  Calendar,
  MoreHorizontal,
  X,
  Youtube,
  Image as ImageIcon,
  Clock,
  BookOpen,
  Video,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Filter,
  Search,
  Bell,
  User,
  Settings,
  Home,
  BarChart3,
  Brain,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  MessageCircleQuestionMark,
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = useSelector((state) => state.auth.user.studentId);
  const branchId = useSelector((state) => state.auth.user.branchId);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await apiService.get(
          `superStudent/assign/${studentId}`,
        );
        if (response.success) {
          setAssignments(response.data?.data?.schedules);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]); // Added studentId as dependency

  return { assignments, loading };
};


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
            console.log('No weekends found, using empty array');
            setWeekends([]);
          }
        } else {
          console.log('API call failed, using empty array');
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



const WeekDayCard = ({ day, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-1 sm:p-4 md:p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 
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

const FilterBar = ({ onFilterChange, availableSubjects }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 sm:p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            Filter by:
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-xl border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-violet-500"
            onChange={(e) => onFilterChange?.('subject', e.target.value)}
          >
            <option value="">All Subjects</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-xl border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-violet-500"
            onChange={(e) => onFilterChange?.('progress', e.target.value)}
          >
            <option value="">All Progress</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-xl border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-violet-500"
            onChange={(e) => onFilterChange?.('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="PlayList">PlayList</option>
            <option value="Single Video">Single Video</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ModernAssignmentCard = ({ assignment, onOpen }) => {
  const navigate = useNavigate();

  const hasPlaylist =
    assignment.playlistIds && assignment.playlistIds.length > 0;
  const hasContent = assignment.content && assignment.content.length > 0;
  const hasQuiz = assignment.quizes && assignment.quizes.length > 0;

  const contentType = hasPlaylist
    ? 'playlist'
    : hasContent
    ? 'content'
    : hasQuiz
    ? 'quiz'
    : 'empty';

  const getSubject = () => {
    if (hasPlaylist) {
      return assignment.playlistIds[0]?.Subject?.title || 'Unknown Subject';
    }
    if (hasQuiz) {
      return assignment.quizes[0]?.subject?.title || 'Unknown Subject';
    }
    if (hasContent) {
      return 'Study Material';
    }
    return 'General';
  };

  const subject = getSubject();

  const getContentCount = () => {
    if (hasPlaylist) {
      return assignment.playlistIds[0]?.contents?.[0]?.length || 0;
    }
    if (hasContent) {
      return assignment.content.length;
    }
    if (hasQuiz) {
      return assignment.quizes.length;
    }
    return 0;
  };

  const contentCount = getContentCount();

  const contentTypeConfig = {
    playlist: {
      icon: <PlayCircle className="w-5 h-5" />,
      label: 'Video Course',
      gradient: 'from-red-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-red-50 to-pink-50',
    },
    content: {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Study Material',
      gradient: 'from-blue-500 to-indigo-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    },
    quiz: {
      icon: <MessageCircleQuestionMark className="w-5 h-5" />,
      label: 'Quiz',
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50',
    },
    empty: {
      icon: <FileText className="w-5 h-5" />,
      label: 'Assignment',
      gradient: 'from-gray-500 to-gray-600',
      bgPattern: 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
  };

  const config = contentTypeConfig[contentType];

  const handleAction = () => {
    if (hasQuiz) {
      const quizId = assignment.quizes[0]?._id;
      if (quizId) {
        navigate(`/quiz/${quizId}`);
      }
    } else if (hasPlaylist) {
      onOpen(assignment);
    } else if (hasContent) {
      navigate('/main/content-view', { state: { assignment } });
    }
  };

  return (
    <div
      className={`group relative ${config.bgPattern} rounded-3xl border border-gray-200/50 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-300/20 hover:-translate-y-3 hover:border-gray-300/50`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
          >
            {config.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {subject}
            </p>
            <p className="text-sm font-medium text-gray-700">{config.label}</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors line-clamp-2">
        {assignment.title}
      </h3>

      <div className="mb-4">
        {hasPlaylist && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {assignment.playlistIds[0]?.Preview ||
              assignment.playlistIds[0]?.Title}
          </p>
        )}
        {hasContent && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {assignment.content[0]?.description}
          </p>
        )}
        {hasQuiz && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {assignment.quizes[0]?.description || 'Interactive quiz assignment'}
          </p>
        )}
        {!hasPlaylist && !hasContent && !hasQuiz && (
          <p className="text-sm text-gray-500 italic">No content available</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{assignment.startTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {assignment.createdAt.split('T')[0]}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {hasPlaylist && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Video className="w-4 h-4" />
            <span>{contentCount} videos</span>
          </div>
        )}
        {hasContent && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{contentCount} materials</span>
          </div>
        )}
        {hasQuiz && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageCircleQuestionMark className="w-4 h-4" />
            <span>
              {contentCount} Quiz{contentCount !== 1 ? 'zes' : ''}
            </span>
          </div>
        )}
        {!hasPlaylist && !hasContent && !hasQuiz && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <span>No content available</span>
          </div>
        )}
      </div>

      <button
        onClick={handleAction}
        disabled={!hasPlaylist && !hasContent && !hasQuiz}
        className={`w-full flex items-center justify-center gap-3 ${
          hasPlaylist || hasContent || hasQuiz
            ? `bg-gradient-to-r ${config.gradient} text-white hover:shadow-xl hover:shadow-gray-400/30 hover:scale-[1.02]`
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } font-semibold py-4 px-6 rounded-2xl transition-all duration-300 group`}
      >
        {config.icon}
        <span className="font-bold">
          {hasPlaylist || hasContent || hasQuiz
            ? 'Start Learning'
            : 'No Content Available'}
        </span>
        {(hasPlaylist || hasContent || hasQuiz) && (
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
      </button>
    </div>
  );
};

// Playlist Modal for Video Content
const PlaylistModal = ({ isOpen, onClose, assignment }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (isOpen && assignment?.playlistIds?.[0]?.contents?.[0]?.length > 0) {
      setActiveVideo(assignment.playlistIds[0].contents[0][0]);
    }
  }, [isOpen, assignment]);

  if (!isOpen || !assignment?.playlistIds?.[0]) return null;

  const playlist = assignment.playlistIds[0];
  const videos = playlist.contents?.[0] || [];

  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&\n?#]+)/,
    );
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      : null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-8xl h-[90vh] rounded-3xl shadow-2xl m-4 flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
                <PlayCircle className="w-5 h-5" />
              </div>
              {playlist.Title}
            </h2>
            <p className="text-gray-500 mt-1">{videos.length} videos</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {videos.map((video, index) => (
                <button
                  key={video._id}
                  onClick={() => setActiveVideo(video)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
                    activeVideo?._id === video._id
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-md'
                      : 'hover:bg-gray-50 hover:shadow-sm border-2 border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-16 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/64x48/f3f4f6/9ca3af?text=Video';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-tight mb-1">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {video.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          video.type === 'VIDEO'
                            ? 'bg-red-100 text-red-700'
                            : video.type === 'GAME'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {video.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          video.recordStatus === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {video.recordStatus}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                Video {videos.findIndex((v) => v._id === activeVideo?._id) + 1}{' '}
                of {videos.length}
              </span>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{playlist.Subject?.title}</span> •{' '}
                {playlist.Title}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-scroll">
            <div className="flex-1 p-8">
              {activeVideo ? (
                <div className="h-full flex flex-col">
                  <div className="bg-black rounded-2xl overflow-hidden mb-6 aspect-video">
                    {getEmbedUrl(activeVideo.assetUrl) ? (
                      <iframe
                        src={getEmbedUrl(activeVideo.assetUrl)}
                        title={activeVideo.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Unable to load video</p>
                          <p className="text-sm mt-2 opacity-70">
                            Please check the video URL
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {activeVideo.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {activeVideo.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                        {activeVideo.domain}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                        {activeVideo.subdomain}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          activeVideo.recordStatus === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {activeVideo.recordStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Video ID
                        </p>
                        <p className="text-sm text-gray-800">
                          {activeVideo.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Status
                        </p>
                        <p className="text-sm text-gray-800">
                          {activeVideo.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Created
                        </p>
                        <p className="text-sm text-gray-800">
                          {new Date(activeVideo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Last Updated
                        </p>
                        <p className="text-sm text-gray-800">
                          {new Date(activeVideo.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      Select a video to start watching
                    </p>
                    <p className="text-sm mt-2">
                      Choose from {videos.length} available videos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AssignmentBoard = () => {
  const { assignments, loading } = useAssignments();
  const { weekends, loading: weekendsLoading } = useBranchWeekends();
  const location = useLocation();
  const [selectedDay, setSelectedDay] = useState(null);
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({
    isOpen: false,
    assignment: null,
    modalType: null,
  });
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    progress: '',
    type: '',
  });

  // Generate available subjects from API data
  const availableSubjects = React.useMemo(() => {
    const subjects = new Set();
    assignments?.forEach((assignment) => {
      if (assignment.playlistIds && assignment.playlistIds.length > 0) {
        const subject = assignment.playlistIds[0]?.Subject?.title;
        if (subject) {
          subjects.add(subject);
        }
      }
      if (assignment.quizes && assignment.quizes.length > 0) {
        const subject = assignment.quizes[0]?.subject?.title;
        if (subject) {
          subjects.add(subject);
        }
      }
      if (assignment.content && assignment.content.length > 0) {
        subjects.add('Study Material');
      }
    });
    return Array.from(subjects);
  }, [assignments]);

  // ✅ Always returns YYYY-MM-DD in IST
  const formatToIndiaDate = (date) => {
    return new Date(date).toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
    });
  };

  // Filter assignments by selected day
  const getAssignmentsForDay = (dayDate) => {
    if (!dayDate) return assignments;

    return assignments.filter((assignment) => {
      const assignmentDate = new Date(
        assignment.notificationTime,
      ).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // ✅ IST
      return assignmentDate === dayDate;
    });
  };

  // Apply all filters
  const applyFilters = React.useCallback(
    (dayAssignments) => {
      let filtered = dayAssignments;

      // Subject filter
      if (filters.subject) {
        filtered = filtered.filter((assignment) => {
          const hasPlaylist =
            assignment.playlistIds && assignment.playlistIds.length > 0;
          const hasQuiz = assignment.quizes && assignment.quizes.length > 0;
          const hasContent =
            assignment.content && assignment.content.length > 0;

          let subject = 'General';
          if (hasPlaylist) {
            subject = assignment.playlistIds[0]?.Subject?.title || 'General';
          } else if (hasQuiz) {
            subject = assignment.quizes[0]?.subject?.title || 'General';
          } else if (hasContent) {
            subject = 'Study Material';
          }

          return subject === filters.subject;
        });
      }

      // Type filter
      if (filters.type) {
        filtered = filtered.filter((assignment) => {
          const hasPlaylist =
            assignment.playlistIds && assignment.playlistIds.length > 0;
          const hasContent =
            assignment.content && assignment.content.length > 0;
          const hasQuiz = assignment.quizes && assignment.quizes.length > 0;

          if (filters.type === 'PlayList') return hasPlaylist;
          if (filters.type === 'Single Video')
            return hasContent && !hasPlaylist;
          if (filters.type === 'Quiz') return hasQuiz;
          return true;
        });
      }
      return filtered;
    },
    [filters],
  );

  // Update filtered assignments when day or filters change
  useEffect(() => {
    const dayAssignments = getAssignmentsForDay(selectedDay);
    const filtered = applyFilters(dayAssignments);
    setFilteredAssignments(filtered);
  }, [selectedDay, assignments, applyFilters]);


  const handleOpenModal = (assignment) => {
    const hasPlaylist =
      assignment.playlistIds && assignment.playlistIds.length > 0;
    const hasContent = assignment.content && assignment.content.length > 0;
    const hasQuiz = assignment.quizes && assignment.quizes.length > 0;

    let modalType = null;
    if (hasPlaylist) modalType = 'playlist';
    else if (hasContent) modalType = 'content';
    else if (hasQuiz) modalType = 'quiz';

    if (modalType) {
      setModalState({
        isOpen: true,
        assignment,
        modalType,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      assignment: null,
      modalType: null,
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      progress: '',
      type: '',
    });
  };

  const showCards = location.pathname === '/main/Assignment';

const generateWeekDays = useCallback(() => {
  // Get current date in local timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day in local timezone

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

     if (weekends.length === 0 || !weekends.includes(dayName)) {
       days.push({
         date: dayDate.getDate(),
         day: dayDate.toLocaleDateString('en', { weekday: 'short' }),
         dayFull: dayDate.toLocaleDateString('en', { weekday: 'long' }),
         isToday: dayDate.toDateString() === today.toDateString(),
         todayFullDate: formatToIndiaDate(today), 

         fullDate: dayDate.toLocaleDateString('en-CA', {
           timeZone: 'Asia/Kolkata',
         }),
       });
     }
   }

  return days;
}, [weekends]);

  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    if (!weekendsLoading) {
      setWeekDays(generateWeekDays());
    }
  }, [weekendsLoading, weekends, generateWeekDays]);

  useEffect(() => {
    if (!selectedDay && weekDays.length > 0) {
      const today = weekDays.find((day) => day.isToday);
      setSelectedDay(today ? today.fullDate : weekDays[0].fullDate);
    }
  }, [selectedDay, weekDays]);

  if (loading || weekendsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-white font-semibold text-lg">
            Preparing your learning dashboard...
          </p>
          <p className="text-purple-200 text-sm mt-2">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: assignments?.length,
    playlist: assignments?.filter(
      (a) => a.playlistIds && a.playlistIds.length > 0,
    ).length,
    content: assignments?.filter((a) => a.content && a.content.length > 0)
      .length,
    quiz: assignments?.filter((a) => a.quizes && a.quizes.length > 0).length,
    active: assignments?.filter((a) => a.isActive).length,
  };

  const selectedDayObj = weekDays.find((day) => day.fullDate === selectedDay);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  ✨ Learning Dashboard
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Master New
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Skills Daily
                </span>
              </h1>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Transform your learning journey with interactive courses and
                study materials. Track your progress and achieve your
                educational goals faster than ever.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-violet-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Start Learning
                </button>
                <button className="px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  View Progress
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-semibold">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.total}
                </div>
                <div className="text-purple-200 text-sm">Assignments</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <PlayCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-red-400 font-semibold">
                    Video Courses
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.playlist}
                </div>
                <div className="text-purple-200 text-sm">
                  Interactive content
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-indigo-400 font-semibold">
                    Study Materials
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.content}
                </div>
                <div className="text-purple-200 text-sm">Reading materials</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    <MessageCircleQuestionMark className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-green-400 font-semibold">Quizzes</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.quiz}
                </div>
                <div className="text-purple-200 text-sm">Practice tests</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <Clock className="w-4 h-4" />
              {
                assignments.filter((a) => {
                  const daysLeft = Math.ceil(
                    (new Date(a.notificationTime) - new Date()) /
                      (1000 * 60 * 60 * 24),
                  );
                  return daysLeft <= 7 && daysLeft > 0;
                }).length
              }{' '}
              assignments due this week
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <Star className="w-4 h-4" />
              Multiple subjects available
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <Target className="w-4 h-4" />
              Interactive learning content
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
              <Calendar className="w-4 h-4" />
              Showing {weekDays.length} working days per week
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Your Active Assignments
              {selectedDayObj && (
                <span className="text-lg font-normal text-gray-600 ml-3">
                  for{' '}
                  {selectedDayObj.isToday
                    ? 'Today'
                    : selectedDayObj.day + ', ' + selectedDayObj.date}
                </span>
              )}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Continue your learning journey with these personalized courses
            </p>
          </div>
        </div>

        {/* Week Day Selector - Only show if weekDays are loaded */}
        {weekDays.length > 0 && (
          <div className="mb-8">
            <div
              className={`grid gap-2 sm:gap-4`}
              style={{ gridTemplateColumns: `repeat(${weekDays.length}, 1fr)` }}
            >
              {weekDays.map((day, index) => (
                <WeekDayCard
                  key={index}
                  day={day}
                  isSelected={selectedDay === day.fullDate}
                  onClick={() => setSelectedDay(day.fullDate)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          availableSubjects={availableSubjects}
        />

        {/* Assignment Grid */}
        {filteredAssignments.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              showCards ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
            } gap-6 sm:gap-8`}
          >
            {filteredAssignments.map((assignment, index) => (
              <ModernAssignmentCard
                key={assignment._id || index}
                assignment={assignment}
                onOpen={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {assignments.length === 0
                ? 'No assignments found'
                : selectedDayObj
                ? `No assignments for ${
                    selectedDayObj.isToday ? 'today' : selectedDayObj.day
                  }`
                : 'No matching assignments'}
            </h3>
            <p className="text-gray-600 mb-6">
              {assignments.length === 0
                ? "You don't have any active assignments at the moment."
                : selectedDayObj &&
                  getAssignmentsForDay(selectedDay).length === 0
                ? `No assignments scheduled for ${
                    selectedDayObj.isToday ? 'today' : 'this day'
                  }. Try selecting a different day.`
                : 'Try adjusting your filters to see more assignments.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(filters.subject || filters.type || filters.progress) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => {
                  const today = weekDays.find((day) => day.isToday);
                  if (today) setSelectedDay(today.fullDate);
                }}
                className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
              >
                {assignments.length === 0
                  ? 'Browse Courses'
                  : "View Today's Assignments"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PlaylistModal
        isOpen={modalState.isOpen && modalState.modalType === 'playlist'}
        onClose={handleCloseModal}
        assignment={modalState.assignment}
      />
    </div>
  );
};

export default AssignmentBoard;
