// UserSideMenu.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

const UserSideMenu = () => {
  const location = useLocation();

  // Define the menu items
  const menuItems = [
    { path: "/user/information", label: "User Information" },
    { path: "/user/orders", label: "My Orders" },
    { path: "/user/discounts", label: "Discounts" },
  ];

  return (
    <Box display="flex" justifyContent="flex-end" padding={2}>
      <div className="font-poppins">
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: "10px" }}>
              <Link
                to={item.path}
                style={{
                  display: "block", // To make the indicator occupy full width
                  textDecoration: "none", // Remove underline
                  color: location.pathname === item.path ? "blue" : "black",
                  padding: "10px",
                  borderRadius: "8px", // Rounded edges for the indicator
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(0, 0, 255, 0.1)"
                      : "transparent",
                  borderLeft:
                    location.pathname === item.path
                      ? "4px solid blue"
                      : "4px solid transparent",
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default UserSideMenu;
