import React, { useState, useEffect } from 'react';
import { PlayCircle, FileText, Calendar, MoreHorizontal, X, Youtube, Image as ImageIcon, Clock, BookOpen, Video, ChevronRight, Star, TrendingUp, Award, Target, Zap, Filter, Search, Bell, User, Settings, Home, BarChart3, Brain, Flame, CheckCircle2, AlertTriangle, ArrowUp } from 'lucide-react';

const useAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockAssignments = [
          { 
            _id: '1', 
            title: 'Advanced React Patterns & Performance', 
            subject: 'Frontend Development', 
            dueDate: '2025-08-15T23:59:59Z', 
            progress: 85,
            difficulty: 'Advanced',
            estimatedTime: '2h 45min',
            contentType: 'content',
            priority: 'high',
            instructor: 'Sarah Chen',
            rating: 4.9,
            enrolledStudents: 1247,
            tags: ['React', 'Performance', 'Hooks'],
            content: [
              { id: 'c1', type: 'TEXT', title: 'React Context & State Management', body: 'Learn advanced state management patterns using React Context API, useReducer hook, and performance optimization techniques. This comprehensive guide covers everything from basic context usage to complex state architectures in large-scale applications.' },
              { id: 'c2', type: 'IMAGE', title: 'Component Architecture Diagram', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=400&fit=crop' },
              { id: 'c3', type: 'TEXT', title: 'Performance Optimization Strategies', body: 'Discover React performance optimization techniques including memoization, code splitting, lazy loading, and virtual scrolling. Learn when and how to apply these techniques for maximum performance gains.' },
              { id: 'c4', type: 'TEXT', title: 'Custom Hooks Design Patterns', body: 'Master the art of creating reusable custom hooks that encapsulate complex logic and promote code reusability across your React applications.' }
            ]
          },
          { 
            _id: '2', 
            title: 'Complete Machine Learning Bootcamp', 
            subject: 'Data Science', 
            dueDate: '2025-08-22T23:59:59Z', 
            progress: 32,
            difficulty: 'Intermediate',
            estimatedTime: '4h 30min',
            contentType: 'playlist',
            priority: 'high',
            instructor: 'Dr. Michael Rodriguez',
            rating: 4.8,
            enrolledStudents: 3421,
            tags: ['Python', 'ML', 'Neural Networks'],
            playlist: [
                { id: 'v1', title: 'Introduction to Machine Learning Fundamentals', url: 'https://www.youtube.com/watch?v=ml1', duration: '45 min', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&h=225&fit=crop' },
                { id: 'v2', title: 'Data Preprocessing and Feature Engineering', url: 'https://www.youtube.com/watch?v=ml2', duration: '52 min', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=225&fit=crop' },
                { id: 'v3', title: 'Supervised Learning: Classification & Regression', url: 'https://www.youtube.com/watch?v=ml3', duration: '67 min', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&h=225&fit=crop' },
                { id: 'v4', title: 'Unsupervised Learning and Clustering', url: 'https://www.youtube.com/watch?v=ml4', duration: '58 min', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=225&fit=crop' },
                { id: 'v5', title: 'Neural Networks and Deep Learning', url: 'https://www.youtube.com/watch?v=ml5', duration: '74 min', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&h=225&fit=crop' }
            ]
          },
          { 
            _id: '3', 
            title: 'Digital Marketing Strategy Masterclass', 
            subject: 'Marketing', 
            dueDate: '2025-08-28T23:59:59Z', 
            progress: 100,
            difficulty: 'Beginner',
            estimatedTime: '1h 45min',
            contentType: 'single_video',
            priority: 'medium',
            instructor: 'Emma Thompson',
            rating: 4.7,
            enrolledStudents: 892,
            tags: ['SEO', 'Social Media', 'Analytics'],
            videoUrl: 'https://www.youtube.com/watch?v=marketing',
            videoThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&fit=crop',
            videoDuration: '1h 45min'
          },
          { 
            _id: '4', 
            title: 'UX Design Principles & User Research', 
            subject: 'Design', 
            dueDate: '2025-09-05T23:59:59Z', 
            progress: 0,
            difficulty: 'Intermediate',
            estimatedTime: '3h 15min',
            contentType: 'content',
            priority: 'medium',
            instructor: 'Alex Kim',
            rating: 4.9,
            enrolledStudents: 567,
            tags: ['UX', 'Research', 'Prototyping'],
            content: [
              { id: 'c5', type: 'TEXT', title: 'User-Centered Design Philosophy', body: 'Understand the core principles of user-centered design and how to put users at the heart of every design decision. Learn about empathy mapping, user personas, and journey mapping techniques.' },
              { id: 'c6', type: 'IMAGE', title: 'Design Thinking Process', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&h=400&fit=crop' },
              { id: 'c7', type: 'TEXT', title: 'Conducting Effective User Research', body: 'Master qualitative and quantitative research methods including user interviews, surveys, usability testing, and A/B testing to gather meaningful insights.' }
            ]
          },
          { 
            _id: '5', 
            title: 'Blockchain & Web3 Development', 
            subject: 'Blockchain', 
            dueDate: '2025-09-10T23:59:59Z', 
            progress: 45,
            difficulty: 'Advanced',
            estimatedTime: '5h 20min',
            contentType: 'playlist',
            priority: 'low',
            instructor: 'David Park',
            rating: 4.6,
            enrolledStudents: 234,
            tags: ['Solidity', 'Ethereum', 'DeFi'],
            playlist: [
                { id: 'v6', title: 'Blockchain Fundamentals & Architecture', url: 'https://www.youtube.com/watch?v=blockchain1', duration: '62 min', thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=225&fit=crop' },
                { id: 'v7', title: 'Smart Contract Development with Solidity', url: 'https://www.youtube.com/watch?v=blockchain2', duration: '89 min', thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=400&h=225&fit=crop' },
                { id: 'v8', title: 'Building DApps with Web3.js', url: 'https://www.youtube.com/watch?v=blockchain3', duration: '76 min', thumbnail: 'https://images.unsplash.com/photo-1640161704729-cbe966a08853?q=80&w=400&h=225&fit=crop' }
            ]
          }
        ];

        setTimeout(() => {
            setAssignments(mockAssignments);
            setLoading(false);
        }, 1200);
    }, []);

    return { assignments, loading };
};

// ========================================================================
// 2. MODERN UI COMPONENTS WITH UNIQUE DESIGN
// ========================================================================

const NavigationBar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LearnHub</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 text-violet-600 font-medium">
                <Home className="w-4 h-4" />
                Dashboard
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <BookOpen className="w-4 h-4" />
                Courses
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <BarChart3 className="w-4 h-4" />
                Progress
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search assignments..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ stats }) => {
  return (
    <div className="relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
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
              Transform your career with our comprehensive learning platform. Track progress, 
              engage with interactive content, and achieve your professional goals faster than ever.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-purple-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Learning
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20">
                View Progress
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 font-semibold">Completed</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.completed}</div>
              <div className="text-purple-200 text-sm">Assignments done</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-blue-400 font-semibold">In Progress</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.inProgress}</div>
              <div className="text-purple-200 text-sm">Active learning</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-orange-400 font-semibold">Streak</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">12</div>
              <div className="text-purple-200 text-sm">Days active</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-purple-400 font-semibold">Goals</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">8/10</div>
              <div className="text-purple-200 text-sm">This month</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
            <Clock className="w-4 h-4" />
            2 assignments due this week
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
            <Award className="w-4 h-4" />
            3 certificates earned
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
            <Star className="w-4 h-4" />
            4.8 average score
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ onFilterChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter by:</span>
          </div>
          <select className="px-4 py-2 bg-gray-100 rounded-xl border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-violet-500">
            <option>All Subjects</option>
            <option>Frontend Development</option>
            <option>Data Science</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Blockchain</option>
          </select>
          <select className="px-4 py-2 bg-gray-100 rounded-xl border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-violet-500">
            <option>All Progress</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ModernAssignmentCard = ({ assignment, onOpen }) => {
  const { title, subject, dueDate, progress, contentType, difficulty, estimatedTime, priority, instructor, rating, enrolledStudents, tags } = assignment;
  
  const priorityConfig = {
    high: { color: 'bg-red-500', glow: 'shadow-red-500/20' },
    medium: { color: 'bg-yellow-500', glow: 'shadow-yellow-500/20' },
    low: { color: 'bg-green-500', glow: 'shadow-green-500/20' }
  };

  const difficultyConfig = {
    'Beginner': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🌱' },
    'Intermediate': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🚀' },
    'Advanced': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '⚡' }
  };

  const contentTypeConfig = {
    playlist: { 
      icon: <PlayCircle className="w-5 h-5" />, 
      label: 'Video Course',
      gradient: 'from-red-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-red-50 to-pink-50'
    },
    content: { 
      icon: <BookOpen className="w-5 h-5" />, 
      label: 'Study Guide',
      gradient: 'from-blue-500 to-indigo-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    single_video: {
      icon: <Video className="w-5 h-5" />, // commit changes
      label: 'Video Lesson',
      gradient: 'from-purple-500 to-violet-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-violet-50'
    }
  };

  const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const config = contentTypeConfig[contentType] || contentTypeConfig.content;
  const priorityStyle = priorityConfig[priority];
  const difficultyStyle = difficultyConfig[difficulty];

  return (
    <div className={`group relative ${config.bgPattern} rounded-3xl border border-gray-200/50 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-300/20 hover:-translate-y-3 hover:border-gray-300/50`}>
      {/* Priority & Progress Indicators */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-3 h-3 rounded-full ${priorityStyle.color} ${priorityStyle.glow} shadow-lg`}></div>
        
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className={`${progress === 100 ? 'text-emerald-500' : 'text-violet-500'}`}
                strokeDasharray={`${progress}, 100`}
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Type & Subject */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white shadow-lg`}>
            {config.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{subject}</p>
            <p className="text-sm font-medium text-gray-700">{config.label}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1.5 rounded-xl ${difficultyStyle.bg} ${difficultyStyle.text} text-xs font-semibold flex items-center gap-1`}>
          <span>{difficultyStyle.icon}</span>
          {difficulty}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Instructor & Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{instructor}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{rating}</span>
              <span className="text-xs text-gray-400">• {enrolledStudents} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-white/70 text-gray-600 text-xs font-medium rounded-lg border border-gray-200/50">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft}d left</span>
            {daysLeft <= 3 && (
              <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200/50 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-700 ${progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onOpen(assignment)}
        className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r ${config.gradient} text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-xl hover:shadow-gray-400/30 hover:scale-[1.02] transition-all duration-300 group`}
      >
        {config.icon}
        <span className="font-bold">
          {progress === 0 ? 'Start Learning' : progress === 100 ? 'Review Course' : 'Continue Learning'}
        </span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

// Modal Components (keeping the existing ones but with slight styling updates)
const VideoPlaylistModal = ({ isOpen, onClose, playlist }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
                <PlayCircle className="w-6 h-6" />
              </div>
              Video Course
            </h2>
            <p className="text-gray-500 mt-1">{playlist.length} lessons • Complete at your own pace</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4">
            {playlist.map((video, index) => (
              <a 
                key={video.id} 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 border border-gray-100 hover:border-red-200 hover:shadow-md"
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-20 h-12 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors truncate">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleVideoModal = ({ isOpen, onClose, assignment }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img 
            src={assignment.videoThumbnail} 
            alt={assignment.title} 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <a 
              href={assignment.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-4 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <PlayCircle className="w-12 h-12" />
            </a>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
              <p className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {assignment.videoDuration}
              </p>
            </div>
          </div>
          
          <a 
            href={assignment.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Video
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ContentPortalModal = ({ isOpen, onClose, content }) => {
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    if (isOpen && content?.length > 0) {
      setActiveContent(content[0]);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (!activeContent) return <p className="text-gray-500">Select content to view.</p>;
    
    switch (activeContent.type) {
      case 'TEXT':
        return (
          <div className="prose prose-lg max-w-none">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">{activeContent.title}</h3>
            <div className="text-gray-600 leading-relaxed text-lg">
              {activeContent.body.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        );
      case 'IMAGE':
        return (
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">{activeContent.title}</h3>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={activeContent.url} 
                alt={activeContent.title} 
                className="w-full object-cover"
              />
            </div>
          </div>
        );
      default: 
        return <p>Unsupported content type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-3xl shadow-2xl m-4 flex overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              Study Guide
            </h2>
            <p className="text-gray-500 mt-1">{content.length} chapters</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {content.map((item, index) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveContent(item)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
                    activeContent?.id === item.id 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md' 
                      : 'hover:bg-gray-50 hover:shadow-sm border-2 border-transparent'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    activeContent?.id === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === 'IMAGE' ? 
                        <ImageIcon className="w-4 h-4 flex-shrink-0" /> : 
                        <FileText className="w-4 h-4 flex-shrink-0" />
                      }
                    </div>
                    <p className="font-semibold text-sm leading-tight">{item.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full">
                Chapter {content.findIndex(item => item.id === activeContent?.id) + 1} of {content.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================================================
// 3. MAIN MODERN DASHBOARD
// ========================================================================

const AssignmentBoard = () => {
  const { assignments, loading } = useAssignments();
  const [modalState, setModalState] = useState({ isOpen: false, assignment: null });

  const handleOpenModal = (assignment) => {
    setModalState({ isOpen: true, assignment });
  };
  
  const handleCloseModal = () => {
    setModalState({ isOpen: false, assignment: null });
  };

  // Calculate stats
  const completedCount = assignments.filter(a => a.progress === 100).length;
  const inProgressCount = assignments.filter(a => a.progress > 0 && a.progress < 100).length;
  const notStartedCount = assignments.filter(a => a.progress === 0).length;

  const stats = {
    completed: completedCount,
    inProgress: inProgressCount,
    notStarted: notStartedCount
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-white font-semibold text-lg">Preparing your learning dashboard...</p>
          <p className="text-purple-200 text-sm mt-2">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  const urgentAssignments = assignments.filter(a => {
    const daysLeft = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {/* <NavigationBar /> */}
      
      {/* Hero Section */}
      <HeroSection stats={stats} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Active Assignments</h2>
            <p className="text-gray-600">Continue your learning journey with these personalized courses</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              Sort
            </button>
            <button className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Urgent Assignments Alert */}
        {urgentAssignments.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-800 mb-2 text-lg">⚠️ Urgent Action Required</h3>
                <p className="text-red-700 mb-3">
                  You have <strong>{urgentAssignments.length} assignment{urgentAssignments.length > 1 ? 's' : ''}</strong> due within the next 3 days. 
                  Consider prioritizing these to stay on track with your learning goals.
                </p>
                <div className="flex gap-2">
                  {urgentAssignments.map(assignment => (
                    <span key={assignment._id} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-lg">
                      {assignment.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {assignments.map(assignment => (
            <ModernAssignmentCard 
              key={assignment._id} 
              assignment={assignment} 
              onOpen={handleOpenModal} 
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Level Up Your Skills?</h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their careers with our comprehensive courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-200 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Browse All Courses
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-200 border border-white/20">
              View Learning Path
            </button>
          </div>
        </div>
      </div>
        
      {/* Modals */}
      <VideoPlaylistModal 
        isOpen={modalState.isOpen && modalState.assignment?.contentType === 'playlist'}
        onClose={handleCloseModal}
        playlist={modalState.assignment?.playlist || []}
      />
      
      <SingleVideoModal 
        isOpen={modalState.isOpen && modalState.assignment?.contentType === 'single_video'}
        onClose={handleCloseModal}
        assignment={modalState.assignment}
      />
      
      <ContentPortalModal
        isOpen={modalState.isOpen && modalState.assignment?.contentType === 'content'}
        onClose={handleCloseModal}
        content={modalState.assignment?.content || []}
      />
    </div>
  );
};

export default AssignmentBoard;