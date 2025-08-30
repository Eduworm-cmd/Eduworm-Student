import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Play, Search, BookOpen, Frown, Filter, Grid3X3, List, Clock, Users, Star, Brain, ArrowRight, X, BarChart, TrendingUp, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import Loader from '../../Loader/Loader';
import { useNavigate } from 'react-router-dom';

const useTypewriter = (texts, options = {}) => {
  const { typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 } = options;
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[index];
      if (isDeleting) {
        setText(prev => prev.substring(0, prev.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex(prev => (prev + 1) % texts.length);
        }
      } else {
        setText(prev => currentText.substring(0, prev.length + 1));
        if (text === currentText) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };
    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
};

// Hero Section Component
const HeroSection = memo(({ featuredQuiz }) => {
  const typewriterText = useTypewriter(['Challenge Your Knowledge', 'Expand Your Skills', 'Master New Tech']);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-16 items-center">
      <div className="lg:col-span-3 text-center lg:text-left">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tighter">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">QuizHub</span> for Developers
        </h1>
        <div className="mt-4 h-8 text-xl font-semibold text-gray-700">
          {typewriterText}
          <span className="inline-block w-0.5 h-6 bg-blue-600 ml-1 animate-pulse" />
        </div>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
          An intelligent learning platform with expert-curated quizzes to help you master skills and accelerate your career.
        </p>
      </div>
      {featuredQuiz && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl shadow-blue-500/10 transform transition-transform duration-500 hover:scale-105 group relative">
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs transform rotate-6 flex items-center gap-1">
              <Star size={12} fill="currentColor" /> Featured
            </div>
            <div className="flex gap-4">
              <img
                src={featuredQuiz.avatar || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop'}
                alt={featuredQuiz.title}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{featuredQuiz.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{featuredQuiz.description}</p>
              </div>
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              Start Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Filter Bar Component
const FilterBar = memo(({ onFilterChange, onSortChange, onLayoutChange, layout, subjects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ subject: 'All' });
  const [sortBy, setSortBy] = useState('newest');

  const sortOptions = [
    { id: 'newest', name: 'Newest', icon: Sparkles },
    { id: 'alphabetical', name: 'A-Z', icon: BarChart }
  ];

  // Handle filter changes
  useEffect(() => {
    const filterData = { searchTerm, ...filters };
    onFilterChange(filterData);
  }, [searchTerm, filters.subject]);

  // Handle sort changes
  useEffect(() => {
    onSortChange(sortBy);
  }, [sortBy]);

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200/80 rounded-2xl p-4 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          <Filter size={16} /> Filters
        </button>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button onClick={() => onLayoutChange('grid')} className={`p-2 rounded-md ${layout === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}>
            <Grid3X3 size={20} />
          </button>
          <button onClick={() => onLayoutChange('list')} className={`p-2 rounded-md ${layout === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}>
            <List size={20} />
          </button>
        </div>
      </div>
      <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96 mt-4 pt-4 border-t border-gray-200' : 'max-h-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Sort By</label>
            <div className="flex gap-2">
              {sortOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-sm transition ${sortBy === opt.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <opt.icon size={14} /> {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Stats Icon Component
const StatIcon = memo(({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-1.5" title={label}>
    <Icon size={14} className="text-gray-500" />
    <span className="text-sm font-medium text-gray-600">{value}</span>
  </div>
));

// Quiz Card Component
const QuizCard = memo(({ quiz, layout }) => {
  const questionCount = quiz.questions ? quiz.questions.length : 0;
  const subjectTitle = quiz.subject?.title || quiz.topic || 'General';
  const navigation = useNavigate();

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-6 items-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
        <img
          src={quiz.avatar || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop'}
          alt={quiz.title}
          className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-blue-600 bg-blue-100">
              {subjectTitle}
            </span>
          </div>
          <p className="text-gray-600 mt-1 line-clamp-2">{quiz.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <StatIcon icon={BookOpen} value={questionCount} label="Questions" />
              <StatIcon icon={Brain} value={subjectTitle} label="Subject" />
            </div>
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Start <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={quiz.avatar || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop'}
          alt={quiz.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          <BookOpen size={12} /> {questionCount}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-blue-600">{subjectTitle}</span>
          <span className="text-xs text-gray-500">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600">{quiz.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
        <div className="flex items-center gap-4 border-y border-gray-200 py-3 my-3">
          <StatIcon icon={BookOpen} value={questionCount} label="Questions" />
          <StatIcon icon={Brain} value={subjectTitle} label="Subject" />
        </div>
        <button
          onClick={() => navigation(`/quiz/${quiz._id}`)}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/30">
          Start Quiz <Play size={16} />
        </button>
      </div>
    </div>
  );
});

// Main Quiz Interface Component
const QuizInterface = () => {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState(['All']);

  // Get studentId from Redux store
  const studentId = useSelector((state) => {
    try {
      return state?.auth?.user?.studentId;
    } catch (err) {
      console.error('Error accessing studentId from Redux:', err);
      return null;
    }
  });

  // Fetch quizzes from API
  useEffect(() => {
    let isMounted = true;

    const fetchQuizzes = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiService.get(`quize/student/${studentId}`);

        if (!isMounted) return;

        if (response.data?.success && Array.isArray(response.data.data)) {
          const formattedQuizzes = response.data.data.map((quiz) => ({
            _id: quiz._id,
            title: quiz.title,
            avatar: quiz.avatar,
            description: quiz.description,
            subject: quiz.subject,
            topic: quiz.topic,
            questions: quiz.questions,
            createdAt: quiz.createdAt,
            classId: quiz.classId
          }));

          setAllQuizzes(formattedQuizzes);

          // Extract unique subjects
          const uniqueSubjects = [
            'All',
            ...new Set(
              formattedQuizzes
                .map(q => q.subject?.title || q.topic || 'General')
                .filter(Boolean)
            ),
          ];
          setSubjects(uniqueSubjects);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch quizzes');
          setAllQuizzes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuizzes();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  // Initialize filtered quizzes when allQuizzes changes
  useEffect(() => {
    setFilteredQuizzes(allQuizzes);
    setCurrentPage(1);
  }, [allQuizzes]);

  // Filter handler
  const handleFilterChange = useCallback((filters) => {
    setCurrentPage(1);
    let tempQuizzes = [...allQuizzes];

    // Apply search filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      tempQuizzes = tempQuizzes.filter(q =>
        q.title.toLowerCase().includes(searchLower) ||
        q.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply subject filter
    if (filters.subject !== 'All') {
      tempQuizzes = tempQuizzes.filter(q =>
        (q.subject?.title === filters.subject) ||
        (q.topic === filters.subject)
      );
    }

    setFilteredQuizzes(tempQuizzes);
  }, [allQuizzes]);

  // Sort handler
  const handleSortChange = useCallback((sortBy) => {
    setFilteredQuizzes(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
      return sorted;
    });
  }, []);

  // Layout change handler
  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  const quizzesPerPage = layout === 'grid' ? 9 : 5;
  const featuredQuiz = useMemo(() => allQuizzes[0], [allQuizzes]);

  const currentQuizzes = useMemo(() => {
    const first = (currentPage - 1) * quizzesPerPage;
    const last = first + quizzesPerPage;
    return filteredQuizzes.slice(first, last);
  }, [currentPage, quizzesPerPage, filteredQuizzes]);

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

  if (loading) {
    return <Loader variant='spinner' message='Loading quizzes...' />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Frown size={48} className="mx-auto text-red-400" />
          <h3 className="mt-4 text-xl font-bold text-gray-800">Error Loading Quizzes</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent -z-10" />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection featuredQuiz={featuredQuiz} />
        <FilterBar
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onLayoutChange={handleLayoutChange}
          layout={layout}
          subjects={subjects}
        />

        {currentQuizzes.length > 0 ? (
          <div className={`transition-all duration-300 ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {currentQuizzes.map((quiz, index) => (
              <div key={quiz._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <QuizCard quiz={quiz} layout={layout} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Frown size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-xl font-bold text-gray-800">No Quizzes Found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default QuizInterface;