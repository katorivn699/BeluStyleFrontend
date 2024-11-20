import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Box,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import CustomizedSteppers from "../../components/inputs/StepperCommon";
import { formatPrice } from "../../components/format/formats";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { confirmOrder, getOrderById } from "../../service/OrderSevice";
import { cancelOrder } from "../../service/CheckoutService";
import ReviewModal from "../../components/modals/Review";
import { createReview } from "../../service/ReviewService";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(""); // New state for order status
  const authHeader = useAuthHeader();
  const [openReviewModal, setOpenReviewModal] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product to review
  const [selectedProductDetails, setSelectedProductDetails] = useState(null); // Store selected product details

  const handleClickBack = () => {
    navigate("/user/orders");
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderById(orderId, authHeader);
        setOrder(response.data);
        setOrderStatus(response.data.orderStatus); 
      } catch (error) {
        navigate("/user/orders");
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, authHeader]);

  const handleConfirmOrder = async () => {
    try {
      await confirmOrder(orderId, authHeader);
      setOrderStatus("COMPLETED"); // Update status after confirming order
    } catch (error) {
      console.error("Error confirming order:", error);
      // Optionally handle the error here
    }
  };

  const handleRejectOrder = async () => {
    try {
      await cancelOrder(orderId, authHeader);
      setOrderStatus("CANCELLED"); // Update status after confirming order
    } catch (error) {
      console.error("Error Reject order:", error);
      // Optionally handle the error here
    }
  };

  const handleAddReview = (productId, name, image, orderDetails) => {
    setSelectedProduct(productId);
    setSelectedProductDetails(orderDetails);
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false); // Close the modal
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#8f8f8f", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress />
      </Backdrop>
    );
  }

  if (!order) {
    return <div>Error loading order details. Please try again.</div>;
  }

  const handleSubmitReview = async (productId, reviewText) => {
    console.log("Review submitted for product: ", reviewText);

    // Construct the review object
    const review = {
      productId: productId,
      reviewComment: reviewText.reviewComment,
      reviewRating: reviewText.reviewRating,
      orderDetailId: reviewText.orderDetailId,
    };

    try {
      // Await the API call
      const response = await createReview(review, authHeader);
      console.log("response return: " + response);

      if (response && response.data) {
        // Update state if API call is successful
        setOrder((prevOrder) => {
          const updatedOrderDetails = prevOrder.orderDetails.map((item) => {
            if (item.productId === productId) {
              return {
                ...item,
                reviews: [...(item.reviews || []), review], // Add the new review
              };
            }
            return item;
          });

          return {
            ...prevOrder,
            orderDetails: updatedOrderDetails, // Update the orderDetails
          };
        });

        // Close the modal after success
        setOpenReviewModal(false);
      }
    } catch (error) {
      // Handle errors gracefully
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const statusMapping = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    COMPLETED: 3,
    CANCELLED: 4,
  };

  const statusStep = statusMapping[orderStatus] || 1; // Use state value for status

  // Calculate total product prices
  const totalProductPrice = order.orderDetails.reduce((acc, item) => {
    const totalPrice =
      item.unitPrice * item.orderQuantity - item.discountAmount;
    return acc + totalPrice;
  }, 0);

  // Calculate shipping cost
  const shippingCost = order.totalAmount - totalProductPrice;

  return (
    <div className="px-5 py-5 font-poppins">
      <div className="pb-5">
        <Button
          onClick={handleClickBack}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          <FaArrowLeft className="text-2xl text-black" />
          <p className="text-black">Back to Orders</p>
        </Button>
      </div>

      <Card
        sx={{
          p: 3,
          mb: 3,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
        >
          Order Details - {order.orderId}
        </Typography>
        <Box sx={{ py: 3 }}>
          <CustomizedSteppers status={statusStep} />
        </Box>
      </Card>

      <div className="order-summary">
        {order.orderDetails.map((item, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 3,
              mb: 3,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Product Image */}
            <Box sx={{ marginRight: "20px" }}>
              <img
                src={item.productImage}
                alt={item.productName}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>

            {/* Product Details */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}
              >
                {item.productName}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Poppins",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                    Color:
                  </span>{" "}
                  {item.color}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Poppins",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                    Size:
                  </span>{" "}
                  {item.size}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, backgroundColor: "#e0e0e0" }} />

              {/* Pricing and Quantity Row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "Poppins", fontWeight: "medium" }}
                  >
                    <span style={{ fontWeight: "bold" }}>Unit Price:</span> ${" "}
                    {formatPrice(item.unitPrice)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "Poppins", fontWeight: "medium" }}
                  >
                    <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                    {item.orderQuantity}
                  </Typography>
                </Box>

                {/* Discount and Total Price */}
                <Box>
                  {item.discountAmount > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "medium",
                        color: "green",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Discount:</span> -${" "}
                      {formatPrice(item.discountAmount)}
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                      color: "#1976d2",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>Total Price:</span> ${" "}
                    {formatPrice(
                      item.unitPrice * item.orderQuantity - item.discountAmount
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Add Review Button */}
              {orderStatus === "COMPLETED" && item.reviews.length === 0 && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      handleAddReview(
                        item.productId,
                        item.productName,
                        item.productImage,
                        item
                      )
                    }
                    sx={{
                      textTransform: "none",
                      fontFamily: "Montserrat",
                      borderRadius: "30px",
                      fontWeight: "bold",
                    }}
                  >
                    Add Review
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        ))}

        {/* Order Summary */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Shipping Fee:
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
            ${formatPrice(shippingCost)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Total:
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
            ${formatPrice(order.totalAmount)}
          </Typography>
        </Box>
        {orderStatus === "SHIPPED" && (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmOrder}
              sx={{
                textTransform: "none",
                borderRadius: 30,
                fontFamily: "Poppins",
              }}
            >
              Confirm Receipt
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectOrder}
              sx={{
                textTransform: "none",
                borderRadius: 30,
                fontFamily: "Poppins",
              }}
            >
              Reject Order or Return
            </Button>
          </Box>
        )}
      </div>
      <ReviewModal
        open={openReviewModal}
        handleClose={handleCloseReviewModal}
        productId={selectedProduct}
        name={selectedProductDetails?.productName}
        image={selectedProductDetails?.productImage}
        orderDetails={selectedProductDetails?.orderDetailId}
        handleSubmitReview={handleSubmitReview}
      />
    </div>
  );
}

export default OrderDetail;
