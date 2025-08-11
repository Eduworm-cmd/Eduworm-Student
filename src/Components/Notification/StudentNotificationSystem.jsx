import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Bell, X, Calendar, Clock, BookOpen } from 'lucide-react';

const StudentNotificationSystem = () => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const studentData = {
        id: '685fa2917e2633bb552b9bfb',
        classId: '684011dd1c848dcd5128b0ac',
        name: 'John Doe'
    };

    useEffect(() => {
        const newSocket = io('http://192.168.1.6:4000', {
            transports: ['websocket', 'polling']
        });


        newSocket.on('connect', () => {
            setIsConnected(true);

            newSocket.emit('join-class', studentData.classId);
        });

        newSocket.on('disconnect', () => {
        
            setIsConnected(false);
        });

        // Listen for datesheet notifications
        newSocket.on('datesheet-notification', (notificationData) => {

            // Add notification to state
            setNotifications(prev => [
                {
                    ...notificationData,
                    id: Date.now(),
                    read: false
                },
                ...prev
            ]);

            // Increment unread count
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification(notificationData.title, {
                    body: notificationData.message,
                    icon: '/notification-icon.png'
                });
            }
        });

        setSocket(newSocket);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            newSocket.close();
        };
    }, [studentData.classId]);

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, read: true }
                    : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const removeNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="relative">
            {/* Connection Status */}
            <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${isConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {/* Notification Bell Button */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={48} className="mx-auto mb-2 opacity-20" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar size={16} className="text-blue-600" />
                                                <h4 className="font-medium text-gray-800">
                                                    {notification.title}
                                                </h4>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">
                                                {notification.message}
                                            </p>

                                            {notification.data && (
                                                <div className="bg-gray-50 rounded p-3 text-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen size={14} className="text-gray-500" />
                                                            <span className="font-medium">Subject:</span>
                                                            <span>{notification.data.subject}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} className="text-gray-500" />
                                                            <span className="font-medium">Time:</span>
                                                            <span>{formatTime(notification.data.timing)}</span>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Date:</span>
                                                            <span className="ml-1">{formatDate(notification.data.date)}</span>
                                                        </div>
                                                        {notification.data.description && (
                                                            <div className="col-span-2">
                                                                <span className="font-medium">Details:</span>
                                                                <p className="text-gray-600 mt-1">{notification.data.description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="ml-2 flex flex-col gap-1">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeNotification(notification.id)}
                                                className="text-xs text-gray-500 hover:text-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Demo Panel */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded border">
                        <div>
                            <h3 className="font-medium">Welcome, {studentData.name}</h3>
                            <p className="text-sm text-gray-600">Class ID: {studentData.classId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Connection Status:</p>
                            <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                                {isConnected ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded border">
                        <h4 className="font-medium mb-2">Recent Activity</h4>
                        <p className="text-sm text-gray-600">
                            {notifications.length > 0
                                ? `You have ${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`
                                : 'No recent notifications'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentNotificationSystem;