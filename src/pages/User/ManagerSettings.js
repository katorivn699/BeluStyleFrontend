import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { FaCog } from "react-icons/fa";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const ManagerSettings = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null);
  const varToken = useAuthHeader();

  useEffect(() => {
    if (open) {
      // Fetch user data when modal opens
      apiClient
        .get("/api/account/me", {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 500,
          p: 4,
          mx: "auto",
          my: "20vh",
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          User Information
        </Typography>
        {userData ? (
          <Box>
            <Typography>
              <strong>User ID:</strong> {userData.userId}
            </Typography>
            <Typography>
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography>
              <strong>Full Name:</strong> {userData.fullName}
            </Typography>
            <Typography>
              <strong>Phone Number:</strong> {userData.phoneNumber}
            </Typography>
            <Typography>
              <strong>Role:</strong> {userData.role}
            </Typography>
            <Typography>
              <strong>Current Payment Method:</strong>{" "}
              {userData.currentPaymentMethod}
            </Typography>
            <Typography>
              <strong>Address:</strong> {userData.userAddress}
            </Typography>
            <Typography>
              <strong>Account Status:</strong>{" "}
              {userData.enable ? "Enabled" : "Disabled"}
            </Typography>
            <Typography>
              <strong>Created At:</strong>{" "}
              {new Date(userData.createdAt).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Updated At:</strong>{" "}
              {new Date(userData.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        ) : (
          <Typography>Loading user information...</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ManagerSettings;
