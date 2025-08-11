import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays, Mail, Home, GraduationCap, Briefcase, Menu, X, BookOpen,
  CalendarCheck, Trophy, Megaphone, Newspaper, User2, HelpCircle,
  BookOpenText, LayoutGrid, CheckSquare, Bell, ChevronRight, Sparkles,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../../assets/IMG_6340-removebg-preview.png';

const WelcomeBanner = () => {
  const studentName = useSelector((state) => state.auth?.user?.name) || 'Sagar';

  const bannerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6 sm:p-8 rounded-3xl mx-4 sm:mx-6 my-6 overflow-hidden relative"
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-slate-800">
            Welcome Back, {studentName}!
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-2 text-slate-600 max-w-lg">
            Ready to learn something new today? Check your assignments and upcoming events.
          </motion.p>
          <motion.div variants={itemVariants}>
            <button className="mt-6 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 group hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5">
              Go to Dashboard
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        <div className="hidden md:flex justify-end items-center h-full">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full flex items-center justify-center"
          >
            <Sparkles size={80} className="text-white/80" strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Header = () => {
  const [showMore, setShowMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [activePillStyle, setActivePillStyle] = useState({});

  const bottomNavItems = useMemo(() => [
    { label: 'Play Quiz', icon: <HelpCircle size={24} />, link: '/QuizeCards' },
    { label: 'Assignments', icon: <BookOpenText size={24} />, link: '/main/Assignment' },
    { label: 'Calendar', icon: <CalendarDays size={24} />, link: '/main/calander' },
    { label: 'More', icon: <LayoutGrid size={24} />, action: () => setShowMore(true) },
  ], []);

  const moreItems = [
    { label: 'Time Table', icon: <BookOpen size={28} />, link: '/main/timetable', bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
    { label: 'Holidays', icon: <CalendarCheck size={28} />, link: '/main/SchoolHoliday', bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
    { label: 'Date Sheet', icon: <Newspaper size={28} />, link: '/main/ExamDatesheet', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Leave App', icon: <CheckSquare size={28} />, link: '/main/LeaveApplication', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { label: 'Ask Doubts', icon: <HelpCircle size={28} />, link: '/main/ask-doubts', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { label: 'Events', icon: <Megaphone size={28} />, link: '/main/events', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = bottomNavItems.findIndex(item => item.link === currentPath);
    setActiveIndex(currentIndex >= 0 ? currentIndex : null);
  }, [location.pathname, bottomNavItems]);

  useEffect(() => {
    if (activeIndex !== null && navRef.current) {
      const activeButton = navRef.current.children[activeIndex];
      if (activeButton) {
        setActivePillStyle({
          width: activeButton.offsetWidth,
          transform: `translateX(${activeButton.offsetLeft}px)`,
        });
      }
    } else {
      setActivePillStyle({ width: 0, transform: 'translateX(0px)' });
    }
  }, [activeIndex]);

  const SchoolName = useSelector((state) => state.auth?.user?.branch) || 'Modern School';

  const iconButtonVariants = {
    hover: { scale: 1.1, backgroundColor: "rgb(239 246 255)" },
    tap: { scale: 0.9 },
  };

  const showWelcome = () => location?.pathname === '/';



  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/70 flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/QuizeCards')}>
          <img src={img1} alt="Logo" className="h-10 w-auto" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Welcome to</span>
            <h1 className="text-lg font-bold text-slate-800 -mt-0.5">{SchoolName}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {[
            { icon: <Bell />, action: () => navigate('/main/notifications'), notification: true },
            { icon: <Mail />, action: () => navigate('/main/mail') },
            { icon: <User2 />, action: () => navigate('/main/profile') },
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={item.action}
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative group p-2.5 rounded-full"
            >
              {React.cloneElement(item.icon, { className: 'w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors duration-300' })}
              {item.notification && (
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </motion.button>
          ))}
        </div>
      </header>
      {
        showWelcome() && (
          <WelcomeBanner />
        )
      }

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] border-t border-slate-200/70 lg:hidden z-40">
        <div className="relative flex justify-around items-center h-20">
          <motion.div
            className="absolute top-[18px] h-11 bg-indigo-100 rounded-full"
            animate={activePillStyle}
            transition={{ type: 'spring', damping: 18, stiffness: 250 }}
          />
          {bottomNavItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => { item.action ? item.action() : navigate(item.link); }}
              whileTap={{ scale: 0.90 }}
              className="relative z-10 flex flex-col items-center justify-center w-1/4 h-full text-xs font-medium text-slate-600"
            >
              <div className={activeIndex === index ? 'text-indigo-600' : ''}>
                {item.icon}
              </div>
              <span className={`mt-1 font-semibold ${activeIndex === index ? 'text-indigo-600' : 'text-slate-700'}`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 rounded-t-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 pt-3">
                <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-slate-800">Explore More</h2>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowMore(false)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200/70">
                    <X size={22} />
                  </motion.button>
                </div>
                <motion.div
                  className="grid grid-cols-4 gap-3 sm:gap-4 pb-4"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {moreItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-start p-2 rounded-2xl cursor-pointer"
                      onClick={() => { if (item.link) navigate(item.link); setShowMore(false); }}
                    >
                      <div className={`flex items-center justify-center h-16 w-16 rounded-2xl mb-2 transition-all duration-300 ${item.bgColor} shadow-sm`}>
                        {React.cloneElement(item.icon, { className: item.iconColor, strokeWidth: 2 })}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 text-center">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;