import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";
import { PhotoCamera } from "@mui/icons-material";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .min(1, "Email must be at least 1 character")
    .max(255, "Email cannot exceed 255 characters"),
  fullName: Yup.string()
    .required("Full Name is required")
    .min(1, "Full Name must be at least 1 character")
    .max(255, "Full Name cannot exceed 255 characters"),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+84|0)\d{9,10}$/,
      "Phone number must start with '+84' or '0' and be 10-11 digits"
    )
    .required("Phone number is required"),
});

const ManagerSettings = ({
  open,
  onClose,
  onImageUpdate,
  onFullNameUpdate,
}) => {
  const [userData, setUserData] = useState(null);
  const role = useAuthUser().role;
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
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [open, varToken]);

  const handleImageUpload = async (e, setFieldValue) => {
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
        setFieldValue("userImage", data.data.url);
        setUserData((prev) => ({ ...prev, userImage: data.data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await apiClient.put("/api/account", values, {
        headers: {
          Authorization: varToken,
        },
      });
      toast.success("Profile updated successfully!", {
        position: "bottom-right",
        transition: Zoom,
      });
      onImageUpdate(values.userImage);
      onFullNameUpdate(values.fullName);
      onClose();
    } catch (error) {
      toast.error("Error updating profile.", {
        position: "bottom-right",
        transition: Zoom,
      });
    }
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
        <Formik
          initialValues={{
            email: userData.email || "",
            fullName: userData.fullName || "",
            phoneNumber: userData.phoneNumber || "",
            userImage: userData.userImage || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleUpdate(values)}
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Avatar
                  src={values.userImage}
                  alt={values.fullName}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "3px solid #eee",
                    cursor: "pointer",
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  style={{ display: "none" }}
                  id="upload-avatar"
                  disabled={role === "STAFF"}
                />
                <label htmlFor="upload-avatar">
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                      "&:hover": { opacity: 1 },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PhotoCamera sx={{ color: "gray" }} />
                  </IconButton>
                </label>
              </Box>

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={userData.username}
                InputProps={{ readOnly: true }}
                disabled
              />

              <Field
                as={TextField}
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                onChange={handleChange}
                disabled={role === "STAFF"}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                label="Full Name"
                name="fullName"
                fullWidth
                margin="normal"
                onChange={handleChange}
                disabled={role === "STAFF"}
                error={touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
              />
              <Field
                as={TextField}
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                margin="normal"
                onChange={handleChange}
                disabled={role === "STAFF"}
                error={touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                {role === "STAFF" || (
                  <Button type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={onClose}>
                  Close
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ManagerSettings;
