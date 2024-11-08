import React, { useState } from "react";
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
    case "SHIPPED":
      statusText = "Shipped";
      statusColor = "text-green-500"; // Or a suitable green
      break;
    case "DELIVERED":
      statusText = "Delivered";
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
      className={`ml-2 flex justify-end font-semibold ${statusColor}`}
    >
      {statusText}
    </Typography>
  );
}

function OrderItemCard({ Order }) {
  return (
    <Card variant="outlined" className="max-w-[800px] font-poppins p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <Typography
            variant="subtitle1"
            className="ml-2 flex-grow font-semibold"
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
          <div className="col-span-6 flex justify-start items-center">
            <Typography variant="body1" className="font-bold mr-2">
              Total: {formatPrice(Order.totalAmount)}
            </Typography>
          </div>

          <div className="col-span-6 flex justify-end items-center">
            <Typography>
              <Link to={`/user/orders/${Order.orderId}`}>
                <Button variant="contained" color="primary">
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
            width="80"
            height="80"
            image={item.productImage}
            alt={item.productName}
            onError={() => setImageLoaded(false)}
            className="mr-2"
          />
        ) : (
          <Skeleton variant="rectangular" width={110} height={110} />
        )}
      </div>
      <div className="col-span-10 ml-2 grid grid-cols-2 gap-4">
        {/* Product Details Section: Align to the left */}
        <div className="flex flex-col justify-start">
          <Typography variant="body1" className="font-bold">
            {item.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">
            Color: {item.color}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">
            Size: {item.size}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">
            x{item.orderQuantity}
          </Typography>
        </div>

        <div className="flex flex-col justify-end text-right">
          {/* If there's a discount, show the original price with a strikethrough and the final price */}
          <Typography
            variant="body2"
            color="text.primary"
            className="font-bold"
          >
            Price:
            {item.discountAmount > 0 ? (
              <>
                {/* Original Price with Strikethrough */}
                <span className="text-red-500 line-through mr-2">
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
            <Typography variant="body2" color="text.secondary" className="mt-1">
              Discount: {formatPrice(item.discountAmount)}
            </Typography>
          )}

          {/* Display final price regardless of discount */}
          <Typography
            variant="body2"
            color="text.primary"
            className="font-bold mt-1"
          >
            Final Price: {formatPrice(item.unitPrice - item.discountAmount)}
          </Typography>
        </div>
      </div>
    </>
  );
}

export default OrderItemCard;
