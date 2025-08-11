import { Calendar, EyeIcon, FileText, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getEvents } from '../../api/AllApis';

export const Events = () => {
    const user = useSelector((state) => state.auth.user);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventData, setEventData] = useState();

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
        if (days === 0) return 'bg-green-100 text-green-800';
        if (days <= 3) return 'bg-orange-100 text-orange-800';
        if (days <= 7) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getDaysLeftText = (daysLeft) => {
        const days = parseInt(daysLeft);
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        return `${days} days left`;
    };

    const bgColors = [
        'bg-blue-500',
        'bg-red-500',
        'bg-gray-500',
        // 'bg-green-500',
        // 'bg-purple-500',
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

    if (!eventData || eventData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full px-4 py-8 min-h-100">
                <div className="max-w-md w-full bg-white rounded-md shadow-md p-6 text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75h.008v.008H9.75V9.75zm0 4.5h.008v.008H9.75v-.008zm4.5-4.5h.008v.008h-.008V9.75zm0 4.5h.008v.008h-.008v-.008zM3.375 5.25A2.625 2.625 0 016 2.625h12a2.625 2.625 0 012.625 2.625v13.5A2.625 2.625 0 0118 21.375H6a2.625 2.625 0 01-2.625-2.625V5.25z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Events Available</h3>
                    <p className="text-gray-500 text-sm">There are currently no events to display. Please check back later.</p>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Event's Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-75 overflow-auto">
                        {eventData?.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`relative cursor-pointer rounded-lg p-4 text-black max-h-[130px] flex flex-col justify-between ${getRandomBgColor()}`}
                            >
                                {/* Days Left badge */}
                                <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getDaysLeftColor(event.leftDay)}`}>
                                    {getDaysLeftText(event.leftDay)}
                                </span>

                                {/* Content */}
                                <div>
                                    <h4 className="font-medium text-white">{event.name}</h4>
                                    <p className="text-white text-sm line-clamp-2">{event.description}</p>
                                </div>

                                {/* Footer: date + view icon */}
                                <div className="flex items-center justify-between text-white mt-4">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{formatDate(event.eventDate)}</span>
                                    </div>

                                    {/* Bottom right view icon */}
                                    <div className="ml-auto flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity">
                                        <EyeIcon className="w-5 h-5 text-white opacity-80 hover:opacity-100" />
                                        <span className='text-sm'>See Details</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>




                    {/* Modal */}
                    {selectedEvent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                                            {/* <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-green-500 mr-3" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Time</p>
                                                    <p className="text-gray-600">{formatTime(selectedEvent.eventDate)}</p>
                                                </div>
                                            </div> */}
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
                                                    <p className="text-gray-600">{selectedEvent.branch}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Event Notes */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FileText className="w-5 h-5 mr-2" />
                                            Event Notes
                                        </h3>
                                        <div
                                            className="prose prose-sm max-w-none text-gray-700"

                                        />
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
                                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
