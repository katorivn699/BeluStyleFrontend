import React, { useState } from "react";
import { Rating } from "@smastrom/react-rating"; // Assuming this is the package used for the Rating component
import { Star } from "@smastrom/react-rating";  // Star shape if needed for itemShapes

const FilterComponent = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceOrder, setPriceOrder] = useState(""); // "lowToHigh" or "highToLow"
  const [rating, setRating] = useState(0);  // Changed to handle numeric ratings

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
    <div className="FilterContainer p-4 border rounded-md">
      <form onSubmit={handleFilter}>
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value=""
                checked={category === ""}
                onChange={() => setCategory("")}
                className="mr-2 radio"
              />
              All Categories
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Tops"
                checked={category === "Tops"}
                onChange={() => setCategory("Tops")}
                className="mr-2 radio"
              />
              Tops
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Bottoms"
                checked={category === "Bottoms"}
                onChange={() => setCategory("Bottoms")}
                className="mr-2 radio"
              />
              Bottoms
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Shoes"
                checked={category === "Shoes"}
                onChange={() => setCategory("Shoes")}
                className="mr-2 radio"
              />
              Shoes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Accessories"
                checked={category === "Accessories"}
                onChange={() => setCategory("Accessories")}
                className="mr-2 radio"
              />
              Accessories
            </label>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Brand</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value=""
                checked={brand === ""}
                onChange={() => setBrand("")}
                className="mr-2 radio"
              />
              All Brands
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Cloudzy"
                checked={brand === "Cloudzy"}
                onChange={() => setBrand("Cloudzy")}
                className="mr-2 radio"
              />
              Cloudzy
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="SkyWear"
                checked={brand === "SkyWear"}
                onChange={() => setBrand("SkyWear")}
                className="mr-2 radio"
              />
              SkyWear
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="UrbanStyle"
                checked={brand === "UrbanStyle"}
                onChange={() => setBrand("UrbanStyle")}
                className="mr-2 radio"
              />
              UrbanStyle
            </label>
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value=""
                checked={priceOrder === ""}
                onChange={() => setPriceOrder("")}
                className="mr-2 radio"
              />
              No Preference
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="lowToHigh"
                checked={priceOrder === "lowToHigh"}
                onChange={() => setPriceOrder("lowToHigh")}
                className="mr-2 radio"
              />
              Low to High
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="highToLow"
                checked={priceOrder === "highToLow"}
                onChange={() => setPriceOrder("highToLow")}
                className="mr-2 radio"
              />
              High to Low
            </label>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex justify-center">
            <Rating
              style={{ maxWidth: 200 }}
              readOnly={false} // Now it's interactive
              value={rating}
              onChange={(newRating) => setRating(newRating)} // Update rating state
              itemStyles={{
                itemShapes: Star,
                activeFillColor: "#ffb700",
                inactiveFillColor: "#fbf1a9",
              }}
            />
          </div>
        </div>

        {/* Filter Button */}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterComponent;
