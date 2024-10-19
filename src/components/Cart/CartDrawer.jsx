import React, { useEffect, useRef } from "react";
import { useCart } from "react-use-cart"; // Import from react-use-cart
import {
  Drawer,
  List,
  ListItem,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Drawerbtn } from "../buttons/Button";

const CartDrawer = ({ isCartOpen, toggleCartDrawer }) => {
  const drawerRef = useRef(null); 
  const { isEmpty, items, removeItem, emptyCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleCartDrawer(false)(); 
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

  const handleClickCart = () => {
    toggleCartDrawer(false)();
    navigate("/cart");
  }

  const handleClickCheckout = () => {
    toggleCartDrawer(false)();
    navigate("/checkout")
  }

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      role="presentation"
      onClose={() => toggleCartDrawer(false)}
      PaperProps={{
        sx: { width: "25%",
        padding: "15px"
        }
      }}
    >
      <div ref={drawerRef} className="p-10">
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
            {cartTotal.toFixed(2)}$
          </Typography>
        </Box>

        {/* Checkout Buttons */}
        <Box display="flex" justifyContent="space-between" marginTop="16px" sx={{
          gap: "16px"
        }}>
          <Drawerbtn context={"Cart"} handleClick={handleClickCart}/>
          <Drawerbtn context={"Checkout"} handleClick={handleClickCheckout} isEmpty={isEmpty}/>
        </Box>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
