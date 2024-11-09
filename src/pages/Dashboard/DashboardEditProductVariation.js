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
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardEditProductVariation = () => {
  const { productId, productVariationId } = useParams();
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const [sizeId, setSizeId] = useState("");
  const [colorId, setColorId] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productVariationImage, setProductVariationImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchProductVariation = async () => {
      try {
        const response = await apiClient.get(
          `/api/product-variations/${productVariationId}`,
          {
            headers: { Authorization: varToken },
          }
        );
        const { size, color, productPrice, productVariationImage } =
          response.data;
        setSizeId(size.sizeId);
        setColorId(color.colorId);
        setProductPrice(productPrice);
        setCurrentImageUrl(productVariationImage);
      } catch (error) {
        console.error("Error fetching product variation data:", error);
      }
    };

    const fetchSizesAndColors = async () => {
      try {
        const sizesResponse = await apiClient.get("/api/sizes", {
          headers: { Authorization: varToken },
        });
        const colorsResponse = await apiClient.get("/api/colors", {
          headers: { Authorization: varToken },
        });
        setSizes(sizesResponse.data);
        setColors(colorsResponse.data);
      } catch (error) {
        console.error("Error fetching sizes and colors:", error);
      }
    };

    fetchProductVariation();
    fetchSizesAndColors();
  }, [productVariationId, varToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductVariationImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let imageUrl = currentImageUrl;

      if (productVariationImage) {
        const formData = new FormData();
        formData.append("image", productVariationImage);
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
        `/api/product-variations/${productVariationId}`,
        { sizeId, colorId, productPrice, productVariationImage: imageUrl },
        { headers: { Authorization: varToken } }
      );

      toast.success("Product Variation updated successfully", {
        position: "bottom-right",
        transition: Zoom,
      });
      navigate(`/Dashboard/Products/${productId}`);
    } catch (error) {
      toast.error("Update failed", {
        position: "bottom-right",
        transition: Zoom,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Product Variation
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Size</InputLabel>
          <Select
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value)}
            required
          >
            {sizes.map((size) => (
              <MenuItem key={size.sizeId} value={size.sizeId}>
                {size.sizeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Color</InputLabel>
          <Select
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            required
          >
            {colors.map((color) => (
              <MenuItem key={color.colorId} value={color.colorId}>
                {color.colorName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Product Price"
          variant="outlined"
          fullWidth
          margin="normal"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          type="number"
          required
          onBlur={(e) => {
            // Check if value is within min and max range
            const value = parseFloat(e.target.value);
            if (value < 0) {
              setProductPrice(0);
            } else if (value > 999999999999) {
              setProductPrice(999999999999);
            }
          }}
          inputProps={{ min: 0, max: 999999999999 }}
        />

        <InputLabel htmlFor="productVariationImage" sx={{ mt: 2 }}>
          Product Image (Leave blank to keep current image)
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
              alt="New Image Preview"
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
                alt="Current Image"
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
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Product Variation"
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default DashboardEditProductVariation;
