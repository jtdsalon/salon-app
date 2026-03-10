import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/state/auth/useAuthContext';
import { hasSalonAccess } from '@/lib/utils/permission';
import { ROUTES } from './routeConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Optional salonId to check access. Uses user.salonId if not provided. */
  salonId?: string | null;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, salonId }) => {
  const { user, roles, isAuthenticated, isVerified, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isVerified) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  const effectiveSalonId = salonId ?? user?.salonId ?? user?.roles?.[0]?.salonId;
  const allowed = hasSalonAccess(roles, effectiveSalonId);

  if (!allowed) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
