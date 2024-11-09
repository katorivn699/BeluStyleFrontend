import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const DashboardCreateBrand = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const formik = useFormik({
    initialValues: {
      brandName: "",
      brandDescription: "",
      websiteUrl: "",
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let logoUrl = "";

        if (logoFile) {
          const formData = new FormData();
          formData.append("image", logoFile);

          const response = await fetch(
            "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();

          if (data.success) {
            logoUrl = data.data.display_url;
            toast.success("Image uploaded successfully!");
          } else {
            throw new Error("Image upload failed");
          }
        }

        await apiClient.post(
          "/api/brands",
          {
            brandName: values.brandName,
            brandDescription: values.brandDescription,
            websiteUrl: values.websiteUrl,
            logoUrl,
          },
          {
            headers: {
              Authorization: varToken,
            },
          }
        );

        navigate("/Dashboard/Brands");
      } catch (error) {
        console.error("Error creating brand:", error);
        toast.error("Failed to create brand");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Create New Brand</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <TextField
            label="Brand Name"
            fullWidth
            name="brandName"
            value={formik.values.brandName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.brandName && Boolean(formik.errors.brandName)}
            helperText={formik.touched.brandName && formik.errors.brandName}
            required
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            name="brandDescription"
            value={formik.values.brandDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.brandDescription &&
              Boolean(formik.errors.brandDescription)
            }
            helperText={
              formik.touched.brandDescription && formik.errors.brandDescription
            }
            margin="normal"
          />
          <TextField
            label="Website URL"
            fullWidth
            name="websiteUrl"
            value={formik.values.websiteUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)
            }
            helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Logo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setLogoFile(file);
                }}
                required
              />
            </Button>
          </Box>
          {logoFile && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(logoFile)}
                alt="Brand Logo"
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

export default DashboardCreateBrand;
