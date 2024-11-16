import React, { useState, useEffect } from "react";
import {
  Drawer,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../format/formats";
import { FaStar, FaRegStar } from "react-icons/fa";

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "orange";
    case "PROCESSING":
      return "purple";
    case "COMPLETED":
      return "green";
    case "SHIPPED":
      return "blue";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

// Component
const DashboardOrderDetailsDrawer = ({ open, onClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const varToken = useAuthHeader();

  useEffect(() => {
    if (orderId && open) {
      fetchOrderDetails();
    }
  }, [orderId, open]);

  const fetchOrderDetails = () => {
    apiClient
      .get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setOrderDetails(response.data);
      })
      .catch((error) => console.error("Error fetching order details:", error));
  };

  if (!orderDetails) {
    return null;
  }

  const getStarColor = (rating) => {
    switch (rating) {
      case 5:
        return "#4CAF50";
      case 4:
        return "#2196F3";
      case 3:
        return "#FFC107";
      case 2:
        return "#FF5722";
      default:
        return "#F44336";
    }
  };

  const getRatingIcon = (rating) => {
    const icons = ["😢", "😟", "😐", "😊", "😍"];
    return icons[rating - 1];
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? getStarColor(rating) : "#E0E0E0",
            marginRight: 2,
            cursor: "pointer",
            fontSize: "20px",
            transition: "transform 0.3s",
          }}
          // onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
          // onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {stars}
        <span style={{ marginLeft: 8, fontSize: "18px" }}>
          {getRatingIcon(rating)}
        </span>
      </div>
    );
  };

  return (
    <Drawer
      style={{ margin: "10px 2px" }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <div
        className="p-4"
        style={{
          width: 450,
          marginTop: "5vh",
          marginLeft: "1vw",
          marginRight: "1vw",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <Close />
        </IconButton>

        <div className="my-4">
          {/* Order Information */}
          <Typography
            variant="h5"
            className="mb-4"
            style={{ fontWeight: "bold" }}
          >
            Order ID: {orderDetails.orderId}
          </Typography>

          <Typography
            variant="h6"
            className="mb-2"
            style={{ fontWeight: "bold" }}
          >
            Total Amount: {formatPrice(orderDetails.totalAmount)}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="mb-4"
            style={{
              fontWeight: "bold",
              color: getStatusColor(orderDetails.orderStatus),
            }}
          >
            Order Status: {orderDetails.orderStatus}
          </Typography>
        </div>

        <Divider />

        {/* Order Details */}
        <Grid
          container
          spacing={2}
          className="mt-4"
          style={{ marginTop: "2vh" }}
        >
          {orderDetails.orderDetails.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" className="mb-4">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={6}>
                      <img
                        src={`path_to_images/${item.productImage}`}
                        alt={item.productName}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 8,
                        }}
                      />
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        {item.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        Color: {item.color}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        Size: {item.size}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        Quantity: {item.orderQuantity}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        Price: {formatPrice(item.unitPrice)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Discount: {formatPrice(item.discountAmount)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Reviews Section */}
                  <Divider style={{ margin: "1vh 0" }} />
                  <Typography variant="h6" style={{ marginBottom: "1vh" }}>
                    Reviews:
                  </Typography>
                  {item.reviews && item.reviews.length > 0 ? (
                    item.reviews.map((review, reviewIndex) => (
                      <Box key={reviewIndex} style={{ marginBottom: "1vh" }}>
                        <Typography
                          variant="body2"
                          style={{ fontWeight: "bold" }}
                        >
                          {review.fullName}
                        </Typography>
                        <Box style={{ display: "flex", alignItems: "center" }}>
                          {renderStars(review.reviewRating)}
                        </Box>
                        <Typography
                          variant="body2"
                          style={{ marginTop: "1vh" }}
                        >
                          {review.reviewComment}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No reviews yet for this product.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Drawer>
  );
};

export default DashboardOrderDetailsDrawer;
