
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
  requiredRole?: string;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, requireAdmin = false, requiredRole, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log("Protected route check for user:", { 
        id: user.id,
        accountType: user.accountType, 
        isAdmin: user.isAdmin,
        requiredRole,
        requireAdmin,
        allowedRoles,
        currentPath: location.pathname
      });
    }
  }, [user, requiredRole, requireAdmin, allowedRoles, location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !user?.isAdmin) {
    console.log("Admin access required but user is not admin");
    return <Navigate to="/" replace />;
  }

  // Check for specific role requirement
  if (requiredRole) {
    // For admin role
    if (requiredRole === 'admin' && !user?.isAdmin) {
      console.log("Admin role required but user is not admin");
      return <Navigate to="/" replace />;
    }
    
    // For provider/guide role - both 'provider' and 'guide' refer to the same role
    if (requiredRole === 'provider' && user?.accountType !== 'provider' && user?.accountType !== 'guide') {
      console.log(`Role ${requiredRole} required but user has accountType: ${user?.accountType || 'undefined'}`);
      
      // Redirect based on actual user role
      if (user?.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Check for allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = 
      (user?.isAdmin && allowedRoles.includes('admin')) || 
      (allowedRoles.includes(user?.accountType || '')) ||
      // Handle the case where 'guide' and 'provider' are used interchangeably
      (user?.accountType === 'provider' && allowedRoles.includes('guide')) ||
      (user?.accountType === 'guide' && allowedRoles.includes('provider'));
      
    if (!hasAllowedRole) {
      console.log(`User doesn't have any of the allowed roles:`, allowedRoles);
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
