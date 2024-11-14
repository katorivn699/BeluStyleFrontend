import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api"; // Your API client
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";

const DashboardAddProductToSale = () => {
  const { saleId } = useParams(); // Get saleId from the URL
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  useEffect(() => {
    // Fetch available products
    apiClient
      .get("/api/products", {
        headers: {
          Authorization: varToken,
        },
      }) // Adjust this endpoint based on your API
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // Fetch products already in the sale
    apiClient
      .get(`/api/sales/${saleId}/products`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        const existingProductIds = response.data.map(
          (product) => product.productId
        );
        // Filter out products that are already in the sale
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => !existingProductIds.includes(product.productId)
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching existing products in sale:", error);
      });
  }, [saleId]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const handleProductChange = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleAddProducts = () => {
    apiClient
      .post(`/api/sales/${saleId}/products`, selectedProductIds, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success(response.data.message, {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Sales/${saleId}`); // Redirect to sale details page
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Products to Sale</h1>
      <input
        type="text"
        placeholder="Search by product's name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.productId}
            className={`border rounded-md p-2 flex flex-col relative transition-all duration-300 ${
              selectedProductIds.includes(product.productId)
                ? "border-blue-500 border-[5px]"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              id={`product-${product.productId}`}
              checked={selectedProductIds.includes(product.productId)}
              onChange={() => handleProductChange(product.productId)}
              className="absolute opacity-0" // Hide the default checkbox
            />
            <label
              htmlFor={`product-${product.productId}`}
              className="flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <img
                src={product.productVariationImage}
                alt={product.productName}
                className="w-full h-32 object-cover mb-2"
              />
              <h2 className="font-semibold">{product.productName}</h2>
              <p className="text-sm">{product.productDescription}</p>
              <p className="text-gray-500">Brand: {product.brandName}</p>
              <p className="text-gray-500">Category: {product.categoryName}</p>
              <p className="font-bold">
                Price: {formatPrice(product.productPrice)}
              </p>
              <p className="text-gray-400">
                Avg. Rating: {product.averageRating} ({product.totalRatings}{" "}
                ratings)
              </p>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddProducts}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Products
      </button>
    </div>
  );
};

export default DashboardAddProductToSale;
