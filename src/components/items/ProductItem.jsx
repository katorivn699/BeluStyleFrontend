import { Rating, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../format/formats";

const ProductItem = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  // Kiểm tra saleType và tính toán giá giảm nếu có
  let discountedPrice = product.productPrice;
  if (product.saleType === "PERCENTAGE" && product.saleValue > 0) {
    discountedPrice =
      product.productPrice - product.productPrice * (product.saleValue / 100);
  } else if (product.saleType === "FIXED_AMOUNT" && product.saleValue > 0) {
    discountedPrice = product.productPrice - product.saleValue;
  }

  // Đảm bảo giá trị price không phải null và kiểm tra số âm
  const displayPrice =
    discountedPrice && discountedPrice >= 0
      ? formatPrice(discountedPrice)
      : "0.00"; // Hiển thị 0.00 nếu giá trị không hợp lệ

  const originalPrice =
    product.productPrice && product.productPrice >= 0
      ? formatPrice(product.productPrice)
      : "0.00"; // Xử lý giá gốc

  return (
    <div className="w-full max-w-[350px] bg-base-200 rounded-lg overflow-hidden shadow-md p-4 mx-auto">
      <Link to={`/shop/product/${product.productId}`} className="block">
        {/* Product Image */}

        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={256}
            className="rounded-md"
          />
        )}
        <img
          className={`${
            imageLoaded ? "w-full h-64 object-cover rounded-md" : "hidden"
          }`}
          src={product.productVariationImage || "default_image.jpg"}
          alt={product.productName || "Product Image"}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-primary-content truncate">
            {product.productName || "Unnamed Product"}
          </h3>

          {/* Product Price */}
          <p className="text-blue-600 font-semibold text-xl mb-2">
            {displayPrice}
          </p>

          {/* Original Price if Sale is Active */}
          {product.saleValue > 0 && (
            <p className="text-red-500 font-semibold text-sm line-through mb-1">
              {formatPrice(originalPrice)}
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
              ({product.totalRatings || 0}){" "}
              {/* Handle null or undefined ratings */}
            </span>
          </div>

          {/* Sale badge if sale is active */}
          {product.saleValue > 0 && (
            <div className="mt-2 bg-red-100 text-red-700 text-sm font-bold py-1 px-2 rounded text-center">
              {product.saleType === "PERCENTAGE"
                ? `Giảm ${product.saleValue}%`
                : `Giảm ${formatPrice(product.saleValue)}`}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
