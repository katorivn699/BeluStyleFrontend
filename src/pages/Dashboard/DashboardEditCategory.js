import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  InputLabel,
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardEditCategory = () => {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiClient.get(`/api/categories/${categoryId}`, {
          headers: {
            Authorization: varToken,
          },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        { categoryId, categoryName, categoryDescription, imageUrl },
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
    }
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Category
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <InputLabel htmlFor="brandImage" sx={{ mt: 2 }}>
              Logo (Leave blank to keep current logo)
            </InputLabel>
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
              >
                Update
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardEditCategory;
