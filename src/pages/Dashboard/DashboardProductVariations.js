import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../core/api"; // Your API client
import { Skeleton } from "@mui/material";

const DashboardProductVariations = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    // Fetch product details from the API
    apiClient
      .get(`/api/products/${productId}/product-variations`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{product.productName}</h1>
      <p className="mt-2 text-gray-600">{product.productDescription}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {product.productVariations.map((variation) => (
          <div
            key={variation.variationId}
            className="border rounded-lg p-4 flex flex-col items-center shadow-md transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src={variation.productVariationImage || "/images/placeholder.png"} // Placeholder if no image
              alt={`${product.productName} - ${variation.color.colorName}`}
              className="w-full h-32 object-cover mb-4 rounded-md"
              style={{ backgroundColor: variation.color.hexCode }}
            />
            <h2 className="font-semibold text-lg">
              Size: {variation.size.sizeName}
            </h2>
            <p className="text-gray-500 b">
              Color: {variation.color.colorName}
            </p>
            <div
              className="w-5 h-5 rounded-full border-2"
              style={{ backgroundColor: variation.color.hexCode }}
            />
            <p className="font-bold mt-2 text-xl">
              Price: ${variation.productPrice.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProductVariations;
