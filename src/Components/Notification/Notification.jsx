import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Info,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import useNotification from "./useNotification";

const Notification = ({ open, onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
    refreshNotifications,
  } = useNotification(open, onClose);

  const NotificationIcon = ({ type }) => {
    const iconProps = { className: "w-5 h-5" };

    switch (type) {
      case "success":
        return (
          <CheckCircle {...iconProps} className="w-5 h-5 text-green-500" />
        );
      case "warning":
        return (
          <AlertCircle {...iconProps} className="w-5 h-5 text-amber-500" />
        );
      case "alert":
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-500" />;
      default:
        return <Info {...iconProps} className="w-5 h-5 text-blue-500" />;
    }
  };

  const NotificationItem = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
        !notification.read ? "bg-blue-50/30" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`text-sm font-medium ${
                !notification.read ? "text-slate-900" : "text-slate-700"
              }`}
            >
              {notification.title}
              {!notification.read && (
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
              )}
            </h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatDate(notification?.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Notifications
                  </h3>
                  {isLoading && (
                    <RefreshCw className="w-4 h-4 text-slate-500 animate-spin" />
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </motion.button>
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up!"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={refreshNotifications}
                      className="text-slate-600 hover:text-slate-700 font-medium"
                    >
                      Refresh
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
              ) : notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="w-16 h-16 text-slate-300 mb-4" />
                  <h4 className="text-lg font-medium text-slate-600 mb-2">
                    No notifications
                  </h4>
                  <p className="text-slate-500">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications?.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Notification;
