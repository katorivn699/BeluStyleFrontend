import React, { useState } from "react"; // Import useState for image preview
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../../core/api";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LocationSelector from "../../service/LocationService";
import { TextField, Button, Typography, Box } from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateStaffAccount = () => {
  const varToken = useAuthHeader();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null); // State for image preview

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
    userImage: Yup.mixed().required("Image is required"), // Validate userImage
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("userImage", file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
    }
  };

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
              Authorization: varToken,
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
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <Box sx={{ mb: 2 }}>
              <Field
                name="email"
                as={TextField}
                label="Email"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="email" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="username"
                as={TextField}
                label="Username"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="username" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="fullName"
                as={TextField}
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="fullName" />}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field
                name="password"
                as={TextField}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="password" />}
              />
            </Box>

            <Box mt={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                  hidden
                />
              </Button>
              <ErrorMessage name="userImage">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>
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

            <Box mt={2}>
              <LocationSelector
                onLocationChange={(location) =>
                  setFieldValue(
                    "userAddress",
                    `${location.tinh}, ${location.quan}, ${location.phuong}`
                  )
                }
              />
              <ErrorMessage name="userAddress">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>
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
