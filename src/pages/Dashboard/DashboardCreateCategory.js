import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const DashboardCreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // State for the image file
  const [previewImage, setPreviewImage] = useState(null); // State for image preview
  const navigate = useNavigate();
  const varToken = localStorage.getItem("_auth");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);

    // Generate image preview URL
    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", categoryImage);

    const uploadPromise = fetch(
      "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
      {
        method: "POST",
        body: formData,
      }
    );

    toast.promise(
      uploadPromise
        .then((uploadResponse) => uploadResponse.json())
        .then(async (uploadData) => {
          if (uploadData.success) {
            const imageUrl = uploadData.data.display_url;

            // Send the category data to the backend
            await apiClient.post(
              "/api/categories",
              {
                categoryName,
                categoryDescription,
                imageUrl,
              },
              {
                headers: {
                  Authorization: "Bearer " + varToken,
                },
              }
            );

            navigate("/Dashboard/Categories");
          } else {
            throw new Error("Image upload failed");
          }
        })
        .catch((error) => {
          console.error("Error creating category:", error);
          throw error;
        }),
      {
        pending: "Uploading image and creating category...",
        success: "Category created successfully!",
        error: "Failed to create category. Please try again.",
      },
      {
        position: "bottom-right",
        transition: Zoom,
      }
    );
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Category
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Category Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <Box mt={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                  required
                />
              </Button>
            </Box>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardCreateCategory;
