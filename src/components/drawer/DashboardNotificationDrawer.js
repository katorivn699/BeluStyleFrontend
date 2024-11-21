import React, { useState } from "react";
import { Drawer, Button, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser to get user's role
import { toast, Zoom } from "react-toastify";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const NotificationDrawer = ({ isOpen, onClose, notification, onDelete }) => {
  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = useAuthHeader();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const handleDelete = (notificationId) => {
    if (notificationId) {
      apiClient
        .delete(`/api/notifications/${notificationId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          toast.success(
            response?.data?.message || "Notification deleted successfully",
            {
              position: "bottom-right",
              transition: Zoom,
            }
          );
          onDelete(notificationId);
          onClose();
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete notification",
            {
              position: "bottom-right",
              transition: Zoom,
            }
          );
        });
    }
  };

  // Open the delete confirmation modal
  const openDeleteModal = (notification) => {
    setNotificationToDelete(notification);
    setDeleteModalOpen(true);
  };

  // Close the delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setNotificationToDelete(null);
  };

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: 400,
            padding: 2,
            backgroundColor: "#f9f9f9",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <FaTimes size={24} />
          </button>

          {/* Notification Details */}
          <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
            <strong>Title:</strong> {notification.title}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Message:</strong> {notification.message}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Role:</strong> {notification.role?.roleName || "All"}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Created at:</strong>{" "}
            {new Date(notification.createdAt).toLocaleString()}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 2,
            }}
          >
            {/* Conditionally render the Delete button for Admin users */}
            {userRole === "ADMIN" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => openDeleteModal(notification)}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Modal */}
      {notificationToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => {
            handleDelete(notificationToDelete.notificationId);
            closeDeleteModal();
          }}
          name={notificationToDelete.title}
        />
      )}
    </>
  );
};

export default NotificationDrawer;
