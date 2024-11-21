import { GoBell } from "react-icons/go";
import { useEffect, useState, useTransition } from "react";
import { Card, CircularProgress, IconButton } from "@mui/material";
import { GetNotifications } from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatDistanceToNow } from "date-fns";

export default function NotificationIcon() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const authHeader = useAuthHeader();
  const [isPending, startTransition] = useTransition();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const loadNotifications = () => {
    setNotifications([]);
    startTransition(async () => {
      try {
        const response = await GetNotifications(authHeader);
        if (response.data) {
          setNotifications(response.data.reverse());
        }
      } catch (error) {
        console.log("Error!");
      }
    });
  };

  useEffect(() => {
    if (isPopupOpen) {
      loadNotifications();
    }
  }, [isPopupOpen]);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <IconButton onClick={togglePopup} className="group">
        <GoBell className="text-3xl text-black transform transition-transform duration-200 ease-in-out group-hover:animate-ring" />
      </IconButton>

      {/* Notification Popup Menu */}
      <div
        className={`absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md z-10 transform transition-all duration-300 ease-in-out ${
          isPopupOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={togglePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-scroll">
          {isPending ? (
            <div className="flex justify-center items-center">
              <CircularProgress color="inherit" size={20} />
              <span className="ml-2">Loading notifications...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Card key={index} className="mb-2 p-2">
                <h1 className="font-poppins font-semibold">
                  {notification.title}
                </h1>
                <p className="font-montserrat">{notification.message}</p>
                <p className="text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-gray-700">No new notifications</p>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      {isPopupOpen && (
        <div
          onClick={togglePopup}
          className="fixed inset-0 bg-black opacity-30 z-0"
        ></div>
      )}
    </div>
  );
}
