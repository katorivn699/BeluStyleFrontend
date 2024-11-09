// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const PrivateRoute = ({ children, requiredRoles, isLoginForm }) => {
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();

  try {
    if (!isAuth) {
      // Redirect to login if not authenticated
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    if (isAuth && isLoginForm) {
      return <Navigate to="/Dashboard" />;
    }

    const userRole = authUser.role;

    if (!userRole) {
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      return <Navigate to="/Dashboard" />;
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
