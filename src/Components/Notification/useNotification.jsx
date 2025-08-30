import { useState, useEffect, useCallback } from 'react';

const useNotification = () => {
  const mockNotifications = [
    {
      id: 1,
      title: "Assignment Due Tomorrow",
      message: "Your Math assignment is due tomorrow at 11:59 PM",
      type: "warning",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New Grade Posted",
      message: "Your Science quiz grade has been posted - 95%",
      type: "success",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Class Cancelled",
      message: "Tomorrow's Physics class has been cancelled",
      type: "info",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 4,
      title: "Fee Payment Reminder",
      message: "Your monthly fee payment is due in 3 days",
      type: "alert",
      timestamp: "2 days ago",
      read: false,
    },
    {
      id: 5,
      title: "Event Invitation",
      message: "You're invited to the Annual Science Fair next week",
      type: "info",
      timestamp: "3 days ago",
      read: true,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Open notification panel
  const openNotifications = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close notification panel
  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle notification panel
  const toggleNotifications = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Mark a specific notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Delete a specific notification
  const deleteNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setIsOpen(false);
  }, []);

  // Add new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(), // Simple ID generation
      timestamp: "Just now",
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  // Handle escape key to close notifications
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get notifications by type
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter((n) => n.type === type);
  }, [notifications]);

  // Get unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  return {
    // State
    isOpen,
    notifications,
    unreadCount,
    unreadNotifications,
    
    // Actions
    openNotifications,
    closeNotifications,
    toggleNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAllNotifications,
    addNotification,
    
    // Utilities
    getNotificationsByType,
  };
};

export default useNotification;