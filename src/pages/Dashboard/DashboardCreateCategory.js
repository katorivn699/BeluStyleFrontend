import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useFormik } from "formik";
import * as Yup from "yup";

const DashboardCreateCategory = () => {
  const [categoryImage, setCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      categoryDescription: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .max(255, "Category Name must be at most 255 characters")
        .required("Category Name is required"),
      categoryDescription: Yup.string()
        .max(500, "Description must be at most 500 characters")
        .required("Category Description is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        let imageUrl = "";

        if (categoryImage) {
          const formData = new FormData();
          formData.append("image", categoryImage);

          const uploadResponse = await fetch(
            "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
            {
              method: "POST",
              body: formData,
            }
          );
          const uploadData = await uploadResponse.json();

          if (uploadData.success) {
            imageUrl = uploadData.data.display_url;
          } else {
            throw new Error("Image upload failed");
          }
        }

        await apiClient.post(
          "/api/categories",
          {
            categoryName: values.categoryName,
            categoryDescription: values.categoryDescription,
            imageUrl,
          },
          {
            headers: {
              Authorization: varToken,
            },
          }
        );

        toast.success("Category created successfully!", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate("/Dashboard/Categories");
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error("Failed to create category. Please try again.", {
          position: "bottom-right",
          transition: Zoom,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCategoryImage(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Create New Category</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <TextField
            label="Category Name"
            fullWidth
            name="categoryName"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.categoryName && Boolean(formik.errors.categoryName)
            }
            helperText={
              formik.touched.categoryName && formik.errors.categoryName
            }
            required
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            name="categoryDescription"
            value={formik.values.categoryDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.categoryDescription &&
              Boolean(formik.errors.categoryDescription)
            }
            helperText={
              formik.touched.categoryDescription &&
              formik.errors.categoryDescription
            }
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
          {categoryImage != null || (
            <div className="text-red-500">Image is required</div>
          )}
          {categoryImage && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(categoryImage)}
                alt="Category Image Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </Box>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreateCategory;
