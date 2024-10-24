import { Rating } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  // Kiểm tra saleType và tính toán giá giảm nếu có
  let discountedPrice = product.productPrice;
  if (product.saleType === "PERCENTAGE" && product.saleValue > 0) {
    discountedPrice =
      product.productPrice - product.productPrice * (product.saleValue / 100);
  } else if (product.saleType === "FIXED_AMOUNT" && product.saleValue > 0) {
    discountedPrice = product.productPrice - product.saleValue;
  }

  // Đảm bảo giá trị price không phải null và kiểm tra số âm
  const displayPrice = (discountedPrice && discountedPrice >= 0)
    ? discountedPrice.toFixed(2)
    : "0.00"; // Hiển thị 0.00 nếu giá trị không hợp lệ

  const originalPrice = (product.productPrice && product.productPrice >= 0)
    ? product.productPrice.toFixed(2)
    : "0.00"; // Xử lý giá gốc

  return (
    <div className="w-full max-w-[350px] bg-base-200 rounded-lg overflow-hidden shadow-md p-4 mx-auto">
      <Link to={`/shop/product/${product.productId}`} className="block">
        {/* Product Image */}
        <img
          className="w-full h-64 object-cover rounded-md" // Make the image responsive
          src={product.productVariationImage || "default_image.jpg"} // Handle missing image
          loading="lazy"
          alt={product.productName || "Product Image"}
        />

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-primary-content truncate">
            {product.productName || "Unnamed Product"}
          </h3>

          {/* Product Price */}
          <p className="text-blue-600 font-semibold text-xl mb-2">
            ${displayPrice}
          </p>

          {/* Original Price if Sale is Active */}
          {product.saleValue > 0 && (
            <p className="text-red-500 font-semibold text-sm line-through mb-1">
              ${originalPrice}
            </p>
          )}

          <div className="flex items-center">
            <Rating
              name="half-rating-read"
              value={product.averageRating || 0} // Handle null or undefined rating
              precision={0.5}
              readOnly
            />
            <span className="ml-2 text-gray-600 text-sm">
              ({product.totalRatings || 0}) {/* Handle null or undefined ratings */}
            </span>
          </div>

          {/* Sale badge if sale is active */}
          {product.saleValue > 0 && (
            <div className="mt-2 bg-red-100 text-red-700 text-sm font-bold py-1 px-2 rounded text-center">
              {product.saleType === "PERCENTAGE"
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
