import React from "react";
import { Navigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const PrivateRoute = ({ children, requiredRoles, isLoginForm }) => {
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();

  if (isLoginForm) {
    if (isAuth) {
      return <Navigate to="/Dashboard" />;
    } else {
      return children;
    }
  }

  try {
    if (!isAuth) {
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    const userRole = authUser.role;

    if (!userRole) {
      return <Navigate to="/LoginForStaffAndAdmin" />;
    }

    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      return <Navigate to="/Dashboard" />;
    }

    return children;
  } catch (error) {
    console.error("Error in PrivateRoute:", error);

    return <Navigate to="/LoginForStaffAndAdmin" />;
  }
};

export default PrivateRoute;
