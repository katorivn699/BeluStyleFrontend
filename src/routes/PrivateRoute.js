// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const PrivateRoute = ({ children, requiredRoles }) => {
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();

  try {
    if (!isAuth) {
      // Redirect to login if not authenticated
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    const userRole = authUser.role;

    if (!userRole) {
      // Redirect to login if user role is not defined
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      // Redirect to login if user doesn't have the required role
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    // Render the children if authenticated and has required role
    return children;
  } catch (error) {
    console.error("Error in PrivateRoute:", error);
    // Redirect to login on error
    return <Navigate to="/LoginForStaffAndAdmin" />;
  }
};

export default PrivateRoute;
