import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useIsAuthenticated();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (navigate("/"));
  }
  return children;
};

export default CustomerProtectedRoute;
