import React, { useEffect, useState } from "react";
import { apiClient } from "../../core/api"; // Your API client
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Zoom,
} from "@mui/material";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardAddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [variations, setVariations] = useState([
    { sizeId: "", colorId: "", productPrice: 0, productVariationImage: null },
  ]);
  const navigate = useNavigate();

  const varToken = localStorage.getItem("_auth");
  useEffect(() => {
    apiClient
      .get("/api/sizes", { headers: { Authorization: "Bearer " + varToken } })
      .then((response) => setSizes(response.data));
    apiClient
      .get("/api/categories", {
        headers: { Authorization: "Bearer " + varToken },
      })
      .then((response) => setCategories(response.data));
    apiClient
      .get("/api/brands", { headers: { Authorization: "Bearer " + varToken } })
      .then((response) => setBrands(response.data));
    apiClient
      .get("/api/colors", { headers: { Authorization: "Bearer " + varToken } })
      .then((response) => setColors(response.data));
  }, []);

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

    const productData = {
      productName,
      productDescription,
      categoryId,
      brandId,
      variations: uploadedVariations,
    };

    apiClient
      .post("/api/products", productData, {
        headers: { Authorization: "Bearer " + varToken },
      })
      .then((response) => {
        toast.success("Product added successfully!", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate("/Dashboard/Products");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add product", {
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
      <h1 className="text-2xl font-bold">Add Product</h1>
      <TextField
        label="Product Name"
        fullWidth
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />
      <TextField
        label="Product Description"
        fullWidth
        multiline
        rows={4}
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        required
      />
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Brand</InputLabel>
        <Select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          required
        >
          {brands.map((brand) => (
            <MenuItem key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
              src={variation.productVariationImage}
              alt="Product Variation"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
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

export default DashboardAddProducts;
