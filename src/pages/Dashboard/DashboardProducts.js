import React, { useEffect, useState } from "react";
import { apiClient } from "../../core/api"; // Your API client
import { Skeleton } from "@mui/material";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products from the API
    apiClient
      .get("/api/products") // Adjust this endpoint as needed
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Product List</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.productId}
            className="border rounded-md p-2 flex flex-col relative transition-all duration-300 border-gray-300"
          >
            <div className="flex flex-col items-center justify-center p-4">
              <img
                src={product.productVariationImage || "/images/placeholder.png"} // Placeholder if no image
                alt={product.productName}
                className="w-full h-32 object-cover mb-2"
              />
              <h2 className="font-semibold">{product.productName}</h2>
              <p className="text-sm">{product.productDescription}</p>
              <p className="text-gray-500">Brand: {product.brandName}</p>
              <p className="text-gray-500">Category: {product.categoryName}</p>
              <p className="font-bold">
                Price: $
                {product.productPrice ? product.productPrice.toFixed(2) : "N/A"}
              </p>
              <p className="text-gray-400">
                Avg. Rating: {product.averageRating} ({product.totalRatings}{" "}
                ratings)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProducts;
