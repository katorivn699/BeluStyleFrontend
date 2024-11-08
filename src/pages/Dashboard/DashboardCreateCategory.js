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
  CircularProgress,
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardCreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCategoryImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          categoryName,
          categoryDescription,
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
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </Button>
            </Box>
            {categoryImage && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="Category Image Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </Box>
            )}
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardCreateCategory;
