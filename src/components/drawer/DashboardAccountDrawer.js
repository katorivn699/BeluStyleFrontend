import React, { useState, useEffect } from "react";
import { Drawer, Typography, Box, CircularProgress } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardAccountDrawer = ({ isOpen, onClose, userId }) => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const varToken = useAuthHeader();

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      apiClient
        .get(`/api/admin/${userId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setAccount(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [userId]);

  if (isLoading) {
    return (
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: 2,
          }}
        >
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  if (hasError) {
    return (
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: 400,
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6" color="error">
            Error loading user details. Please try again later.
          </Typography>
        </Box>
      </Drawer>
    );
  }

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
          <strong>Username:</strong> {account.username}
        </Typography>
        <img
          src={account.userImage}
          alt={account.username}
          style={{ width: "100%", height: "auto" }}
        />
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Email:</strong> {account.email}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Full Name:</strong> {account.fullName}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Role:</strong> {account.role}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Status:</strong> {account.enable ? "Enable" : "Disable"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Current Payment Method:</strong>{" "}
          {account.currentPaymentMethod}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Address:</strong> {account.userAddress}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Created At:</strong> {account.createdAt}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <strong>Updated At:</strong> {account.updatedAt}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default DashboardAccountDrawer;
