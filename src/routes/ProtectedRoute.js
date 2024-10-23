import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ 
  children, 
  types = "", 
}) => {
  const isAuth = useIsAuthenticated();
  const [isCheckingEmail, setIsCheckingEmail] = useState(
    types.includes("REGISTER")
  );
  const email = localStorage.getItem("mail");

  useEffect(() => {
    if (types.includes("REGISTER")) {
      setIsCheckingEmail(false);
    }
  }, [types]);

  if (types.includes("GUEST") && !isAuth) {
    return children;
  }
  if (types.includes("CUSTOMER") && isAuth) {
    return children; 
  }
  if (types.includes("REGISTER")) {
    if (isCheckingEmail) {
      return <CircularProgress />; 
    }
    if (email) {
      return children;
    }
  }

  return <Navigate to="/" />;
};
