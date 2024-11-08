import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Skeleton,
} from "@mui/material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";

const DashboardEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  useEffect(() => {
    fetchProductDetails();
    fetchCategoriesAndBrands();
  }, [productId]);

  const fetchProductDetails = () => {
    setLoading(true);
    apiClient
      .get(`/api/products/${productId}/product-variations`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        const { productName, productDescription, category, brand } =
          response.data;
        setProduct(response.data);
        setProductName(productName);
        setProductDescription(productDescription);
        setCategoryId(category.categoryId);
        setBrandId(brand.brandId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  };

  const fetchCategoriesAndBrands = () => {
    apiClient
      .get(`/api/categories`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    apiClient
      .get(`/api/brands`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  };

  const handleSubmit = () => {
    const updatedProduct = {
      productName,
      productDescription,
      categoryId,
      brandId,
    };

    apiClient
      .put(`/api/products/${productId}`, updatedProduct, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success(response.data.message, {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Products/${productId}`); // Redirect to the product details page
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Failed to update product.", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Update Product</h1>

      <form className="mt-6">
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mb-4"
        />
        <TextField
          label="Product Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="mb-4"
        />

        <FormControl fullWidth className="mb-4">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth className="mb-4">
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            label="Brand"
          >
            {brands.map((brand) => (
              <MenuItem key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update Product
        </Button>
      </form>
    </div>
  );
};

export default DashboardEditProduct;
