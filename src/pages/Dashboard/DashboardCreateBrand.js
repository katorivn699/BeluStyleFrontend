import React, { useState } from "react";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../../core/api";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LocationSelector from "../../service/LocationService";
import { Box, Button, TextField, Typography, InputLabel } from "@mui/material";

const DashboardCreateStaffAccount = () => {
  const varToken = localStorage.getItem("_auth");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string()
      .required("Username is required")
      .min(7, "Username must be at least 7 characters")
      .matches(
        /^[a-zA-Z0-9]*$/,
        "Username cannot contain special characters or spaces"
      ),
    fullName: Yup.string().required("Full name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain one uppercase, one lowercase, and one number"
      ),
    userAddress: Yup.string().required("Address is required"),
  });

  const handleSubmit = async (values) => {
    let imageUrl = "";

    const uploadImage = () => {
      const formData = new FormData();
      formData.append("image", values.userImage);

      const uploadToastId = toast.loading("Uploading image...");

      return fetch(
        "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            imageUrl = data.data.display_url;
            toast.update(uploadToastId, {
              render: "Image uploaded successfully!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              transition: Zoom,
            });
          } else {
            throw new Error("Image upload failed");
          }
        });
    };

    const createStaffAccount = () => {
      apiClient
        .post(
          "/api/admin",
          {
            email: values.email,
            username: values.username,
            fullName: values.fullName,
            passwordHash: values.password,
            userImage: imageUrl,
            userAddress: values.userAddress,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + varToken,
            },
          }
        )
        .then(() => {
          toast.success("Staff account created successfully!", {
            position: "bottom-right",
            transition: Zoom,
          });
          navigate("/Dashboard/Accounts");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create staff account", {
            position: "bottom-right",
            transition: Zoom,
          });
        });
    };

    if (values.userImage) {
      uploadImage()
        .then(createStaffAccount)
        .catch((error) => {
          toast.error(error.message, {
            position: "bottom-right",
            transition: Zoom,
          });
        });
    } else {
      createStaffAccount();
    }
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("userImage", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Create Staff Account
      </Typography>
      <Formik
        initialValues={{
          email: "",
          username: "",
          fullName: "",
          password: "",
          userImage: null,
          userAddress: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <Box mb={2}>
              <InputLabel>Email</InputLabel>
              <Field
                as={TextField}
                type="email"
                name="email"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="email"
                component="p"
                style={{ color: "red" }}
              />
            </Box>
            <Box mb={2}>
              <InputLabel>Username</InputLabel>
              <Field
                as={TextField}
                type="text"
                name="username"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="username"
                component="p"
                style={{ color: "red" }}
              />
            </Box>
            <Box mb={2}>
              <InputLabel>Full Name</InputLabel>
              <Field
                as={TextField}
                type="text"
                name="fullName"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="fullName"
                component="p"
                style={{ color: "red" }}
              />
            </Box>
            <Box mb={2}>
              <InputLabel>Password</InputLabel>
              <Field
                as={TextField}
                type="password"
                name="password"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="password"
                component="p"
                style={{ color: "red" }}
              />
            </Box>
            <Box mt={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  hidden
                  required
                />
              </Button>
            </Box>

            {/* Image Preview */}
            {previewImage && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                />
              </Box>
            )}

            <Box mb={2}>
              <InputLabel>User Address</InputLabel>
              <LocationSelector
                onLocationChange={(location) =>
                  setFieldValue(
                    "userAddress",
                    `${location.tinh}, ${location.quan}, ${location.phuong}`
                  )
                }
              />
              <ErrorMessage
                name="userAddress"
                component="p"
                style={{ color: "red" }}
              />
            </Box>

            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Create Account
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DashboardCreateStaffAccount;
