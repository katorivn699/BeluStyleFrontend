import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate } from "react-router-dom";

const CustomerProtectedRoute = ({ children }) => {
  const isAuth = useIsAuthenticated();

  // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
  if (!isAuth) {
    return <Navigate to="/" />;
  }

  // Nếu chưa đăng nhập, render các children
  return children;
};

const LoggedProtectedRoute = ({ children }) => {
  const isAuth = useIsAuthenticated();

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return children;
};


const RegisterProtectedRoute = ({ children }) => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(true);
  let email = localStorage.getItem("mail");

  useEffect(() => {
    setIsCheckingEmail(false); 
  }, []);

  if (isCheckingEmail) {
    return <CircularProgress />;
  }

  if (!email) {
    return <Navigate to="/" />;
  }

  return children;
};

export { CustomerProtectedRoute, RegisterProtectedRoute, LoggedProtectedRoute };
