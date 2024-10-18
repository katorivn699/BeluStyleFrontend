import React, { useEffect, useRef } from "react";
import { useCart } from "react-use-cart"; // Import from react-use-cart
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const CartDrawer = ({ isCartOpen, toggleCartDrawer }) => {
  const drawerRef = useRef(null); // Reference for the drawer
  const { isEmpty, items, removeItem, emptyCart, cartTotal } = useCart(); // Get cart hooks and functions from react-use-cart

  // Function to handle click outside to close the drawer
  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleCartDrawer(false)(); // Close the drawer when clicked outside
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => toggleCartDrawer(false)}
      sx={{
        width: "500px", 
        padding: "20px",
      }}
    >
      <div ref={drawerRef} className="p-4">
        <Typography variant="h5" className="font-bold" gutterBottom>
          Shopping Cart
        </Typography>

        {isEmpty ? (
          <Typography variant="body1">Giỏ hàng của bạn đang trống.</Typography>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem
                key={`${item.id}-${item.variationId}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                {/* Product Image */}
                <img
                  src={item.image} // Assuming item has an image property
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
                <Box>
                  {/* Product Name */}
                  <Typography variant="body1" color="text.primary">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.color} - {item.size}
                  </Typography>
                  {/* Quantity and Price */}
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} x {item.price}$
                  </Typography>
                </Box>

                {/* Remove Item Button */}
                <Button
                  onClick={() => removeItem(item.id)}
                  size="small"
                  color="secondary"
                  sx={{ marginLeft: "auto" }}
                >
                  <Typography variant="body2">Xóa</Typography>
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Subtotal and Checkout */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" color="text.primary" fontWeight="bold">
            Subtotal
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            {cartTotal}$
          </Typography>
        </Box>

        {/* Checkout Buttons */}
        <Box display="flex" justifyContent="space-between" marginTop="16px">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => emptyCart()}
            fullWidth
            sx={{ marginRight: "8px" }}
          >
            Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("Chuyển tới trang thanh toán")}
            fullWidth
          >
            Checkout
          </Button>
        </Box>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
