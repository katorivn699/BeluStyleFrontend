import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RadioCommon } from "../inputs/Radio";
import { getBrand, getCategory } from "../../service/ShopService";

const FilterComponent = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategory();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandList = await getBrand();
      setBrands(brandList);
    };
    fetchBrands();
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    setBrand("");
    setCategory("");
    setPriceOrder("");
    setRating(0);
    if (typeof onFilter === "function") {
      onFilter({ category: "", brand: "", priceOrder: "", rating: 0 });
    }
  };

  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
    if (typeof onFilter === "function") {
      onFilter({
        category: categoryValue,
        brand,
        priceOrder,
        rating,
      });
    }
  };

  const handleBrandChange = (brandValue) => {
    setBrand(brandValue);
    if (typeof onFilter === "function") {
      onFilter({
        category,
        brand: brandValue,
        priceOrder,
        rating,
      });
    }
  };

  const handlePriceOrderChange = (priceOrderValue) => {
    setPriceOrder(priceOrderValue);
    if (typeof onFilter === "function") {
      onFilter({
        category,
        brand,
        priceOrder: priceOrderValue,
        rating,
      });
    }
  };

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
    if (typeof onFilter === "function") {
      onFilter({
        category,
        brand,
        priceOrder,
        rating: newRating,
      });
    }
  };

  return (
    <div className="FilterContainer p-4 border rounded-md font-poppins">
      <form>
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-2xl pb-4 font-medium mb-1">
            Category
          </label>
          <div className="space-y-2">
            <RadioCommon
              context="All Categories"
              current={category}
              value=""
              id="category"
              handleChecked={() => handleCategoryChange("")}
            />
            {categories.length > 0 ? (
              categories.map((categoryItem) => (
                <RadioCommon
                  key={categoryItem.categoryName}
                  context={categoryItem.categoryName}
                  current={category}
                  id="category"
                  value={categoryItem.categoryName}
                  handleChecked={() => handleCategoryChange(categoryItem.categoryName)}
                />
              ))
            ) : (
              <div className="errorLoad">Error loading categories</div>
            )}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-4">
          <label className="block text-2xl pb-4 font-medium mb-1">Brand</label>
          <div className="space-y-2">
            <RadioCommon
              context="All Brands"
              current={brand}
              value=""
              id="brand"
              handleChecked={() => handleBrandChange("")}
            />
            {brands.length > 0 ? (
              brands.map((brandItem) => (
                <RadioCommon
                  key={brandItem.brandName}
                  context={brandItem.brandName}
                  current={brand}
                  value={brandItem.brandName}
                  id="brand"
                  handleChecked={() => handleBrandChange(brandItem.brandName)}
                />
              ))
            ) : (
              <div className="error">Error fetching brand list!</div>
            )}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-4">
          <label className="block text-2xl pb-4 font-medium mb-1">Price</label>
          <div className="space-y-2">
            <RadioCommon
              context="No Preference"
              current={priceOrder}
              value=""
              id="price"
              handleChecked={() => handlePriceOrderChange("")}
            />
            <RadioCommon
              context="Low to High"
              current={priceOrder}
              value="asc"
              id="price"
              handleChecked={() => handlePriceOrderChange("asc")}
            />
            <RadioCommon
              context="High to Low"
              current={priceOrder}
              value="desc"
              id="price"
              handleChecked={() => handlePriceOrderChange("desc")}
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="block text-2xl pb-4 font-medium mb-1">Rating</label>
          <div className="flex justify-center">
            <Rating
              defaultValue={0}
              value={rating}
              onChange={handleRatingChange}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex space-x-3">
          <button
            type="button"
            className="flex-1 py-2 bg-red-600 text-white rounded-md"
            onClick={handleReset}
          >
            Reset Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterComponent;
