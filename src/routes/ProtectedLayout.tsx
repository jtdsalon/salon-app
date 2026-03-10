import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '@/state/auth';
import { getSalon } from '@/state/salon';
import { getServices } from '@/state/service';
import { AppView } from '@/components/types';
import { APP_VIEW_TO_PATH, ROUTES } from './routeConfig';
import { ProtectedRoute } from './ProtectedRoute';
import { SalonLayoutProvider, LayoutProvider, MainLayout, NotificationProvider } from '@/components/common/layouts';
import { RealtimeProvider } from '@/contexts/RealtimeContext';
import { SERVICES } from '@/components/SalonProfile/constants';

/** Dedupe getSalon dispatch within 500ms to avoid double calls from React Strict Mode */
let _lastGetSalon = { salonId: '', t: 0 };
function shouldSkipGetSalon(salonId: string): boolean {
  const now = Date.now();
  if (_lastGetSalon.salonId === salonId && now - _lastGetSalon.t < 500) return true;
  _lastGetSalon = { salonId, t: now };
  return false;
}

const ProtectedLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, user, isAuthenticated } = useAuthContext();

  const effectiveSalonId = user?.salonId ?? user?.roles?.[0]?.salonId;

  useEffect(() => {
    if (isAuthenticated && effectiveSalonId) {
      if (!shouldSkipGetSalon(effectiveSalonId)) {
        dispatch(getSalon(effectiveSalonId) as any);
      }
      dispatch(getServices(effectiveSalonId) as any);
    }
  }, [isAuthenticated, effectiveSalonId, dispatch]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleNavigateToCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  const handleNavigateToView = (view: AppView) => {
    const path = APP_VIEW_TO_PATH[view];
    if (path) navigate(path);
  };

  const handleNavigateToDashboard = () => navigate(ROUTES.DASHBOARD);

  const token = isAuthenticated && typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const pollIntervalMs = 60000;

  return (
    <ProtectedRoute>
      <RealtimeProvider token={token} salonId={effectiveSalonId ?? undefined} pollIntervalMs={pollIntervalMs}>
        <SalonLayoutProvider
          onLogout={handleLogout}
          onNavigateToCheckout={handleNavigateToCheckout}
          onNavigateToView={handleNavigateToView}
          onNavigateToDashboard={handleNavigateToDashboard}
          services={SERVICES}
        >
          <NotificationProvider>
            <LayoutProvider>
              <MainLayout />
            </LayoutProvider>
          </NotificationProvider>
        </SalonLayoutProvider>
      </RealtimeProvider>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
