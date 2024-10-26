import React from "react";
import { Drawer, Button, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser to get user's role

const NotificationDrawer = ({
  isOpen,
  onClose,
  notification,
  onEdit,
  onDelete,
}) => {
  const authUser = useAuthUser(); // Get the authenticated user
  const userRole = authUser.role; // Access the user's role (assumes role is stored in authUser)

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          backgroundColor: "#f9f9f9",
          position: "relative",
        }}
      >
        {/* Close button at the top */}
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

        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          <strong>Title:</strong> {notification.title}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Message:</strong> {notification.message}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Role:</strong> {notification.role?.roleName}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Created at:</strong>{" "}
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          {/* Conditionally render the Delete button for Admin users */}
          {userRole === "ADMIN" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                onDelete(notification);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;
