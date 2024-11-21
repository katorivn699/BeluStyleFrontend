import React, { useState } from "react";
import { Drawer, Button, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser to get user's role
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { apiClient } from "../../core/api";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast, Zoom } from "react-toastify";

const CategoryDrawer = ({ isOpen, onClose, category, onEdit, onDelete }) => {
  const authUser = useAuthUser(); // Get the authenticated user
  const varToken = useAuthHeader();

  const userRole = authUser.role;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDelete = (categoryId) => {
    if (categoryId) {
      apiClient
        .delete(`/api/categories/${categoryId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          toast.success(
            response.data.message || "Delete category successfully",
            {
              position: "bottom-right",
              transition: Zoom,
            }
          );
          onClose();
        })
        .catch((error) =>
          toast.error(error.data.message || "Delete category failed", {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  const openDeleteModal = (brand) => {
    setCategoryToDelete(brand);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };
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
          <strong>Name:</strong> {category.categoryName}
        </Typography>
        <img
          src={category.imageUrl}
          alt={category.categoryName}
          style={{
            width: "100%",
            height: "25%", // Match the height to the width for a square
            objectFit: "cover", // Ensures the image scales proportionally
            borderRadius: "8px",
          }} // Optional: Slightly rounded corners }}
        />
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>ID:</strong> {category.categoryId}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Description:</strong> {category.categoryDescription}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Total quantity:</strong> {category.totalQuantity}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Created:</strong>{" "}
          {new Date(category.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <strong>Updated:</strong>
          {new Date(category.updatedAt).toLocaleString()}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              onEdit(category);
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
              onClick={() => openDeleteModal(category)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {categoryToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => {
            handleDelete(categoryToDelete.categoryId);
            closeDeleteModal();
          }}
          name={categoryToDelete.categoryName}
        />
      )}
    </Drawer>
  );
};

export default CategoryDrawer;
