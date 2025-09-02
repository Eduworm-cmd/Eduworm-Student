import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

// const mockNotifications = [
//   {
//     id: 1,
//     title: "Assignment Due Tomorrow",
//     message: "Your Math assignment is due tomorrow at 11:59 PM",
//     type: "warning",
//     timestamp: "2 hours ago",
//     read: false,
//   },
//   {
//     id: 2,
//     title: "New Grade Posted",
//     message: "Your Science quiz grade has been posted - 95%",
//     type: "success",
//     timestamp: "5 hours ago",
//     read: false,
//   },
//   {
//     id: 3,
//     title: "Class Cancelled",
//     message: "Tomorrow's Physics class has been cancelled",
//     type: "info",
//     timestamp: "1 day ago",
//     read: true,
//   },
//   {
//     id: 4,
//     title: "Fee Payment Reminder",
//     message: "Your monthly fee payment is due in 3 days",
//     type: "alert",
//     timestamp: "2 days ago",
//     read: false,
//   },
//   {
//     id: 5,
//     title: "Event Invitation",
//     message: "You're invited to the Annual Science Fair next week",
//     type: "info",
//     timestamp: "3 days ago",
//     read: true,
//   },
// ];

const useNotification = (open, onClose) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // const unreadCount = notifications.filter((n) => !n.read).length;

  // const markAsRead = useCallback((id) => {
  //   setNotifications((prev) =>
  //     prev.map((notification) =>
  //       notification.id === id ? { ...notification, read: true } : notification
  //     )
  //   );
  // }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    onClose?.();
  }, [onClose]);

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

  // Socket Connection Build
  useEffect(() => {
    if (!open || socketRef.current) return;

    const newSocket = io("http://192.168.1.4:4000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            userId: "68ada3a64c5bfb46c7fb9eb9",
            userRole: "Student",
            branchId: "68ad9dd04c5bfb46c7fb9dfb",
          },
        },
      },
      transports: ["polling", "websocket"],
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket Server:", newSocket.id);
    });

    // ✅ Listen for new notifications
    newSocket.on("new_notification", (notification) => {
      console.log("📥 New notification received:", notification);
      setNotifications([notification]);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket Server");
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [open]);

  return {
    notifications,
    // unreadCount,
    // markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
  };
};

export default useNotification;
