import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  InputLabel,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardEditBrand = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(brandId);
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await apiClient.get(`/api/brands/${brandId}`, {
          headers: { Authorization: varToken },
        });
        const { brandName, brandDescription, websiteUrl, logoUrl } =
          response.data;
        setBrandName(brandName);
        setBrandDescription(brandDescription);
        setWebsiteUrl(websiteUrl);
        setCurrentLogoUrl(logoUrl);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
    fetchBrand();
  }, [brandId, varToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBrandImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const validationSchema = Yup.object({
    brandName: Yup.string()
      .max(255, "Brand Name must be at most 255 characters")
      .required("Brand Name is required"),
    brandDescription: Yup.string()
      .max(500, "Description must be at most 500 characters")
      .required("Brand Description is required"),
    websiteUrl: Yup.string()
      .matches(
        /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
        "Enter a valid URL"
      )
      .required("Website URL is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let logoUrl = currentLogoUrl;

      // Handle image upload if there is a new image
      if (brandImage) {
        const formData = new FormData();
        formData.append("image", brandImage);
        const uploadResponse = await fetch(
          "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
          { method: "POST", body: formData }
        );
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          logoUrl = uploadData.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Update brand
      await apiClient.put(
        "/api/brands",
        {
          brandId,
          brandName: values.brandName,
          brandDescription: values.brandDescription,
          websiteUrl: values.websiteUrl,
          logoUrl,
        },
        { headers: { Authorization: varToken } }
      );

      toast.success("Brand updated successfully", {
        position: "bottom-right",
        transition: Zoom,
      });
      navigate("/Dashboard/Brands");
    } catch (error) {
      toast.error("Update brand failed", {
        position: "bottom-right",
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Brand
      </Typography>

      <Formik
        initialValues={{
          brandName,
          brandDescription,
          websiteUrl,
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              label="Brand Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="brandName"
              value={values.brandName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              error={touched.brandName && !!errors.brandName}
              helperText={touched.brandName && errors.brandName}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              name="brandDescription"
              value={values.brandDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              error={touched.brandDescription && !!errors.brandDescription}
              helperText={touched.brandDescription && errors.brandDescription}
            />

            <TextField
              label="Website URL"
              variant="outlined"
              fullWidth
              margin="normal"
              name="websiteUrl"
              value={values.websiteUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              error={touched.websiteUrl && !!errors.websiteUrl}
              helperText={touched.websiteUrl && errors.websiteUrl}
            />

            <InputLabel htmlFor="brandImage" sx={{ mt: 2 }}>
              Logo (Leave blank to keep current logo)
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
                disabled={loading}
              />
            </Button>

            {newImagePreview ? (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={newImagePreview}
                  alt="New Logo Preview"
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <Typography variant="body2" color="textSecondary" mt={6}>
                  New Image Preview
                </Typography>
              </Box>
            ) : (
              currentLogoUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img
                    src={currentLogoUrl}
                    alt="Current Logo"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" mt={6}>
                    Current Image
                  </Typography>
                </Box>
              )
            )}

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={() => handleSubmit(values)}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default DashboardEditBrand;
