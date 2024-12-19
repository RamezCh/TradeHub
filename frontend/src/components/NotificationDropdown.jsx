import { useState, useEffect } from "react";
import { useNotificationStore } from "../store/useNotificationStore";
import NotificationSkeleton from "./skeletons/NotificationSkeleton";
import { Bell, BellDot } from "lucide-react";

const NotificationDropdown = ({ isAuthenticated }) => {
  const {
    notifications,
    isFetchingNotifications,
    fetchNotifications,
    markAsRead,
  } = useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Check for unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !notification.readStatus
  );

  return (
    isAuthenticated && (
      <div className="relative">
        <button onClick={toggleDropdown} className="btn btn-sm gap-2">
          {/* Show BellDot only if there are unread notifications */}
          {unreadNotifications.length > 0 ? (
            <BellDot className="size-5 text-red-500" />
          ) : (
            <Bell className="size-5" />
          )}
        </button>
        {isDropdownOpen && isFetchingNotifications && <NotificationSkeleton />}
        {isDropdownOpen &&
          !isFetchingNotifications &&
          notifications.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul className="space-y-2 p-2">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`text-sm p-2 rounded-md ${
                      notification.readStatus
                        ? "bg-gray-100 text-gray-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <button
                      onClick={() => {
                        markAsRead(notification._id);
                        if (notification.link) {
                          window.open(
                            notification.link,
                            "_blank",
                            "noopener noreferrer"
                          );
                        }
                      }}
                      className="text-left w-full"
                    >
                      {notification.message}
                    </button>
                    <span className="block text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        {isDropdownOpen && notifications.length === 0 && (
          <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <div className="p-2 text-sm text-gray-500">No notifications</div>
          </div>
        )}
      </div>
    )
  );
};

export default NotificationDropdown;
