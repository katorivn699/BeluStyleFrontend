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
} from "@mui/material";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let logoUrl = currentLogoUrl;

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

      await apiClient.put(
        "/api/brands",
        { brandId, brandName, brandDescription, websiteUrl, logoUrl },
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Brand Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}
          required
        />
        <TextField
          label="Website URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          required
        />

        <InputLabel htmlFor="brandImage" sx={{ mt: 2 }}>
          Logo (Leave blank to keep current logo)
        </InputLabel>
        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default DashboardEditBrand;
