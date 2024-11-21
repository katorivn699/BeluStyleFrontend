import React, { useState } from "react";
import { Drawer, Button, Typography, Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

const BrandDrawer = ({ isOpen, onClose, brand, onEdit }) => {
  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = useAuthHeader();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const handleDelete = (brandId) => {
    if (brandId) {
      apiClient
        .delete(`/api/brands/${brandId}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          toast.success(response.data, {
            position: "bottom-right",
            transition: Zoom,
          });
          onClose();
        })
        .catch((response) =>
          toast.error(response.data, {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  const openDeleteModal = (brand) => {
    setBrandToDelete(brand);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setBrandToDelete(null);
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
            style={{
              width: "100%",
              height: "25%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
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
            <strong>Created:</strong>{" "}
            {new Date(brand.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Updated:</strong>{" "}
            {new Date(brand.updatedAt).toLocaleString()}
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
                onClick={() => openDeleteModal(brand)}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {brandToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => {
            handleDelete(brandToDelete.brandId);
            closeDeleteModal();
          }}
          name={brandToDelete.brandName}
        />
      )}
    </>
  );
};

export default BrandDrawer;
