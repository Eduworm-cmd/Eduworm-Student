import { Calendar, EyeIcon, FileText, Users, X, Search, Filter, CalendarDays, Sparkles, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { getEvents } from '../../api/AllApis';
import { motion, AnimatePresence } from 'framer-motion';

export const Events = () => {
  const user = useSelector((state) => state.auth.user);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysLeftColor = (daysLeft) => {
    const days = parseInt(daysLeft);
    if (days < 0) return 'bg-green-100 text-green-800 border border-green-200';
    if (days === 0) return 'bg-orange-100 text-orange-800 border border-orange-200';
    if (days <= 3) return 'bg-red-100 text-red-800 border border-red-200';
    if (days <= 7) return 'bg-blue-100 text-blue-800 border border-blue-200';
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getDaysLeftText = (daysLeft) => {
    const days = parseInt(daysLeft);
    if (days < 0) return 'Completed';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  };

  const bgColors = [
    'from-blue-500 via-indigo-500 to-purple-500',
    'from-rose-500 via-pink-500 to-red-500',
    'from-slate-500 via-slate-600 to-slate-700',
  ];

  function getRandomBgColor() {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  }

  const fetchEvent = async () => {
    try {
      const response = await getEvents(user?.branchId);
      setEventData(response?.data?.data || []);
    } catch (error) {
      console.log(error);
      setEventData([]);
    }
  }


  useEffect(() => {
    if (user?.branchId) {
      fetchEvent();
    }
  }, [user?.branchId]);

  const filteredEvents = useMemo(() => {
    const list = Array.isArray(eventData) ? eventData : [];

    return list.filter(ev => {
      const matchSearch = (ev.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const days = parseInt(ev.leftDay);

      switch (activeFilter) {
        case 'all':
          return matchSearch;
        case 'today':
          return matchSearch && days === 0;
        case 'In week':
          return matchSearch && days > 0 && days <= 7;
        case 'upcoming':
          return matchSearch && days > 7;
        case 'completed':
          return matchSearch && days < 0;
        default:
          return matchSearch;
      }
    });
  }, [eventData, searchTerm, activeFilter]);


  const stats = useMemo(() => {
    const total = filteredEvents.length || 0;
    const today = filteredEvents.filter(e => parseInt(e.leftDay) === 0).length;
    const week = filteredEvents.filter(e => parseInt(e.leftDay) > 0 && parseInt(e.leftDay) <= 7).length;
    const completed = filteredEvents.filter(e => parseInt(e.leftDay) < 0).length;

    return [
      { label: 'Total', value: total, color: 'from-blue-500 to-cyan-500' },
      { label: 'Today', value: today, color: 'from-green-500 to-emerald-500' },
      { label: 'This Week', value: week, color: 'from-purple-500 to-pink-500' },
      { label: 'Completed', value: completed, color: 'from-slate-500 to-slate-700' },
    ];
  }, [filteredEvents]);


  if (!eventData || eventData.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">No Events Available</h3>
          <p className="text-gray-600 text-sm">There are currently no events to display. Please check back later.</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (event) => {
    const dayLeft = parseInt(event.leftDay);
    
    // Check if event is completed (negative days)
    if (dayLeft < 0) {
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100/70 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Events & Announcements</h1>
              <p className="text-slate-600">Stay updated with what's happening in your branch</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
            <input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 text-slate-700 font-medium transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'In week', 'upcoming', 'completed',].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeFilter === f ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/70 text-slate-700 hover:bg-white/90'
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, idx) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-2`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents?.map((event, index) => (
            
            <motion.div
              key={event._id || event.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedEvent(event)}
              className={`relative cursor-pointer rounded-2xl p-5 text-white min-h-[160px] flex flex-col justify-between bg-gradient-to-br ${getRandomBgColor()} shadow-lg border border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all`}
            >
              {/* Days Left badge */}
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getDaysLeftColor(event.leftDay)}`}>
                {getDaysLeftText(event.leftDay)}
              </span>

              {/* Content */}
              <div>
                <h4 className="font-bold text-white text-lg">{event.name}</h4>
                <p className="text-white/90 text-sm line-clamp-2">{event.description}</p>
              </div>

              {/* Footer: date + view icon */}
              <div className="flex items-center justify-between text-white mt-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>

                {/* Bottom right view icon */}
                <div className="ml-auto flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity">
                  <EyeIcon className="w-5 h-5 text-white opacity-90" />
                  <span className='text-sm'>See Details</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Event Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Date</p>
                          <p className="text-gray-600">{formatDate(selectedEvent.eventDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getDaysLeftColor(selectedEvent.leftDay).split(' ')[0]}`}></div>
                        <div>
                          <p className="font-semibold text-gray-900">Status</p>
                          <p className="text-gray-600">{getDaysLeftText(selectedEvent.leftDay)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Branch</p>
                          <p className="text-gray-600">{selectedEvent.branch.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Notes */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Event Notes
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-700" />
                    <div className="quill-content">
                      {eventData?.length > 0 ? (
                        eventData.map((item, index) => (
                          <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: item?.notes || '<p>No notes available</p>' }}
                          />
                        ))
                      ) : (
                        <p>No events to display</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
