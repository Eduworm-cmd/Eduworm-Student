import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaTrophy,
  FaClipboardList,
  FaCalendarAlt,
  FaFileAlt,
  FaBullhorn,
  FaUmbrellaBeach,
  FaArrowRight,
} from 'react-icons/fa';

import Header from '../Header/Header';
import CalendarSidebar from '../Calander/CalendarSidebar';
import { useSelector } from 'react-redux';
import { getStudentById } from '../../api/AllApis';
import Loader from '../../Loader/Loader';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slice/userData';
import { MessageCircleQuestionMark, NotebookPen, TentTree } from 'lucide-react';

const AdminPanelLayout = () => {
  const allCards = [
    {
      title: 'Play Quiz',
      url: '/main/QuizeCards',
      description: 'Challenge yourself with interactive quizzes.',
      color: 'from-purple-500 to-purple-700',
      Icon: FaTrophy,
    },
    {
      title: 'Assignments',
      url: '/main/Assignment',
      description: 'View and submit your assignments on time.',
      color: 'from-blue-500 to-blue-700',
      Icon: FaClipboardList,
    },
    {
      title: 'Time Table',
      url: '/main/timetable',
      description: 'Access your weekly class schedule.',
      color: 'from-emerald-500 to-emerald-700',
      Icon: FaCalendarAlt,
    },
    {
      title: 'Date Sheet',
      url: '/main/ExamDatesheet',
      description: 'Check upcoming examination dates.',
      color: 'from-orange-500 to-orange-700',
      Icon: FaFileAlt,
    },
    {
      title: 'Events',
      url: '/main/events',
      description: 'Stay updated with the latest school events.',
      color: 'from-pink-500 to-pink-700',
      Icon: FaBullhorn,
    },
    {
      title: 'Holidays',
      url: '/main/SchoolHoliday',
      description: 'A list of upcoming school holidays.',
      color: 'from-sky-500 to-sky-700',
      Icon: FaUmbrellaBeach,
    },
    {
      title: 'Ask Doubt',
      url: '/main/SchoolHoliday',
      description: 'A list of upcoming school holidays.',
      color: 'from-yellow-500 to-yellow-700',
      Icon: MessageCircleQuestionMark,
    },
    {
      title: 'Leave',
      url: '/main/SchoolHoliday',
      description: 'A list of upcoming school holidays.',
      color: 'from-pink-500 to-pink-700',
      Icon: NotebookPen,
    },
  ];

  const location = useLocation();
  const [featuredCard, setFeaturedCard] = useState(allCards[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(allCards.length / cardsPerPage);

  const paginatedCards = allCards.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );


  useEffect(() => {
    const currentCard = allCards.find((card) => location.pathname.includes(card.url));
    if (currentCard) setFeaturedCard(currentCard);
  }, [location.pathname]);

  const studentId = useSelector((state) => state.auth?.user?.studentId);
  const [studentData, setStudentData] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const userDetails = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    try {
      const response = await getStudentById(studentId);
      if (response.success) {
        dispatch(setUserData(response.data.student));
        setStudentData(response.data.student);
      }
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
          <Loader variant='spinner' message='loading' />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="hidden lg:flex min-h-screen bg-gray-50 w-full">
        <div className="flex-1 p-6 lg:p-8 max-w-[calc(100%-380px)]">
          {/* Featured + Actions */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">

            {/* Featured Card (Clickable) */}
            <Link
              to={featuredCard.url}
              className={`relative w-full md:w-2/5 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-gradient-to-br ${featuredCard.color} overflow-hidden`}
            >
              {/* Floating Badge */}
              <div className="absolute left-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md bg-white/20">
                <featuredCard.Icon className="w-9 h-9 text-white" />
              </div>

              {/* Animated Background Icon - centered vertically */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 animate-float pointer-events-none">
                <featuredCard.Icon className="w-40 h-40" />
              </div>

              {/* Title & Description */}
              <h3 className="mt-38 text-3xl font-bold text-white">{featuredCard.title}</h3>
              <p className="mt-3 text-white/80 text-sm leading-relaxed">{featuredCard.description}</p>

              {/* Button */}
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 transition">
                View Details <FaArrowRight />
              </div>
            </Link>

            <div className="w-full md:w-3/5">
              {/* Header with buttons */}
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className="px-2 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-2 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {paginatedCards.map((card) => {
                  const isActive = featuredCard.title === card.title;
                  return (
                    <Link
                      key={card.title}
                      to={card.url}
                      onMouseEnter={() => setFeaturedCard(card)}
                      className={`group flex items-center justify-between gap-2 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all ${isActive ? 'ring-2 ring-gray-900' : ''}`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${card.color} text-white`}>
                        <card.Icon className="w-5 h-5" />
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col flex-1 ml-3">
                        <p className="font-semibold text-gray-900">{card.title}</p>
                        <span className="text-xs text-gray-500">{card.description}</span>
                      </div>

                      {/* Arrow Icon */}
                      <FaArrowRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Page Content */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-[370px] max-h-300 px-4 py-6 border-l border-gray-200 shadow-inner rounded-xl">
          <CalendarSidebar />
        </aside>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden min-h-screen bg-gray-50 pb-20">
        <Outlet />
      </div>
    </>
  );
};

export default AdminPanelLayout;
