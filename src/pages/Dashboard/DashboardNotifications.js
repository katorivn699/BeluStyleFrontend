import React, { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { apiClient } from "../../core/api";
import { Link } from "react-router-dom";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal";
import { toast, Zoom } from "react-toastify";
import NotificationDrawer from "../../components/drawer/DashboardNotificationDrawer";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [selectedNotification, setNotification] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const authUser = useAuthUser();
  const varToken = useAuthHeader();

  const openDeleteModal = (notification) => {
    setNotificationToDelete(notification);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setNotificationToDelete(null);
  };

  const handleDelete = (notificationToDelete) => {
    if (notificationToDelete) {
      apiClient
        .delete(`/api/notifications/${notificationToDelete.notificationId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setNotifications(
            notifications.filter(
              (c) => c.notificationId !== notificationToDelete.notificationId
            )
          );
          setIsOpen(false);
          toast.success("Delete notification successfully", {
            position: "bottom-right",
            transition: Zoom,
          });
        })
        .catch((error) =>
          toast.error("Delete notification failed", {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  const openDrawer = (notification) => {
    setNotification(notification);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get("/api/notifications/as", {
          headers: {
            Authorization: varToken,
          },
        });

        if (response) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [varToken]);

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600 bg-red-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      case "STAFF":
        return "text-yellow-600 bg-yellow-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      case "CUSTOMER":
        return "text-teal-600 bg-teal-100 px-4 py-2 rounded-md inline-block font-bold text-center w-32";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-6">Notifications List</h1>
        </div>
        <div>
          <Link to="/Dashboard/Notifications/Create">
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <FaPlus className="mr-2" /> Create New Notification
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Created at</th>
              <th className="px-4 py-2 text-left">Remove</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <tr
                  key={notification.notificationId}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{notification.notificationId}</td>
                  <td className="px-4 py-2">{notification.title}</td>
                  <td className="px-4 py-2">{notification.message}</td>
                  <td
                    className={`px-4 py-2 ${getRoleStyle(
                      notification.role?.roleName
                    )} `}
                  >
                    {notification.role?.roleName}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 flex space-x-2 pt-6">
                    <button
                      className="text-green-500 cursor-pointer"
                      onClick={() => openDrawer(notification)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-red-500 cursor-pointer"
                      onClick={() => openDeleteModal(notification)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <p className="text-red-500">No notifications found.</p>
            )}
          </tbody>
        </table>
      </div>
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={() => handleDelete(notificationToDelete)}
        name={notificationToDelete?.title || ""}
      />
      {/* Category Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        notification={selectedNotification || {}}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DashboardNotifications;
