import React, { useEffect, useRef } from "react";
import { useCart } from "react-use-cart"; // Import from react-use-cart
import { Drawer, List, ListItem, ListItemText, Button } from "@mui/material";

const CartDrawer = ({ isCartOpen, toggleCartDrawer }) => {
  const drawerRef = useRef(null); // Reference for the drawer
  const {
    isEmpty,
    items,
    removeItem,
    updateItemQuantity,
    emptyCart,
    cartTotal,
  } = useCart(); // Get cart hooks and functions from react-use-cart

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
  }, [isCartOpen]);

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => toggleCartDrawer(false)}
      sx={{ width: '400px' }}  // Increase the drawer width here
    >
      <div ref={drawerRef} className="p-4 w-[400px]"> {/* Increase width here */}
        <h2 className="font-bold text-xl">Giỏ Hàng</h2>

        {isEmpty ? (
          <p>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem key={`${item.id}-${item.variationId}`}>
                <ListItemText
                  primary={`Sản phẩm: ${item.name}`}
                  secondary={`Số lượng: ${item.quantity}, Giá: ${item.price}`}
                />
                {/* Decrease Quantity Button */}
                <Button
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  size="small"
                  color="primary"
                >
                  -
                </Button>
                {/* Increase Quantity Button */}
                <Button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  size="small"
                  color="primary"
                >
                  +
                </Button>
                {/* Remove Item Button */}
                <Button
                  onClick={() => removeItem(item.id)}
                  size="small"
                  color="secondary"
                >
                  Xóa
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        {/* Total Price */}
        <div className="pt-4">
          <p className="font-semibold">Tổng Tiền: {cartTotal} $</p>
        </div>

        {/* Checkout Button */}
        <div className="pt-4">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => alert("Chuyển tới trang thanh toán")}
          >
            Thanh Toán
          </Button>
        </div>

        {/* Empty Cart Button */}
        {!isEmpty && (
          <div className="pt-2">
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => emptyCart()}
            >
              Xóa Tất Cả
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
