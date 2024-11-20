import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import {
  LocalShipping,
  Payment,
  DateRange,
  Info,
  Home,
  TrackChanges,
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  PersonOutline,
} from "@mui/icons-material";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { formatPrice } from "../../components/format/formats";
import { FaBarcode } from "react-icons/fa";
import DashboardOrderDetailsDrawer from "../../components/drawer/DashboardOrderDetailsDrawer";

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const varToken = useAuthHeader();
  const authUser = useAuthUser();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = () => {
    apiClient
      .get("/api/orders", {
        headers: { Authorization: varToken },
        params: { page: currentPage - 1, size: 10 },
      })
      .then((response) => {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleReview = (orderId, isApproved) => {
    apiClient
      .put(
        `/api/orders/${orderId}/staff-review`,
        {
          isApproved: isApproved,
          staffName: authUser.username,
        },
        {
          headers: { Authorization: varToken },
        }
      )
      .then((response) => {
        console.log("Review submitted:", response.data.message);
        fetchOrders();
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  const openDrawer = (orderId) => {
    setSelectedOrderId(orderId);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
  };

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

  const viewOrderDetails = (orderId) => {
    // Implement navigation to order details page
    console.log(`Viewing details for order ID: ${orderId}`);
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
                      <IconButton
                        onClick={() => openDrawer(order.orderId)}
                        color="primary"
                        aria-label="view details"
                        className="ml-2"
                      >
                        <Visibility />
                      </IconButton>
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                    >
                      <DateRange className="mr-1" /> Date:{" "}
                      {new Date(order.orderDate).toLocaleString()}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center mb-1"
                      sx={{ color: getStatusColor(order.orderStatus) }}
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
                      className="flex items-center mb-1"
                    >
                      <DateRange className="mr-1" /> Expected Delivery:{" "}
                      {new Date(
                        order.expectedDeliveryDate
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center"
                    >
                      <FaBarcode className="mr-1" />
                      Transaction Ref: {order.transactionReference || "N/A"}
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
                      <Payment className="mr-1" /> Total Amount:{" "}
                      {formatPrice(order.totalAmount)}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className="flex items-center"
                    >
                      <TrackChanges className="mr-1" /> Tracking #:{" "}
                      {order.trackingNumber}
                    </Typography>
                    <Typography
                      color="green"
                      className="flex items-center mt-1"
                    >
                      <Person className="mr-1" />
                      Customer: {order.customerUsername}
                    </Typography>
                    <Typography color="orange" className="flex items-center">
                      <PersonOutline className="mr-1" />
                      Staff: {order.staffUsername || "N/A"}
                    </Typography>
                  </Grid>

                  {order.orderStatus === "PROCESSING" && (
                    <Grid item xs={12}>
                      <Typography variant="h6" className="mt-2">
                        Confirm Order:
                      </Typography>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleReview(order.orderId, true)}
                          startIcon={<CheckCircle />}
                          size="large"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleReview(order.orderId, false)}
                          startIcon={<Cancel />}
                          size="large"
                        >
                          Reject
                        </Button>
                      </div>
                    </Grid>
                  )}
                </Grid>

                <Divider style={{ margin: "16px 0" }} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mt-2"
                >
                  Notes: {order.notes || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DashboardOrderDetailsDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        orderId={selectedOrderId}
      />

      <div className="flex justify-center items-center mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DashboardOrders;
