import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
