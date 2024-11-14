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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { apiClient } from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../format/formats";

// Hàm lấy màu trạng thái
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="p-4" style={{ width: 450 }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <Close />
        </IconButton>

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

        <Divider />

        {/* Order Details */}
        <Grid container spacing={2} className="mt-4">
          {orderDetails.orderDetails.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" className="mb-4">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <img
                        src={`path_to_images/${item.productImage}`} // Đảm bảo đường dẫn hình ảnh chính xác
                        alt={item.productName}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 8,
                        }}
                      />
                    </Grid>
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
