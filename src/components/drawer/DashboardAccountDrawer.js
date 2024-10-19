import React, { useState, useEffect } from "react";
import { Drawer, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { apiClient } from "../../core/api";

const DashboardAccountDrawer = ({ isOpen, onClose, userId }) => {
  const [account, setAccount] = useState(null);
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    if (userId) {
      apiClient
        .get(`/api/account/admin/${userId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        })
        .then((response) => {
          setAccount(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [userId]);

  if (!account) {
    return "Error when loading";
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
