import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { FaCamera } from "react-icons/fa"; // Import icon máy ảnh
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";

const ManagerSettings = ({ open, onClose, onImageUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    userImage: "",
  });
  const varToken = useAuthHeader();

  useEffect(() => {
    if (open) {
      apiClient
        .get("/api/account/me", {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setUserData(response.data);
          setFormData({
            email: response.data.email,
            fullName: response.data.fullName,
            phoneNumber: response.data.phoneNumber,
            userImage: response.data.userImage,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setFormData((prevData) => ({
          ...prevData,
          userImage: data.data.url,
        }));
      }
      setUserData((prev) => ({ ...prev, userImage: data.data.url }));
      onImageUpdate(data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = async () => {
    apiClient
      .put(
        "/api/account",
        {
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          userImage: formData.userImage,
        },
        {
          headers: {
            Authorization: varToken,
          },
        }
      )
      .then((response) => {
        toast.success(response.data, {
          position: "bottom-right",
          transition: Zoom,
        });
        onClose();
      })
      .catch((error) => {
        toast.error(error.data, {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  if (!userData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          my: "5vh",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          textAlign: "center",
        }}
      >
        {/* User Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="upload-avatar"
        />
        <label htmlFor="upload-avatar">
          <Avatar
            src={formData.userImage}
            alt={formData.fullName}
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              border: "3px solid #eee",
              cursor: "pointer",
              position: "relative", // Make it a positioned element
            }}
          >
            {/* Show camera icon when hovering over the avatar */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontSize: "24px",
                display: "none", // Hide initially
              }}
            >
              <FaCamera />
            </Box>
          </Avatar>
        </label>

        {/* Hover Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "24px",
            display: "none", // Initially hidden
          }}
          className="camera-icon"
        >
          <FaCamera />
        </Box>

        <Typography variant="h6" mb={3}>
          {userData.fullName}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color:
              userData.role === "ADMIN"
                ? "red"
                : userData.role === "STAFF"
                ? "orange"
                : "black",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {userData.role}
        </Typography>

        {/* User Information Fields */}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={userData.username}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
        />
        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ManagerSettings;
