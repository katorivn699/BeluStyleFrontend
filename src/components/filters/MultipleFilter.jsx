import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import {RadioCommon} from "../inputs/Radio";
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

  const handleReset = () => {
    setBrand("");
    setCategory("");
    setPriceOrder("");
    setRating(0);
  }


  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({
      category,
      brand,
      priceOrder,
      rating,
    });
  };

  return (
    <div className="FilterContainer p-4 border rounded-md font-poppins">
      <form onSubmit={handleFilter}>
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-2xl pb-4 font-medium mb-1">Category</label>
          <div className="space-y-2">
            <RadioCommon
              context="All Categories"
              current={category}
              value=""
              id="category"
              handleChecked={() => setCategory("")}
            />
            {categories.length > 0 ? (
              categories.map((categoryItem) => (
                <RadioCommon
                  context={categoryItem.categoryName}
                  current={category}
                  id="category"
                  value={categoryItem.categoryName}
                  handleChecked={() => setCategory(categoryItem.categoryName)}
                />
              ))
            ) : (
              <div className="errorLoad">Error to loading category</div>
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
              handleChecked={() => setBrand("")}
            />
            {brands.length > 0 ? (
              brands.map((brandItem) => (
                <RadioCommon
                  context={brandItem.brandName}
                  current={brand}
                  value={brandItem.brandName}
                  id="brand"
                  handleChecked={() => setBrand(brandItem.brandName)}
                />
              ))
            ) : (
              <div className="error">
                <p>Error to fetching brand list!</p>
              </div>
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
              handleChecked={() => setPriceOrder("")}
            />
            <RadioCommon
              context="Low to High"
              current={priceOrder}
              value="asc"
              id="price"
              handleChecked={() => setPriceOrder("asc")}
            />
            <RadioCommon
              context="High to Low"
              current={priceOrder}
              value="desc"
              id="price"
              handleChecked={() => setPriceOrder("desc")}
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
              onChange={(e, newRating) => setRating(newRating)}
            />
          </div>
        </div>

        {/* Filter Button */}
        <div>
          <button
            type="submit"
            className="w-1/2 py-2 bg-blue-600 text-white rounded-md"
          >
            Apply Filters
          </button>
          <button
            className="w-1/2 py-2 bg-red-600 text-white rounded-md"
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
