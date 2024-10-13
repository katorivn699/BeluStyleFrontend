import React, { useState } from "react";

const FilterComponent = ({ onFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => 
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setPriceRange((prev) =>
      name === "min"
        ? [parseFloat(value), prev[1]]
        : [prev[0], parseFloat(value)]
    );
  };

  const handleRatingChange = (event) => {
    setSelectedRating(parseInt(event.target.value));
  };

  const applyFilters = () => {
    onFilter({ selectedCategories, selectedBrands, priceRange, selectedRating });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl mb-2">Filter Products</h3>

      <div className="mb-4">
        <h4 className="text-lg">Categories</h4>
        {/* Example checkboxes */}
        <label>
          <input
            type="checkbox"
            className="checkbox"
            value="Tops"
            onChange={() => handleCategoryChange("Tops")}
          />
          Tops
        </label>
        <label>
          <input
            type="checkbox"
            value="Shoes"
            className="checkbox"
            onChange={() => handleCategoryChange("Shoes")}
          />
          Shoes
        </label>
        <label>
          <input
            type="checkbox"
            value="Pants"
            className="checkbox"
            onChange={() => handleCategoryChange("Pants")}
          />
          Pants
        </label>
      </div>

      <div className="mb-4">
        <h4 className="text-lg">Brands</h4>
        {/* Example checkboxes */}
        <label>
          <input
            type="checkbox"
            value="Cloudzy"
            className="checkbox"
            onChange={() => handleBrandChange("Cloudzy")}
          />
          Cloudzy
        </label>
        <label>
          <input
            type="checkbox"
            value="Gido"
            className="checkbox"
            onChange={() => handleBrandChange("Gido")}
          />
          Gido
        </label>
        <label>
          <input
            type="checkbox"
            value="Dirty coins"
            className="checkbox"
            onChange={() => handleBrandChange("Dirty coins")}
          />
          Dirty coins
        </label>
      </div>

      <div className="mb-4">
        <h4 className="text-lg">Price Range</h4>
        <input
          type="number"
          name="min"
          placeholder="Min"
          onChange={handlePriceChange}
        />
        <input
          type="number"
          name="max"
          placeholder="Max"
          onChange={handlePriceChange}
        />
      </div>

      <div className="mb-4">
        <h4 className="text-lg">Rating</h4>
        <input
          type="number"
          min="1"
          max="5"
          onChange={handleRatingChange}
        />
      </div>

      <button onClick={applyFilters} className="btn btn-primary">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterComponent;
