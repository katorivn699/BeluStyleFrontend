import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import {
  LocalShipping,
  Payment,
  DateRange,
  Info,
  Home,
  TrackChanges,
} from "@mui/icons-material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const varToken = useAuthHeader();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = () => {
    apiClient
      .get("/api/orders", {
        headers: { Authorization: varToken },
        params: { page, size: 10 },
      })
      .then((response) => {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Typography variant="h4" className="text-4xl font-bold mb-4">
        Orders
      </Typography>
      <Grid container spacing={4}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.orderId}>
            <Card
              variant="outlined"
              className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" className="font-semibold mb-2">
                      <Info className="mr-2" /> Order ID: {order.orderId}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <DateRange className="mr-1" /> Date:{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center"
                    >
                      <TrackChanges className="mr-1" /> Status:{" "}
                      {order.orderStatus}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <Home className="mr-1" /> Billing Address:{" "}
                      {order.billingAddress}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <LocalShipping className="mr-1" /> Shipping Method:{" "}
                      {order.shippingMethod}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center"
                    >
                      <DateRange className="mr-1" /> Expected Delivery:{" "}
                      {new Date(
                        order.expectedDeliveryDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <Payment className="mr-1" /> Payment Method:{" "}
                      {order.paymentMethod}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <Payment className="mr-1" /> Total Amount: $
                      {order.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center"
                    >
                      <TrackChanges className="mr-1" /> Tracking #:{" "}
                      {order.trackingNumber}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider style={{ margin: "16px 0" }} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mt-2"
                >
                  Notes: {order.notes || "N/A"}
                </Typography>

                <Typography variant="h6" className="mt-4">
                  Order Details:
                </Typography>
                {order.orderDetails.map((detail) => (
                  <Typography key={detail.orderDetailId} color="textSecondary">
                    - Item {detail.variationId}, Quantity:{" "}
                    {detail.orderQuantity}, Unit Price: $
                    {detail.unitPrice.toFixed(2)}, Discount: $
                    {detail.discountAmount.toFixed(2)}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="flex justify-center mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Typography className="mx-4">
          Page {page + 1} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DashboardOrders;
