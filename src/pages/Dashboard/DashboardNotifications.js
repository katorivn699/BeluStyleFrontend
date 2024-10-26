import React, { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { apiClient } from "../../core/api";
import { Link } from "react-router-dom";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal";
import { toast, Zoom } from "react-toastify";
import NotificationDrawer from "../../components/drawer/DashboardNotificationDrawer";

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [selectedNotification, setNotification] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const authUser = useAuthUser();
  const varToken = localStorage.getItem("_auth");

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
            Authorization: "Bearer " + varToken,
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
            Authorization: "Bearer " + varToken,
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
                  <td className="px-4 py-2">{notification.role?.roleName}</td>
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
              <tr>
                <td colSpan="6" className="text-center px-4 py-2">
                  No notifications found.
                </td>
              </tr>
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
