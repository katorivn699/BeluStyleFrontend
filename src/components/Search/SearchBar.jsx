import React, { useState, useEffect, useRef } from "react";
import useSearchBar from "../hooks/SearchHook";
import { getProductList } from "../../service/ShopService";
import { Link } from "react-router-dom";

const SearchBar = ({ toggleSearchBar }) => {
  const [query, setQuery] = useState("");
  const { isSearchOpen } = useSearchBar();
  const [products, setProducts] = useState([]);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList();
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on the query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Tìm kiếm với:", query);
  };

  // Close search bar on outside click
  const handleClickOutside = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      toggleSearchBar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={searchBarRef}
        className={`fixed top-28 left-[30%] transform -translate-x-1/2 z-50 bg-white p-4 rounded-full shadow-lg flex items-center gap-3 ${
          isSearchOpen ? "animate-slide-out" : "animate-slide-in"
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Tìm kiếm..."
          className="border border-gray-300 rounded-full px-4 py-2 w-[40rem]"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
        >
          Find
        </button>
      </div>

      {/* Floating container for search results */}
      {query && filteredProducts.length > 0 && (
        <div
          className="fixed top-[11.1rem] left-1/2 transform -translate-x-1/2 z-50 w-[40rem] bg-white shadow-lg rounded-b-lg border-t border-gray-200 mt-2"
          onMouseDown={(e) => e.stopPropagation()} // Prevent close on click inside dropdown
        >
          <ul className="max-h-64 overflow-y-auto">
            {filteredProducts.map((product) => (
              <Link
                to={`/shop/product/${product.productId}`}
                key={product.productId}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent close on link click
                  toggleSearchBar(); // Close search bar when clicking a product
                }}
              >
                <li className="flex items-center py-3 px-4 hover:bg-blue-100 cursor-pointer">
                  <img
                    src={product.productVariationImage}
                    alt={product.productName}
                    className="w-12 h-12 mr-4 rounded-full"
                  />
                  <span>{product.productName}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SearchBar;
