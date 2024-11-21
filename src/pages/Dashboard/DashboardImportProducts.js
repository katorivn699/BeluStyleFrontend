import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { formatPrice } from "../../components/format/formats";

const DashboardImportProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const authUser = useAuthUser();
  const username = authUser.username;
  const varToken = useAuthHeader();
  const { stockId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products
    apiClient
      .get("/api/products", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch brands
    apiClient
      .get("/api/brands", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setBrands(response.data))
      .catch((error) => console.error("Error fetching brands:", error));

    // Fetch categories
    apiClient
      .get("/api/categories", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [varToken]);

  // Filter products based on search term, selected brand, and selected category
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => {
        const matchesSearch = product.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesBrand = selectedBrand
          ? product.brandId === parseInt(selectedBrand)
          : true;
        const matchesCategory = selectedCategory
          ? product.categoryId === parseInt(selectedCategory)
          : true;
        return matchesSearch && matchesBrand && matchesCategory;
      })
    );
  }, [products, searchTerm, selectedBrand, selectedCategory]);

  const handleVariationChange = (variationId, quantity) => {
    setSelectedVariations((prev) => {
      const updatedVariations = { ...prev };
      if (quantity > 0) {
        updatedVariations[variationId] = parseInt(quantity);
      } else {
        delete updatedVariations[variationId];
      }
      return updatedVariations;
    });
  };

  const handleSubmit = () => {
    const variations = Object.entries(selectedVariations).map(
      ([variationId, quantity]) => ({
        productVariationId: parseInt(variationId),
        quantity,
      })
    );

    const payload = {
      stockId,
      username,
      variations,
    };

    apiClient
      .post("/api/stock-transactions", payload, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success("Import successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Warehouse/${stockId}`);
      })
      .catch((error) => {
        toast.error("Import failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Import Products into Stock #{stockId}
      </h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md"
        />
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onVariationChange={handleVariationChange}
            selectedVariations={selectedVariations}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="block mt-8 mx-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
};

const ProductCard = ({ product, onVariationChange, selectedVariations }) => {
  const [variations, setVariations] = useState([]);
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get(`/api/products/${product.productId}/product-variations`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setVariations(response.data.productVariations))
      .catch((error) => console.error("Error fetching variations:", error));
  }, [product.productId, varToken]);

  return (
    <div
      className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200"
      style={{ minWidth: "330px" }}
    >
      <div className="flex items-center mb-4">
        <img
          src={product.productVariationImage}
          alt={product.productName}
          className="w-20 h-20 rounded-lg shadow mr-4 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {product.productName}
          </h2>
          <p className="text-sm text-gray-600">{product.productDescription}</p>
          <p className="text-sm text-gray-600">Brand: {product.brandName}</p>
          <p className="text-sm text-gray-600">
            Category: {product.categoryName}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {" "}
        {/* Set grid for variations */}
        {variations.map((variation) => (
          <VariationCard
            key={variation.variationId}
            variation={variation}
            onVariationChange={onVariationChange}
            isSelected={selectedVariations[variation.variationId] > 0}
          />
        ))}
      </div>
    </div>
  );
};

const VariationCard = ({ variation, onVariationChange, isSelected }) => {
  const [quantity, setQuantity] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const handleCardClick = () => {
    if (!showInput) {
      setShowInput(true);
      setQuantity(quantity || 1);
      onVariationChange(variation.variationId, quantity || 1);
    } else {
      setShowInput(false);
      onVariationChange(variation.variationId, 0);
      setQuantity(0);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10) || 0;
    if (value === "0" || parsedValue === 0) {
      setQuantity("");
      onVariationChange(variation.variationId, 0);
    } else {
      setQuantity(parsedValue);
      onVariationChange(variation.variationId, parsedValue);
    }
  };

  return (
    <div
      className={`p-2 rounded-lg border text-center shadow-sm cursor-pointer transition duration-200 ${
        isSelected ? "border-green-500 bg-green-50" : "bg-gray-50"
      }`}
      onClick={handleCardClick}
      style={{ minWidth: "90px", maxWidth: "110px" }} // Adjusted minWidth and maxWidth
    >
      <img
        src={variation.productVariationImage}
        alt={`${variation.size.sizeName} ${variation.color.colorName}`}
        className="w-full h-16 rounded-lg object-cover mb-1"
      />
      <p className="text-xs font-medium text-gray-700">
        Size: {variation.size.sizeName}
      </p>
      <p className="text-xs text-gray-700">
        Color: {variation.color.colorName}
      </p>
      <p className="text-xs font-semibold text-gray-800">
        Price: {formatPrice(variation.productPrice)}
      </p>
      {showInput && (
        <input
          type="number"
          min="0"
          value={quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={handleQuantityChange}
          placeholder="Quantity"
          className="mt-1 w-full p-1 border rounded focus:outline-none focus:ring focus:ring-green-200"
        />
      )}
    </div>
  );
};

export default DashboardImportProducts;
