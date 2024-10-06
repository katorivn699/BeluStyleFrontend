import { Rating, Star } from "@smastrom/react-rating";
import React, { useState } from "react";

const ProductFilter = ({ categories, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100]);
  const [selectedRating, setSelectedRating] = useState([0]);
  const [sortOrder, setSortOrder] = useState("default"); // Default sorting

  const rating = [1, 2, 3, 4, 5];

  const [isChecked1, setIsChecked1] = useState(true); // Pre-checked
  const [isExpanded1, setIsExpanded1] = useState(false); // Initially collapsed

  const toggleCheckbox1 = () => {
    setIsChecked1(!isChecked1); // Toggle the checked state
    if (isChecked1) {
      setIsExpanded1(!isExpanded1); // Expand if checked
    } else {
      setIsExpanded1(false); // Collapse if unchecked
    }
  };

  const [isChecked2, setIsChecked2] = useState(true); // Pre-checked
  const [isExpanded2, setIsExpanded2] = useState(false); // Initially collapsed

  const toggleCheckbox2 = () => {
    setIsChecked2(!isChecked2); // Toggle the checked state
    if (isChecked2) {
      setIsExpanded2(!isExpanded2); // Expand if checked
    } else {
      setIsExpanded2(false); // Collapse if unchecked
    }
  };

  const [isChecked3, setIsChecked3] = useState(true); // Pre-checked
  const [isExpanded3, setIsExpanded3] = useState(false); // Initially collapsed

  const toggleCheckbox3 = () => {
    setIsChecked3(!isChecked3); // Toggle the checked state
    if (isChecked3) {
      setIsExpanded3(!isExpanded3); // Expand if checked
    } else {
      setIsExpanded3(false); // Collapse if unchecked
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setSelectedCategory("");
      onFilterChange({
        category: "",
        priceRange: selectedPriceRange,
        rating: selectedRating,
      });
    } else {
      // Handle other categories
      setSelectedCategory(value);
      onFilterChange({
        category: value,
        priceRange: selectedPriceRange,
        rating: selectedRating,
      });
    }
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Number(e.target.value);
    setSelectedPriceRange([selectedPriceRange[0], newMaxPrice]);
    onFilterChange({
      category: selectedCategory,
      priceRange: [selectedPriceRange[0], newMaxPrice],
      rating: selectedRating,
    });
  };

  const handleRatingChange = (e) => {
    console.log(e.target.value);
    setSelectedRating(e.target.value);
    onFilterChange({
      category: selectedCategory,
      priceRange: selectedPriceRange,
      rating: e.target.value,
    });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    onFilterChange({
      category: selectedCategory,
      priceRange: selectedPriceRange,
      rating: selectedRating,
      sortOrder: e.target.value,
    });
  };

  return (
    <div className="filterSidebar p-4 bg-base-200 shadow-lg rounded-lg">
      {/* Sort Filter */}
      <div className="filterSection mb-6">
        <h2 className="text-lg font-semibold mb-2">Sort By Price</h2>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="select select-bordered w-full"
        >
          <option value="default">Select Sort Order</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>
      {/* Category Filter */}
      <div className="filterSection mb-6 collapse bg-base-200 collapse-arrow">
        <input
          type="checkbox"
          checked={isChecked1}
          onChange={toggleCheckbox1}
        />
        <h2 className="collapse-title text-xl font-medium">Category</h2>
        <div className="collapse-content space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              value=""
              checked={selectedCategory === ""}
              onChange={handleCategoryChange}
              className="checkbox mr-2"
            />
            All Categories
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategory.includes(category)}
                onChange={handleCategoryChange}
                className="checkbox mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filterSection mb-6 collapse bg-base-200 collapse-arrow">
        <input
          type="checkbox"
          checked={isChecked2}
          onChange={toggleCheckbox2}
        />
        <h2 className="collapse-title text-xl font-medium">Price</h2>
        <div className="collapse-content">
          <div className="flex justify-between text-sm mb-2">
            <span>${selectedPriceRange[0]}</span>
            <span>${selectedPriceRange[1]}</span>
          </div>
          <input
            type="range"
            min={selectedPriceRange[0]}
            value={selectedPriceRange[1]}
            onChange={handleMaxPriceChange}
            step="1"
            className="range range-primary w-full"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="filterSection mb-6 collapse bg-base-200 collapse-arrow">
        <input
          type="checkbox"
          checked={isChecked3}
          onChange={toggleCheckbox3}
        />
        <h2 className="collapse-title text-xl font-medium">Rating</h2>
        <div className="collapse-content space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              value="0"
              checked={selectedRating.includes(0)}
              onChange={handleRatingChange}
              className="checkbox mr-2"
            />
            All Ratings
          </label>
          {rating.map((num) => (
            <label className="flex items-center" key={num}>
              <input
                type="checkbox"
                value={num}
                checked={selectedRating.includes(num.toString())}
                onChange={handleRatingChange}
                className="checkbox mr-2"
              />
              <Rating
                style={{ maxWidth: 100 }}
                readOnly
                value={num}
                itemStyles={{
                  itemShapes: Star,
                  activeFillColor: "#ffb700",
                  inactiveFillColor: "#fbf1a9",
                }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
