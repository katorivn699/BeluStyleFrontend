import React, { useState, useMemo, useEffect, useRef } from "react";
import Carousel from "react-material-ui-carousel";
import { useCart } from "react-use-cart";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { Tabs, Tab, Box, Rating, Skeleton, Breadcrumbs } from "@mui/material";
import { formatPrice } from "../../components/format/formats";
import { getProductItem } from "../../service/ShopService";
import { useProduct } from "../../components/Providers/Product";
import ProductRecommend from "../../components/items/ProductRecommend";
import ReviewStars from "../../components/reviewStars/ReviewStars";

const ProductDetailPage = () => {
  const { items, addItem } = useCart();
  const productById = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [cartCheck, setCartCheck] = useState(true);
  const { products } = useProduct();
  const prevColorRef = useRef(selectedColor);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductItem(productById);
        setProduct(data);
        if (data.colors && data.colors.length > 0)
          setSelectedColor(data.colors[0].colorName);
        if (data.sizes && data.sizes.length > 0)
          setSelectedSize(data.sizes[0].sizeName);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        return <Navigate to={"/"} />;
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productById]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];

    const otherProducts = products.filter(
      (item) => item.productId !== product.productId
    );

    return otherProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [products, product]);

  const { allImages, imageStartIndex } = useMemo(() => {
    if (!product) return { allImages: [], imageStartIndex: {} };

    const images = [];
    const startIndex = {};
    let imageCounter = 0;

    // Function to get the last part of the URL (filename)
    const getImagePath = (url) => {
      try {
        const urlObj = new URL(url, window.location.origin); 
        return urlObj.pathname.split('/').pop(); 
      } catch (error) {
        console.warn("Invalid URL:", url, "Error:", error);
        return url.split('/').pop(); 
      }
    };

    (product.colors || []).forEach((color) => {
      const colorName = color?.colorName;
      const variations = product.variations?.[colorName] || {};

      if (colorName && variations) {
        Object.keys(variations).forEach((size) => {
          const image = variations[size]?.images;

          // Ensure images for each color are unique by checking the filename
          if (image && !images.some((img) => getImagePath(img.image) === getImagePath(image) && img.colorName === colorName)) {
            images.push({ colorName, image });
            imageCounter++;
          }
        });
      }

      // Track the start index of images for each color
      startIndex[colorName] = imageCounter;
    });

    return { allImages: images, imageStartIndex: startIndex };
  }, [product]);

  useEffect(() => {
    // When changing color, ensure the new color has available sizes
    if (product && selectedColor) {
      const availableSizeForNewColor =
        product.variations[selectedColor] &&
        Object.keys(product.variations[selectedColor]).length > 0;

      if (!availableSizeForNewColor) {
        // If no available sizes for the selected color, fall back to the first available color with sizes
        const newColor = Object.keys(product.colors).find((colorName) => {
          return Object.keys(product.variations[colorName] || {}).length > 0;
        });

        if (newColor) {
          setSelectedColor(newColor);
          setSelectedSize(Object.keys(product.variations[newColor])[0]); // select the first size available
        }
      } else {
        // If the new color has available sizes, adjust the quantity
        const newMaxQuantity =
          product.variations[selectedColor][selectedSize]?.quantity || 1;
        if (newMaxQuantity < quantity) {
          setQuantity(newMaxQuantity); // If the new variation's quantity is less than the current quantity, adjust it
        } else {
          setQuantity(Math.min(newMaxQuantity, quantity)); // Keep the quantity if it's within the limit
        }
      }
    }
  }, [selectedColor, selectedSize, product, quantity]);

  const startDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    const id = setInterval(() => {
      setQuantity((prev) => Math.max(1, prev - 1));
    }, 100);
    setIntervalId(id);
  };

  const startIncrement = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
    const id = setInterval(() => {
      setQuantity((prev) => Math.min(maxQuantity, prev + 1));
    }, 100);
    setIntervalId(id);
  };

  const stopInterval = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };
  const selectedVariation =
    product?.variations?.[selectedColor]?.[selectedSize] || null;

  const maxQuantity = selectedVariation?.quantity || 1;
  const CalculateFinalPrice = () => {
    if (!product || !selectedVariation) return 0;

    if (
      !product.saleType ||
      product.saleValue === null ||
      product.saleValue === undefined
    ) {
      return selectedVariation.price;
    }

    if (product.saleType === "PERCENTAGE") {
      return (
        selectedVariation.price -
        (selectedVariation.price * product.saleValue) / 100
      );
    }

    if (product.saleType === "FIXED") {
      return selectedVariation.price - product.saleValue;
    }

    return selectedVariation.price;
  };

  useEffect(() => {
    if (!product || !selectedVariation) return; // Add a check to ensure product and selectedVariation are not null

    // Check if product is available and if variation is selected
    const existingItem = items.find(
      (item) => item.id === `${product?.productId}@${selectedVariation?.id}`
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > selectedVariation?.quantity) {
        setCartCheck(false); // Item quantity exceeds available variation
      } else {
        setCartCheck(true); // Valid quantity, allow adding to cart
      }
    } else {
      setCartCheck(true); // If the item doesn't exist in the cart, it's always valid
    }
  }, [quantity, selectedVariation, items, product?.productId]); // Dependencies that will trigger the effect

  const finalPrice = CalculateFinalPrice();

  const handleAddToCart = () => {
    if (!cartCheck) return;
    const ChoosedVariation = `${product.productId}@${selectedVariation.id}`;

    const cartItem = {
      id: ChoosedVariation,
      name: product.productName,
      color: selectedColor,
      size: selectedSize,
      image: selectedVariation.images,
      price: selectedVariation.price,
      saledPrice: finalPrice,
    };

    addItem(cartItem, quantity);
  };

  useEffect(() => {
    // Update the carousel index whenever the selected color changes
    if (product && selectedColor) {
      setCarouselIndex(imageStartIndex[selectedColor] -1 || 0);
    }
  }, [selectedColor, imageStartIndex, product]);

  useEffect(() => {
    if (prevColorRef.current !== selectedColor) {
      prevColorRef.current = selectedColor; 
    }
  }, [selectedColor]);
  if (loading) {
    return (
      <div className="ProductDetail">
        <div className="headerBreadcums h-32 bg-blueOcean"></div>
        <div className="grid grid-cols-5 gap-6 px-20 py-10">
          <div className="col-span-3 place-items-center">
            <Skeleton variant="rectangular" width={600} height={400} />
          </div>
          <div className="properties pl-10 col-span-2">
            <Skeleton variant="text" width="80%" height={80} />
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={50} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ProductDetail font-poppins">
      <div className="headerBreadcums flex items-center h-32 bg-beluBlue">
        <div className="pl-16">
          <Breadcrumbs sx={{
            fontFamily: "Poppins"
          }}>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/shop"}>Shop</NavLink>
            <p>{product.productName}</p>
          </Breadcrumbs>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-4 sm:px-10 lg:px-20 py-10">
        <div className="col-span-1 lg:col-span-3 place-items-center">
          {selectedVariation?.images ? (
            <Carousel
              autoPlay={selectedColor !== null && prevColorRef.current === selectedColor}
              index={carouselIndex}
              sx={{
                width: "100%",
                maxWidth: "800px",
              }}
            >
              {allImages.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    height: "30rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <img
                    src={item.image}
                    alt={`Product in ${item.colorName}`}
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

        <div className="properties col-span-1 lg:col-span-2 pl-4 lg:pl-10">
          <h1 className="mb-4 font-bold text-2xl sm:text-3xl lg:text-5xl">
            {product.productName}
          </h1>
          <p className="mb-4 text-lg sm:text-xl font-semibold text-blue-700">
            {formatPrice(finalPrice)}
          </p>
          {product.saleValue > 0 && (
            <p className="mb-2 text-gray-500 line-through">
              {formatPrice(selectedVariation.price)}
            </p>
          )}
          <div className="rating mb-4 flex items-center text-gray-500">
            <Rating readOnly value={product.avgRating} />
            <div className="px-4">|</div>
            <div className="customerReview text-lg sm:text-xl">
              {product.totalRating} Customer Reviews
            </div>
          </div>
          {/* Color Selector */}
          <div className="colors flex items-center mb-4">
            <div className="font-semibold text-gray-600">Color:</div>
            <div className="px-4 flex gap-2">
              {product?.colors?.map((color) => (
                <div
                  key={color.colorId}
                  className={`cursor-pointer w-8 h-8 border border-gray-300 rounded-full ${
                    selectedColor === color.colorName
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  onClick={() => {
                    const availableSizeForNewColor =
                      product.variations[color.colorName] &&
                      Object.keys(product.variations[color.colorName]).length >
                        0;
                    if (availableSizeForNewColor) {
                      setSelectedColor(color.colorName);
                      setSelectedSize(
                        Object.keys(product.variations[color.colorName])[0]
                      );
                    }
                  }}
                />
              ))}
            </div>
          </div>
          {/* Size Selector */}
          <div className="sizes flex items-center mb-4">
            <div className="font-semibold text-gray-600">Size:</div>
            <div className="flex gap-2 flex-row px-5">
              {product?.sizes?.map((size) => {
                const isSizeAvailable =
                  product?.variations?.[selectedColor]?.[size.sizeName];
                return (
                  <div
                    key={size.sizeId}
                    className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg ${
                      selectedSize === size.sizeName
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      isSizeAvailable && setSelectedSize(size.sizeName)
                    }
                    style={{ opacity: isSizeAvailable ? 1 : 0.5 }}
                  >
                    {size.sizeName}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="quantity mb-6">
            <div className="font-semibold text-gray-700 mb-2">Quantity:</div>
            <div className="flex items-center">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition-colors focus:outline-none shadow-sm"
                onMouseDown={startDecrement}
                onMouseUp={stopInterval}
                onMouseLeave={stopInterval}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  let newValue = parseInt(e.target.value, 10);
                  if (isNaN(newValue)) return;
                  if (newValue >= 1 && newValue <= maxQuantity) {
                    setQuantity(newValue);
                  }
                }}
                className="w-24 px-4 py-2 text-center border border-gray-300 outline-none focus:border-indigo-400 transition-colors shadow-inner rounded-none"
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors focus:outline-none shadow-sm"
                onMouseDown={startIncrement}
                onMouseUp={stopInterval}
                onMouseLeave={stopInterval}
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
              <p className="ml-4 text-sm text-gray-500">
                {selectedVariation?.quantity || 0} pieces available
              </p>
            </div>
          </div>

          <button
            className={`${
              cartCheck && quantity <= selectedVariation?.quantity
                ? "bg-blue-500"
                : "bg-gray-300"
            } text-white px-4 py-2 rounded-lg w-full mt-4`}
            onClick={handleAddToCart}
            disabled={!cartCheck || quantity > selectedVariation?.quantity} // Disable button if quantity is invalid
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Tabs for Description and Reviews */}
      <div className="desAndRe px-4 sm:px-10">
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          centered
          aria-label="Product details"
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{
            "& .MuiTabs-indicator": {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
            "& .MuiTabs-indicatorSpan": {
              maxWidth: 60,
              width: "100%",
              backgroundColor: "#635ee7",
            },
          }}
        >
          <Tab
            label="Description"
            sx={{
              textTransform: "capitalize",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              color: "#757575",
              "&.Mui-selected": {
                color: "#177CD8", // Color for selected tab text
              },
              "&:hover": {
                color: "#177CD8", // Hover color for tab text
                backgroundColor: "#f0f0f0", // Light background on hover
              },
            }}
          />
          <Tab
            label="Reviews"
            sx={{
              textTransform: "capitalize",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              color: "#757575",
              "&.Mui-selected": {
                color: "#177CD8", // Color for selected tab text
              },
              "&:hover": {
                color: "#177CD8",
                backgroundColor: "#f0f0f0",
              },
            }}
          />
        </Tabs>
        <Box p={3}>
          {activeTab === 0 && (
            <div className="h-[400px]">{product.description}</div>
          )}
          {activeTab === 1 && (
            <div className="h-[400px]">
              {product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-semibold">{review.fullName}</h4>
                    <ReviewStars rating={review.reviewRating} />
                    <p>{review.reviewComment}</p>
                  </div>
                ))
              ) : (
                <h1>No reviews available!</h1>
              )}
            </div>
          )}
        </Box>
        <div className="recommended-products mt-10">
          <h2 className="text-3xl font-semibold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 py-5">
            {recommendedProducts.map((item) => (
              <ProductRecommend product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
