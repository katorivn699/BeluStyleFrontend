import React from "react";
import { Link } from "react-router-dom";
import { Rating, Star } from '@smastrom/react-rating';

const ProductItem = ({ product }) => {
  let discountedPrice = product.saleType;
  if (product.saleType === "percentage") {
    discountedPrice = product.productPrice - (product.productPrice * (product.saleValue / 100));
  } else if (product.saleType === "fixed amount") {
    discountedPrice = product.productPrice - product.saleValue;
  }

  return (
    <div className="max-w-xs w-full mx-auto bg-white rounded-lg overflow-hidden shadow-md p-2">
      <Link to={`/products/${product.productId}`} className="block">
        <img
          className="w-full h-64 object-cover max-w-full" // Added max-w-full
          src={product.productImage}
          alt={product.productName}
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.productName}
        </h3>
        <p className="text-blue-600 font-semibold text-xl mb-2">
          ${discountedPrice.toFixed(2) < 0 ? 0 : discountedPrice.toFixed(2)}
        </p>
        {product.saleValue > 0 && (
          <p className="text-red-500 font-semibold text-sm line-through mb-1">
            ${product.productPrice.toFixed(2)}
          </p>
        )}
        <div className="flex items-center">
          <Rating
            style={{ maxWidth: 100 }}
            readOnly
            value={product.averageRating}
            itemStyles={{
              itemShapes: Star,
              activeFillColor: '#ffb700',
              inactiveFillColor: '#fbf1a9'
            }}
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
    </div>
  );
};

export default ProductItem;
