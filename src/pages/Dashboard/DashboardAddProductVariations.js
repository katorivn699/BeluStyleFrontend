import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Zoom,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast } from "react-toastify";

const DashboardAddProductVariations = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([
    { sizeId: "", colorId: "", productPrice: 0, productVariationImage: null },
  ]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const varToken = useAuthHeader();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      apiClient
        .get(`/api/products/${productId}/product-variations`, {
          headers: { Authorization: varToken },
        })
        .then((response) => setProduct(response.data))
        .catch((error) => toast.error("Failed to fetch product details"));
    }

    apiClient
      .get("/api/sizes", { headers: { Authorization: varToken } })
      .then((response) => setSizes(response.data));
    apiClient
      .get("/api/colors", { headers: { Authorization: varToken } })
      .then((response) => setColors(response.data));
  }, [productId, varToken]);

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      { sizeId: "", colorId: "", productPrice: 0, productVariationImage: null },
    ]);
  };

  const handleRemoveVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return toast.promise(
      fetch(
        "https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            return data.data.display_url;
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
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedVariations = await Promise.all(
      variations.map(async (variation) => {
        if (variation.productVariationImage) {
          const imageUrl = await uploadImage(variation.productVariationImage);
          return { ...variation, productVariationImage: imageUrl };
        }
        return variation;
      })
    );

    const updatedProductData = {
      variations: uploadedVariations,
    };

    apiClient
      .post(
        `/api/products/${productId}/product-variations`,
        updatedProductData,
        {
          headers: { Authorization: varToken },
        }
      )
      .then(() => {
        toast.success("Product variations added successfully!", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Products`);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add product variations", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newVariations = [...variations];
      newVariations[index].productVariationImage = file;
      setVariations(newVariations);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Add Product Variations</h1>
      {product && (
        <>
          <TextField
            label="Product Name"
            fullWidth
            value={product.productName}
            disabled
          />
          <TextField
            label="Product Description"
            fullWidth
            multiline
            rows={4}
            value={product.productDescription}
            disabled
          />
        </>
      )}

      <h2 className="text-xl font-semibold">Product Variations</h2>
      {variations.map((variation, index) => (
        <Box key={index} className="p-4 border rounded space-y-4">
          <FormControl fullWidth>
            <InputLabel>Size</InputLabel>
            <Select
              value={variation.sizeId}
              onChange={(e) =>
                handleVariationChange(index, "sizeId", e.target.value)
              }
              required
            >
              {sizes.map((size) => (
                <MenuItem key={size.sizeId} value={size.sizeId}>
                  {size.sizeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Color</InputLabel>
            <Select
              value={variation.colorId}
              onChange={(e) =>
                handleVariationChange(index, "colorId", e.target.value)
              }
              required
            >
              {colors.map((color) => (
                <MenuItem key={color.colorId} value={color.colorId}>
                  <span
                    style={{ backgroundColor: color.hexCode, marginRight: 8 }}
                    className="w-4 h-4 inline-block rounded-full"
                  />
                  {color.colorName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={variation.productPrice}
            onChange={(e) =>
              handleVariationChange(index, "productPrice", e.target.value)
            }
            required
          />
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              onChange={(e) => handleImageChange(index, e)}
            />
          </Button>
          {variation.productVariationImage && (
            <img
              src={URL.createObjectURL(variation.productVariationImage)}
              alt="Product Variation"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
          <IconButton
            onClick={() => handleRemoveVariation(index)}
            color="error"
            aria-label="delete variation"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAddVariation}>
        Add Variation
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default DashboardAddProductVariations;
