import React from "react";
import { Drawer, Button, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser to get user's role

const BrandDrawer = ({ isOpen, onClose, brand, onEdit, onDelete }) => {
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
          <strong>Name:</strong> {brand.brandName}
        </Typography>
        <img
          src={brand.logoUrl}
          alt={brand.brandName}
          style={{ width: "100%", height: "auto" }}
        />
        <a
          href={brand.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {brand.websiteUrl}
        </a>

        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>ID:</strong> {brand.brandId}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Description:</strong> {brand.brandDescription}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Total quantity:</strong> {brand.totalQuantity}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Created:</strong> {brand.createdAt}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <strong>Updated:</strong> {brand.updatedAt}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              onEdit(brand);
              onClose();
            }}
          >
            Edit
          </Button>

          {/* Conditionally render the Delete button for Admin users */}
          {userRole === "ADMIN" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                onDelete(brand);
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

export default BrandDrawer;
