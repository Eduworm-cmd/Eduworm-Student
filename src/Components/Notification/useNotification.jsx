import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const useNotification = (open, onClose) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const user = useSelector((state)=>state.auth.user);
  const initialLoadDone = useRef(false);

  const userId = user?.studentId;
  const branchId = user?.branchId;
  console.log('userId', userId);
  
  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (initialLoadDone.current) return; // Prevent multiple API calls
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        
        // Calculate unread count
        const unread = data.notifications?.filter(n => !n.read).length || 0;
        setUnreadCount(unread);
        
        initialLoadDone.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for duplicate notifications
  const isDuplicateNotification = useCallback((newNotification, existingNotifications) => {
    return existingNotifications.some(existing => 
      existing.id === newNotification.id ||
      (existing.title === newNotification.title && 
       existing.message === newNotification.message &&
       Math.abs(new Date(existing.createdAt) - new Date(newNotification.createdAt)) < 1000) // Within 1 second
    );
  }, []);

  // Add new notification from socket
  const addSocketNotification = useCallback((newNotification) => {
    setNotifications(prev => {
      // Check for duplicates
      if (isDuplicateNotification(newNotification, prev)) {
        console.log('Duplicate notification ignored:', newNotification.title);
        return prev;
      }

      // Add new notification at the beginning
      const updated = [newNotification, ...prev];
      
      // Update unread count if notification is unread
      if (!newNotification.read) {
        setUnreadCount(prevCount => prevCount + 1);
      }
      
      return updated;
    });
  }, [isDuplicateNotification]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification => {
        if (notification.id === id && !notification.read) {
          // Decrease unread count
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const notificationToDelete = prev.find(n => n.id === id);
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      return prev.filter(notification => notification.id !== id);
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (socketRef.current || !userId || !branchId) return;

    const newSocket = io("http://192.168.1.4:4000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            userId,
            userRole: "Student",
            branchId,
          },
        },
      },
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket Server:", newSocket.id);
    });

    // Listen for new notifications
    newSocket.on("new_notification", (notification) => {
      console.log("📥 New notification received:", notification);
      
      // Format notification to match your structure
      const formattedNotification = {
        id: notification.id || Date.now(),
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        timestamp: notification.timestamp || 'Just now',
        read: false,
        createdAt: notification.createdAt || new Date().toISOString(),
      };

      addSocketNotification(formattedNotification);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket Server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - run once on mount

  // Fetch notifications when notification panel opens
  useEffect(() => {
    if (open && !initialLoadDone.current) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Handle escape key to close notification
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
    refreshNotifications: fetchNotifications,
  };
};

export default useNotification;