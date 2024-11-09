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
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const DashboardEditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiClient.get(`/api/categories/${categoryId}`, {
          headers: { Authorization: varToken },
        });
        const { categoryName, categoryDescription, imageUrl } = response.data;
        setCategoryName(categoryName);
        setCategoryDescription(categoryDescription);
        setCurrentImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
    fetchCategory();
  }, [categoryId, varToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let imageUrl = currentImageUrl;

      if (categoryImage) {
        const formData = new FormData();
        formData.append("image", categoryImage);
        const uploadResponse = await fetch(
          "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
          { method: "POST", body: formData }
        );
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      await apiClient.put(
        "/api/categories",
        {
          categoryId,
          categoryName: values.categoryName,
          categoryDescription: values.categoryDescription,
          imageUrl,
        },
        { headers: { Authorization: varToken } }
      );

      toast.success("Category updated successfully", {
        position: "bottom-right",
        transition: Zoom,
      });
      navigate("/Dashboard/Categories");
    } catch (error) {
      toast.error("Update category failed", {
        position: "bottom-right",
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string()
      .max(255, "Category Name must be at most 255 characters")
      .required("Category Name is required"),
    categoryDescription: Yup.string()
      .max(500, "Description must be at most 500 characters")
      .required("Category Description is required"),
  });

  return (
    <Container
      maxWidth="sm"
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Category
      </Typography>
      <Formik
        initialValues={{
          categoryName: categoryName || "",
          categoryDescription: categoryDescription || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form>
            <Field
              name="categoryName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.categoryName && Boolean(errors.categoryName)}
                  helperText={touched.categoryName && errors.categoryName}
                  disabled={loading}
                />
              )}
            />
            <Field
              name="categoryDescription"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={
                    touched.categoryDescription &&
                    Boolean(errors.categoryDescription)
                  }
                  helperText={
                    touched.categoryDescription && errors.categoryDescription
                  }
                  disabled={loading}
                />
              )}
            />

            <InputLabel htmlFor="categoryImage" sx={{ mt: 2 }}>
              Logo (Leave blank to keep current logo)
            </InputLabel>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
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
                  alt="New Category Preview"
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
              currentImageUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img
                    src={currentImageUrl}
                    alt="Current Category"
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
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default DashboardEditCategory;
