import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Divider,
  Skeleton,
  Button,
} from "@mui/material";
import { formatPrice } from "../../components/format/formats";
import { Link } from "react-router-dom";

function OrderStatus({ status }) {
  let statusText = "";
  let statusColor = "";

  switch (status) {
    case "PENDING":
      statusText = "Pending";
      statusColor = "text-yellow-500"; // Or use a suitable yellow color
      break;
    case "PROCESSING":
      statusText = "Processing";
      statusColor = "text-blue-500"; // Or a suitable blue
      break;
    case "COMPLETED":
      statusText = "Completed";
      statusColor = "text-green-500"; // Or a suitable green
      break;
    case "PAID":
      statusText = "Paid";
      statusColor = "text-green-700"; // A darker green
      break;
    case "CANCELLED":
      statusText = "Cancelled";
      statusColor = "text-red-500";
      break;
    default:
      statusText = "Unknown";
      statusColor = "text-gray-500";
  }

  return (
    <Typography
      variant="subtitle2"
      className={`ml-2 flex font-montserrat justify-end font-semibold ${statusColor}`}
    >
      {statusText}
    </Typography>
  );
}

function OrderItemCard({ Order, loading }) {
  if (loading) {
    return (
      <Card variant="outlined" className="max-w-[800px] font-poppins p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="40%" />
          </div>

          <div className="grid grid-cols-12 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="col-span-12 sm:col-span-4">
                <Skeleton variant="rectangular" width="100%" height={120} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </div>
            ))}
          </div>

          <Divider />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 flex justify-start items-center">
              <Skeleton variant="text" width="40%" />
            </div>

            <div className="col-span-6 flex justify-end items-center">
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className="max-w-[800px] font-poppins p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <Typography
            variant="subtitle1"
            className="ml-2 flex-grow font-semibold font-montserrat"
          >
            Order: {Order.orderId}
          </Typography>
          <OrderStatus status={Order.orderStatus} />
        </div>

        <div className="grid grid-cols-12 gap-4">
          {Order.orderDetails.map((item) => (
            <ProductDetail key={item.productName} item={item} />
          ))}
        </div>

        <Divider />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 flex justify-start items-center font-montserrat">
            <Typography
              variant="body1"
              className="font-bold mr-2"
              fontFamily="Montserrat"
            >
              Total: {formatPrice(Order.totalAmount)}
            </Typography>
          </div>

          <div className="col-span-6 flex justify-end items-center">
            <Typography>
              <Link to={`/user/orders/${Order.orderId}`}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    fontFamily: "Montserrat",
                    borderRadius: "30px",
                  }}
                >
                  View Order
                </Button>
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProductDetail({ item }) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <>
      <div className="col-span-2">
        {imageLoaded ? (
          <CardMedia
            component="img"
            image={item.productImage}
            alt={item.productName}
            onError={() => setImageLoaded(false)}
            sx={{
              width: 110, 
              height: 110, 
              objectFit: "cover", 
              marginRight: 2, 
            }}
          />
        ) : (
          <Skeleton variant="rectangular" width={110} height={110} />
        )}
      </div>
      <div className="col-span-10 ml-2 grid grid-cols-2 gap-4">
        {/* Product Details Section: Align to the left */}
        <div className="flex flex-col justify-start">
          <Typography
            variant="body1"
            fontFamily="Montserrat"
            className="font-bold"
          >
            {item.productName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily="Montserrat"
            className="mt-1"
          >
            Color: {item.color}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily="Montserrat"
            className="mt-1"
          >
            Size: {item.size}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily="Montserrat"
            className="mt-1"
          >
            x{item.orderQuantity}
          </Typography>
        </div>

        <div className="flex flex-col justify-end text-right">
          {/* If there's a discount, show the original price with a strikethrough and the final price */}
          <Typography
            variant="body2"
            color="text.primary"
            className="font-bold"
            fontFamily="Montserrat"
          >
            Price:
            {item.discountAmount > 0 ? (
              <>
                {/* Original Price with Strikethrough */}
                <span className="text-red-500 line-through font-montserrat mr-2 ml-1">
                  {formatPrice(item.unitPrice)}
                </span>
                {/* Discounted Price */}
                {formatPrice(item.unitPrice - item.discountAmount)}
              </>
            ) : (
              // If no discount, just show the original price
              formatPrice(item.unitPrice)
            )}
          </Typography>

          {/* If there's a discount, show the discount amount */}
          {item.discountAmount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="Montserrat"
              className="mt-1"
            >
              Discount: {formatPrice(item.discountAmount)}
            </Typography>
          )}

          {/* Display final price regardless of discount */}
          <Typography
            variant="body2"
            color="text.primary"
            className="font-bold mt-1"
            fontFamily="Montserrat"
          >
            Final Price: {formatPrice(item.unitPrice - item.discountAmount)}
          </Typography>
        </div>
      </div>
    </>
  );
}

export default OrderItemCard;
