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

const DashboardEditBrand = () => {
  const { brandId } = useParams();
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await apiClient.get(`/api/brands/${brandId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
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
    setBrandImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let logoUrl = currentLogoUrl;

      if (brandImage) {
        const formData = new FormData();
        formData.append("image", brandImage);

        await toast.promise(
          fetch(
            "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
            {
              method: "POST",
              body: formData,
            }
          )
            .then((uploadResponse) => uploadResponse.json())
            .then((uploadData) => {
              if (uploadData.success) {
                logoUrl = uploadData.data.display_url;
              } else {
                throw new Error("Image upload failed");
              }
            }),
          {
            pending: "Uploading image...",
            success: "Image uploaded successfully!",
            error: "Image upload failed",
          },
          {
            position: "bottom-right",
            transition: Zoom,
          }
        );
      }

      await apiClient.put(
        "/api/brands",
        {
          brandId,
          brandName,
          brandDescription,
          websiteUrl,
          logoUrl,
        },
        {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        }
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
        <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </Button>

        {/* Display current logo if available */}
        {currentLogoUrl && (
          <Box mt={2} display="flex" justifyContent="center">
            <img
              src={currentLogoUrl}
              alt="Current Logo"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
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
