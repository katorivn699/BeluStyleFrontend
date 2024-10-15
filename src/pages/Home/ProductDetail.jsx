import { Rating, Star } from "@smastrom/react-rating";
import React, { useState } from "react";
// import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  // const productId = useParams();

  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const product = {
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    availability: "In Stock",
    description:
      "Experience comfort and style with our Premium Cotton T-Shirt. Made from 100% organic cotton, this shirt offers breathability and softness for all-day wear. Perfect for casual outings or layering, it's a versatile addition to any wardrobe.",
    longDescription:
      "Our Premium Cotton T-Shirt is the epitome of comfort and style. Crafted from 100% organic cotton, this shirt offers unparalleled breathability and softness, ensuring you stay comfortable throughout the day. The fabric is pre-shrunk to maintain its perfect fit wash after wash. With reinforced seams and a tailored cut, this T-shirt offers both durability and a flattering silhouette. Available in a range of colors and sizes, it's the perfect versatile piece for casual outings, layering, or even as a comfortable base for your work attire. The ethical production process ensures that you're not only investing in quality but also supporting sustainable fashion practices. Elevate your basics with this must-have Premium Cotton T-Shirt.",
    rating: 4.5,
    reviewCount: 128,
    colors: ["blue", "red", "green", "black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: {
      blue: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      ],
      red: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      ],
      green: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      ],
      black: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      ],
    },
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Great quality and fit!" },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        comment: "Nice shirt, but runs a bit small.",
      },
      {
        id: 3,
        user: "Mike R.",
        rating: 5,
        comment: "Excellent product, will buy again!",
      },
    ],
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="ProductDetail">
      <div className="headerBreadcums h-32 bg-blueOcean"></div>
      <div className="grid grid-cols-5 px-20 py-10">
        <div className="caroselImage col-span-3">
          <div class="carousel w-full h-1/2">
            <div id="slide1" class="carousel-item relative w-full">
              <img
                src="https://bizweb.dktcdn.net/thumb/large/100/315/239/products/z5616001785640-385dfc08de280dd31e02df6fa93c7023-1720509041933.jpg"
                class="w-full"
              />
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" class="btn btn-circle">
                  ❮
                </a>
                <a href="#slide2" class="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide2" class="carousel-item relative w-full">
              <img
                src="https://cdn.boo.vn/media/catalog/product/1/_/1.2.02.3.18.002.123.23-10200011-bst-1.jpg"
                class="w-full"
              />
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" class="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" class="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide3" class="carousel-item relative w-full">
              <img
                src="https://cdn.boo.vn/media/catalog/product/1/_/1.2.02.3.21.002.223.23.10200011_2__5.jpg"
                class="w-full"
              />
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" class="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" class="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide4" class="carousel-item relative w-full">
              <img
                src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
                class="w-full"
              />
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide3" class="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" class="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="properties pl-10 col-span-2">
          <h1 className="mb-4 font-poppins text-5xl">Tên sản phẩm</h1>{" "}
          {/* Add bottom margin */}
          <p className="mb-4 font-poppins text-gray-500 text-xl">Giá</p>{" "}
          {/* Add bottom margin */}
          <div className="rating mb-4 flex items-center text-gray-500">
            {" "}
            {/* Add bottom margin */}
            <Rating
              style={{ maxWidth: 150 }}
              readOnly
              value={product.averageRating}
              itemStyles={{
                itemShapes: Star,
                activeFillColor: "#ffb700",
                inactiveFillColor: "#fbf1a9",
              }}
            />{" "}
            <div className="px-4">|</div>{" "}
            <div className="customerReview text-xl">
              {product.reviewCount} Customer Review
            </div>
          </div>
          <div className="size">
            <h2 className="text-lg font-semibold mb-2">Size</h2>{" "}
            {/* Add margin-bottom */}
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="color mb-6">
            {" "}
            {/* Add margin-bottom to space out from previous section */}
            <h2 className="text-lg font-semibold mb-2">Color</h2>{" "}
            {/* Add margin-bottom */}
            <div className="flex space-x-5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedColor === color
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color} color`}
                ></button>
              ))}
            </div>
          </div>
          <div className="ActionButton space-x-7">
            <div className="QuantityChooser">
              <button
                onClick={decreaseQuantity}
                className="btn rounded-sm btn-sm"
              >
                -
              </button>

              <input
                type="text"
                value={quantity}
                readOnly
                className="input input-sm w-16 text-center"
              />

              <button
                onClick={increaseQuantity}
                className="btn btn-sm rounded-sm"
              >
                +
              </button>
            </div>
            <div className="btn rounded-lg border border-black px-12">
              Add To Cart
            </div>
            <div className="btn rounded-lg border border-black px-12">
              Share
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
