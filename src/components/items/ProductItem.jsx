import { Rating } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  let discountedPrice = product.saleType;
  if (product.saleType === "percentage") {
    discountedPrice =
      product.productPrice - product.productPrice * (product.saleValue / 100);
  } else if (product.saleType === "fixed amount") {
    discountedPrice = product.productPrice - product.saleValue;
  }
  console.log(product.averageRating);

  return (
    <div className="w-full max-w-[350px] bg-base-200 rounded-lg overflow-hidden shadow-md p-4 mx-auto">
      <Link to={`/shop/product/${product.productId}`} className="block">
        {/* Product Image */}
        <img
          className="w-full h-64 object-cover rounded-md" // Make the image responsive
          src={product.productImage}
          loading="lazy"
          alt={product.productName}
        />

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-primary-content truncate">
            {product.productName}
          </h3>

          {/* Product Price */}
          <p className="text-blue-600 font-semibold text-xl mb-2">
            ${discountedPrice.toFixed(2) < 0 ? 0 : discountedPrice.toFixed(2)}
          </p>

          {/* Original Price if Sale is Active */}
          {product.saleValue > 0 && (
            <p className="text-red-500 font-semibold text-sm line-through mb-1">
              ${product.productPrice.toFixed(2)}
            </p>
          )}

          <div className="flex items-center">
            <Rating
              name="half-rating-read"
              value={product.rating}
              precision={0.5}
              readOnly
            />
            <span className="ml-2 text-gray-600 text-sm">
              ({product.totalRating})
            </span>
          </div>

          {product.saleValue > 0 && (
            <div className="mt-2 bg-red-100 text-red-700 text-sm font-bold py-1 px-2 rounded text-center">
              {product.saleType === "percentage"
                ? `Giảm ${product.saleValue}%`
                : `Giảm $${product.saleValue.toFixed(2)}`}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
