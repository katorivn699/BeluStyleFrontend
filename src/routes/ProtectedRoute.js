import { useEffect } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate } from "react-router-dom";

const CustomerProtectedRoute = ({ children }) => {
  const isAuth = useIsAuthenticated();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  return children;
};

const RegisterProtectedRoute = ({ children }) => {
  let email = localStorage.getItem("mail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      if (navigate(-1) === false) {
        navigate("/");
      }
    }
  }, [email, navigate]);
  return children;
};

export { CustomerProtectedRoute, RegisterProtectedRoute };
