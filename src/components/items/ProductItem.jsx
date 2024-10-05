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
    <div>
      <Link to={`/products/${product.productId}`} className="block">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white group relative">
          <img
            className="w-full h-64 object-cover"
            src={product.productImage}
            alt={product.productName}
          />

          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900">
              {product.productName}
            </h3>
            <p className="text-blue-600 font-semibold text-base mb-2">
              ${discountedPrice.toFixed(2) < 0 ? 0 : discountedPrice.toFixed(2)} {/* Giá sau khi giảm giá */}
            </p>
            {product.saleValue > 0 && (
              <p className="text-red-600 font-semibold text-base mb-2 line-through">
                ${product.productPrice.toFixed(2)} {/* Giá gốc */}
              </p>
            )}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
              <Rating style={{ maxWidth: 100 }} readOnly value={product.averageRating} itemStyles={{ itemShapes: Star, activeFillColor: '#ffb700', inactiveFillColor: '#fbf1a9' }} />
                <span className="ml-2 text-gray-600">
                  ({product.totalRating})
                </span>
              </div>
            </div>
            <div className="sale">
            {product.saleValue > 0 && (
              <div className="mt-2 bg-red-400 p-2 rounded text-center">
                {product.saleType === "percentage"
                  ? `Giảm ${product.saleValue}%`
                  : `Giảm $${product.saleValue.toFixed(2)}`}
              </div>
            )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
