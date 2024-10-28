// UserSideMenu.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

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
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: '10px' }}>
            <Link 
              to={item.path} 
              style={{ 
                textDecoration: 'none',  // Remove underline
                color: location.pathname === item.path ? 'blue' : 'black' 
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default UserSideMenu;
