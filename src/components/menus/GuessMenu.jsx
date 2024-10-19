import React, { useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { CiUser } from "react-icons/ci";

const GuessMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls="guess-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <CiUser className="text-4xl"/>
      </IconButton>
      <Menu
        id="guess-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        disableScrollLock={true}
        sx={{
          borderRadius: "30px", // Apply rounded corners
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds a slight shadow
        }}
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/login">
          <FaRegUser className="mr-2 text-xl" />
          <p>Login</p>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/register">
          <FiUsers className="mr-2 text-xl" />
          <p>Register</p>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/forgotPassword">
          <AiOutlineLock className="mr-2 text-xl" />
          <p>Forgot Password</p>
        </MenuItem>
      </Menu>
    </>
  );
};

export default GuessMenu;
