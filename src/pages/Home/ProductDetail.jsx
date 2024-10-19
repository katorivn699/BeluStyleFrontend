import React, { useState, useMemo, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { useCart } from "react-use-cart";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Box, Rating } from "@mui/material";

const ProductDetailPage = () => {
  const { addItem } = useCart();
  const productById = useParams();

  const product = {
    id: productById.id,
    name: "Premium T-Shirt",
    variations: {
      blue: {
        XS: {
          id: 8,
          price: 29.99,
          images: [
            "https://htmediagroup.vn/wp-content/uploads/2021/12/Ao-pijama-6-min.jpg",
          ],
        },
        S: {
          id: 9,
          price: 30.99,
          images: [
            "https://images.unsplash.com/photo-1583050157107-2fc2d242a9f7?fit=max&fm=jpg",
          ],
        },
        M: {
          id: 10,
          price: 31.99,
          images: [
            "https://images.unsplash.com/photo-1603020340937-8f8f9d9b66b0",
          ],
        },
        L: {
          id: 1,
          price: 32.99,
          images: [
            "https://images.unsplash.com/photo-1599333711355-96f5d5c92c61",
          ],
        },
        XL: {
          id: 2,
          price: 33.99,
          images: [
            "https://images.unsplash.com/photo-1601018008784-c1b98c6f8f8a",
          ],
        },
      },
      red: {
        XS: {
          id: 3,
          price: 32.99,
          images: ["https://images.unsplash.com/photo-1574853516184"],
        },
        S: {
          id: 4,
          price: 33.99,
          images: ["https://images.unsplash.com/photo-1605917566783"],
        },
        M: {
          id: 5,
          price: 34.99,
          images: ["https://images.unsplash.com/photo-1547686835-92d16c272084"],
        },
        L: {
          id: 6,
          price: 35.99,
          images: ["https://images.unsplash.com/photo-1571064844052"],
        },
        XL: {
          id: 7,
          price: 36.99,
          images: ["https://images.unsplash.com/photo-1599985095489"],
        },
      },
    },
    colors: ["blue", "red"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "This premium T-shirt is made from high-quality cotton, offering a perfect fit and comfort. Designed for everyday wear and easy to pair with various outfits.",
      avgRating: 4.5,
      totalRating: 100,
    reviews: [
      {
        user: "John Doe",
        rating: 5,
        comment: "Amazing product, great quality!",
      },
      {
        user: "Jane Smith",
        rating: 4,
        comment: "Very comfortable and fits well.",
      },
    ],
  };

  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedSize, setSelectedSize] = useState("XS");
  const [quantity, setQuantity] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [activeTab, setActiveTab] = useState(0); // State to handle active tab

  const { allImages, imageStartIndex } = useMemo(() => {
    const images = [];
    const startIndex = {};

    let imageCounter = 0;

    product.colors.forEach((color) => {
      const variations = product.variations[color];
      Object.keys(variations).forEach((size) => {
        variations[size].images.forEach((image) => {
          images.push({ color, image });
        });
      });
      startIndex[color] = imageCounter;
      imageCounter = images.length;
    });

    return { allImages: images, imageStartIndex: startIndex };
  }, [product.colors, product.variations]);

  const handleIncrement = () => setQuantity((prev) => Math.min(99, prev + 1));
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const selectedVariation = product.variations[selectedColor][selectedSize];
    const ChoosedVariation = `${productById.id}-${selectedVariation.id}`;

    const cartItem = {
      id: ChoosedVariation,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      image: selectedVariation.images[0],
      price: selectedVariation.price,
    };

    addItem(cartItem, quantity);
  };

  useEffect(() => {
    setCarouselIndex(imageStartIndex[selectedColor] || 0);
  }, [selectedColor, imageStartIndex]);

  return (
    <div className="ProductDetail">
      <div className="headerBreadcums h-32 bg-blueOcean"></div>
      <div className="grid grid-cols-5 gap-6 px-20 py-10">
        <div className="col-span-3">
          {product.variations[selectedColor] &&
          product.variations[selectedColor][selectedSize] &&
          product.variations[selectedColor][selectedSize].images ? (
            <Carousel
              autoPlay={true}
              navButtonsAlwaysVisible
              index={carouselIndex}
            >
              {allImages.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: "auto",
                    height: "400px",
                    display: "flex",
                    justifyContent: "center", // căn giữa theo chiều ngang
                    alignItems: "center", // căn giữa theo chiều dọc
                    backgroundColor: "#f0f0f0", // thêm màu nền để dễ thấy khung
                  }}
                >
                  <img
                    src={item.image}
                    alt={`Product in ${item.color}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400";
                    }}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="text-center">
              <p>No images available for the selected color and size.</p>
            </div>
          )}
        </div>

        <div className="properties pl-10 col-span-2">
          <h1 className="mb-4 font-bold text-5xl">{product.name}</h1>
          <p className="mb-4 text-xl font-semibold text-gray-700">
            ${product.variations[selectedColor][selectedSize].price.toFixed(2)}
          </p>
          <div className="rating mb-4 flex items-center text-gray-500">
            <Rating
              readOnly
              value={product.avgRating}
            />
            <div className="px-4">|</div>
            <div className="customerReview text-xl">{product.totalRating} Customer Reviews</div>
          </div>

          {/* Color Selector */}
          <div className="colors flex items-center mb-4">
            <div className="font-semibold text-gray-600">Color:</div>
            <div className="ml-4 flex gap-2">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`cursor-pointer w-8 h-8 border border-gray-300 rounded-full ${
                    selectedColor === color ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="sizes mb-4">
            <div className="font-semibold text-gray-600">Size:</div>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <div
                  key={size}
                  className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg ${
                    selectedSize === size ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector with +/- buttons */}
          <div className="quantity mb-4">
            <div className="font-semibold text-gray-600 mb-2">Quantity:</div>
            <div className="flex items-center">
              <button
                className="px-3 py-1 bg-gray-300 text-black rounded-l-lg"
                onClick={handleDecrement}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={quantity}
                readOnly
                className="px-4 py-1 border-t border-b border-gray-300 text-center"
              />
              <button
                className="px-3 py-1 bg-gray-300 text-black rounded-r-lg"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-4"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Tabs for Description and Reviews */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        aria-label="Product details"
      >
        <Tab label="Description" />
        <Tab label="Reviews" />
      </Tabs>
      <Box p={3}>
        {activeTab === 0 && <div>{product.description}</div>}
        {activeTab === 1 && (
          <div>
            {product.reviews.map((review, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">{review.user}</h4>
                <Rating
                  readOnly
                  style={{
                    width: 100,
                  }}
                  value={review.rating}
                />
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
};

export default ProductDetailPage;
