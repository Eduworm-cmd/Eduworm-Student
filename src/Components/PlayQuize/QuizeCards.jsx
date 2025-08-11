import React, { useState, useEffect, useMemo, memo } from 'react';
import { Play, Search, BookOpen, Frown, Filter, Grid3X3, List, Clock, Users, Star, Brain, ArrowRight, X, BarChart, TrendingUp, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiService } from '../../api/apiService';
import Loader from '../../Loader/Loader';

const mockQuizzes = [
  { _id: '1', title: 'Advanced JavaScript Mastery', description: 'Deep dive into ES6+, async patterns, closures, and modern JavaScript ecosystem.', avatar: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop', subject: { title: 'JavaScript' }, difficulty: 'Advanced', duration: 45, questionsCount: 25, rating: 4.8, completions: 1240, category: 'Programming', tags: ['ES6', 'Async', 'Advanced'], createdAt: '2025-08-01T12:00:00Z' },
  { _id: '2', title: 'React Ecosystem Deep Dive', description: 'Master hooks, context, performance optimization, and modern React patterns.', avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', subject: { title: 'React' }, difficulty: 'Expert', duration: 60, questionsCount: 30, rating: 4.9, completions: 890, category: 'Frontend', tags: ['Hooks', 'Performance', 'Production'], createdAt: '2025-08-05T12:00:00Z' },
  { _id: '3', title: 'Modern CSS Architecture', description: 'Explore CSS Grid, Flexbox, custom properties, and modern layout techniques.', avatar: 'https://images.unsplash.com/photo-1524749292158-7540c2494485?w=400&h=300&fit=crop', subject: { title: 'CSS' }, difficulty: 'Intermediate', duration: 35, questionsCount: 20, rating: 4.6, completions: 2100, category: 'Design', tags: ['Grid', 'Flexbox', 'Responsive'], createdAt: '2025-07-20T12:00:00Z' },
  { _id: '4', title: 'Backend System Design', description: 'Learn scalable architecture patterns, database optimization, and API design.', avatar: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop', subject: { title: 'Backend' }, difficulty: 'Advanced', duration: 50, questionsCount: 28, rating: 4.7, completions: 756, category: 'Architecture', tags: ['System Design', 'Scalability', 'APIs'], createdAt: '2025-08-08T12:00:00Z' },
  { _id: '5', title: 'AI & ML Fundamentals', description: 'Introduction to neural networks, data preprocessing, and practical ML.', avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', subject: { title: 'AI/ML' }, difficulty: 'Beginner', duration: 40, questionsCount: 22, rating: 4.5, completions: 1890, category: 'Data Science', tags: ['Neural Networks', 'Python', 'Data'], createdAt: '2025-07-15T12:00:00Z' },
  { _id: '6', title: 'Cloud Architecture Mastery', description: 'Master AWS, microservices, containerization, and DevOps practices.', avatar: 'https://images.unsplash.com/photo-1614741118884-62ac62b3a044?w=400&h=300&fit=crop', subject: { title: 'Cloud' }, difficulty: 'Expert', duration: 55, questionsCount: 35, rating: 4.4, completions: 432, category: 'DevOps', tags: ['AWS', 'Microservices', 'Docker'], createdAt: '2025-08-09T12:00:00Z' }
];
const featuredQuizId = '2'; // ID of the quiz to feature

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


// --- UI COMPONENT: Hero Section ---
const HeroSection = ({ featuredQuiz }) => {
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
      {/* NEW: Featured Quiz Card */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl shadow-blue-500/10 transform transition-transform duration-500 hover:scale-105 group relative">
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs transform rotate-6 flex items-center gap-1">
            <Star size={12} fill="currentColor" /> Featured
          </div>
          <div className="flex gap-4">
            <img src={featuredQuiz.avatar} alt={featuredQuiz.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800">{featuredQuiz.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{featuredQuiz.description}</p>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/30">
            Start Now <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


// --- UI COMPONENT: Filter Bar ---
const FilterBar = ({ onFilterChange, onSortChange, onLayoutChange, layout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ subject: 'All', difficulty: 'All' });
  const [sortBy, setSortBy] = useState('popularity');


  const subjects = ['All', 'JavaScript', 'React', 'CSS', 'Backend', 'AI/ML', 'Cloud'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const sortOptions = [
    { id: 'popularity', name: 'Popularity', icon: TrendingUp },
    { id: 'rating', name: 'Rating', icon: Star },
    { id: 'newest', name: 'Newest', icon: Sparkles }
  ];

  useEffect(() => {
    onFilterChange({ searchTerm, ...filters });
  }, [searchTerm, filters]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
            <select onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Difficulty</label>
            <select onChange={(e) => setFilters(f => ({ ...f, difficulty: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
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
};


// --- UI COMPONENT: Quiz Card ---
const StatIcon = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-1.5" title={label}>
    <Icon size={14} className="text-gray-500" />
    <span className="text-sm font-medium text-gray-600">{value}</span>
  </div>
);

// OPTIMIZATION: Memoized to prevent re-renders
const QuizCard = memo(({ quiz, layout }) => {
  const difficultyColors = {
    Beginner: 'text-green-600 bg-green-100',
    Intermediate: 'text-yellow-600 bg-yellow-100',
    Advanced: 'text-red-600 bg-red-100',
    Expert: 'text-purple-600 bg-purple-100'
  };

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-6 items-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
        <img src={quiz.avatar} alt={quiz.title} className="w-32 h-32 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[quiz.difficulty] || 'text-gray-600 bg-gray-100'}`}>
              {quiz.difficulty}
            </span>
          </div>
          <p className="text-gray-600 mt-1 line-clamp-2">{quiz.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <StatIcon icon={Clock} value={`${quiz.duration}m`} label="Duration" />
              <StatIcon icon={BookOpen} value={quiz.questionsCount} label="Questions" />
              <StatIcon icon={Users} value={quiz.completions.toLocaleString()} label="Completions" />
            </div>
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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
        <img src={quiz.avatar} alt={quiz.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
          <Star size={12} fill="currentColor" /> {quiz.rating}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-blue-600">{quiz.subject.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[quiz.difficulty] || 'text-gray-600 bg-gray-100'}`}>{quiz.difficulty}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600">{quiz.title}</h3>
        <div className="flex items-center gap-4 border-y border-gray-200 py-3 my-3">
          <StatIcon icon={Clock} value={`${quiz.duration}m`} label="Duration" />
          <StatIcon icon={BookOpen} value={quiz.questionsCount} label="Questions" />
          <StatIcon icon={Users} value={quiz.completions.toLocaleString()} label="Completions" />
        </div>
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/30">
          Start Quiz <Play size={16} />
        </button>
      </div>
    </div>
  );
});

// --- MAIN INTERFACE COMPONENT ---
const QuizInterface = () => {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState(allQuizzes);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState('grid');
  const [loading, setLoading] = useState(true);
  const studentId = useSelector((state) => state.auth.user.studentId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // setLoading(true);
        const response = await apiService.get(`quize/student/${studentId}`);

        if (response.data?.success && Array.isArray(response.data.data)) {
          const formattedQuizzes = response.data.data.map((quiz) => ({
            _id: quiz._id,
            title: quiz.title,
            avatar: quiz.avatar,
            description: quiz.description,
            subject: quiz.subject,
            questions: quiz.questions,
          }));

          setAllQuizzes(formattedQuizzes);

          const uniqueSubjects = [
            'All',
            ...new Set(
              formattedQuizzes.map(
                (q) => q.subject?.title || q.topic || 'General',
              ),
            ),
          ];
          setSubjects(uniqueSubjects.filter(Boolean));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [studentId]);

  const quizzesPerPage = layout === 'grid' ? 9 : 5;
  const featuredQuiz = useMemo(() => allQuizzes.find(q => q._id === featuredQuizId) || allQuizzes[0], [allQuizzes]);

  console.log(featuredQuiz);
  
  const handleFilterChange = (filters) => {
    setCurrentPage(1);
    let tempQuizzes = allQuizzes.filter(q =>
      q.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
    if (filters.subject !== 'All') {
      tempQuizzes = tempQuizzes.filter(q => q.subject.title === filters.subject);
    }
    if (filters.difficulty !== 'All') {
      tempQuizzes = tempQuizzes.filter(q => q.difficulty === filters.difficulty);
    }
    setFilteredQuizzes(tempQuizzes);
  };

  const handleSortChange = (sortBy) => {
    setCurrentPage(1);
    const sorted = [...filteredQuizzes].sort((a, b) => {
      if (sortBy === 'popularity') return b.completions - a.completions;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    setFilteredQuizzes(sorted);
  };

  const currentQuizzes = useMemo(() => {
    const first = (currentPage - 1) * quizzesPerPage;
    const last = first + quizzesPerPage;
    return filteredQuizzes.slice(first, last);
  }, [currentPage, quizzesPerPage, filteredQuizzes]);

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

  if(loading){
    return <Loader variant='spinner' message='loading'/>
  }
  // return false;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent -z-10" />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection featuredQuiz={featuredQuiz} />
        <FilterBar onFilterChange={handleFilterChange} onSortChange={handleSortChange} onLayoutChange={setLayout} layout={layout} />

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
          <div className="flex justify-center mt-12">
            {/* Pagination */}
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
      `}</style>
    </div>
  );
};

export default QuizInterface;