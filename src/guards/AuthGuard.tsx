import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../types/auth.type';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, isAuthorized } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !isAuthorized(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
