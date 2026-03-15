import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthContext } from '@/state/auth';
import { AuthView } from '@/components/Auth';
import { ROUTES } from './routeConfig';
import { hasSalonAccess } from '@/lib/utils/permission';
import ProtectedLayout from './ProtectedLayout';
import UnauthorizedPage from './UnauthorizedPage';
import VerificationPage from './VerificationPage';
import ResetPasswordPage from './ResetPasswordPage';
import Apppp from '@/components/salon-user-UIs/Glow4/App';
// Lazy-loaded for code splitting
const LazyDashboard = lazy(() => import('./routePages').then((m) => ({ default: m.DashboardPage })));
const LazyAppointments = lazy(() => import('./routePages').then((m) => ({ default: m.AppointmentsPage })));
const LazyStaffList = lazy(() => import('./routePages').then((m) => ({ default: m.StaffListPage })));
const LazyCustomers = lazy(() => import('./routePages').then((m) => ({ default: m.CustomersPage })));
const LazySocialHub = lazy(() => import('./routePages').then((m) => ({ default: m.SocialHubPage })));
const LazyPostDetail = lazy(() => import('./routePages').then((m) => ({ default: m.PostDetailPage })));
const LazyInventory = lazy(() => import('./routePages').then((m) => ({ default: m.InventoryPage })));
// const LazyChatView = lazy(() => import('./routePages').then((m) => ({ default: m.ChatViewPage })));
const LazyServices = lazy(() => import('./routePages').then((m) => ({ default: m.ServicesPage })));
const LazyNotifications = lazy(() => import('./routePages').then((m) => ({ default: m.NotificationsPage })));
const LazySalonProfile = lazy(() => import('./routePages').then((m) => ({ default: m.SalonProfilePage })));
const LazyDemandForecaster = lazy(() => import('./routePages').then((m) => ({ default: m.DemandForecasterPage })));
const LazyCheckout = lazy(() => import('./routePages').then((m) => ({ default: m.CheckoutPage })));
const LazySubscription = lazy(() => import('./routePages').then((m) => ({ default: m.SubscriptionPage })));
const LazyBilling = lazy(() => import('./routePages').then((m) => ({ default: m.BillingPage })));
const LazyStaffPortal = lazy(() => import('./routePages').then((m) => ({ default: m.StaffPortalPage })));
const LazyVacancies = lazy(() => import('./routePages').then((m) => ({ default: m.VacanciesPage })));
const LazyPromotions = lazy(() => import('./routePages').then((m) => ({ default: m.PromotionsPage })));
const LazyAccountSettings = lazy(() => import('./routePages').then((m) => ({ default: m.AccountSettingsPage })));
const LazyAllActivity = lazy(() => import('./routePages').then((m) => ({ default: m.AllActivityPage })));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
    <CircularProgress color="secondary" />
  </Box>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, roles, isAuthenticated, isVerified } = useAuthContext();
  if (isAuthenticated) {
    if (!isVerified) return <Navigate to={ROUTES.VERIFICATION} replace />;
    const hasAccess = hasSalonAccess(roles, user?.salonId);
    return <Navigate to={hasAccess ? ROUTES.DASHBOARD : ROUTES.UNAUTHORIZED} replace />;
  }
  return (
    <AuthView
      onLogin={() => navigate(ROUTES.DASHBOARD, { replace: true })}
      onVerificationComplete={(salonId) =>
        navigate(ROUTES.SALON_PROFILE, { replace: true, state: { salonId, openSalonEdit: true } })
      }
    />
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path={ROUTES.LOGIN} element={<Apppp />} /> */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.VERIFICATION} element={<VerificationPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

      {/* Protected routes with MainLayout */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><LazyDashboard /></Suspense>} />
        <Route path="schedule" element={<Suspense fallback={<LoadingFallback />}><LazyAppointments /></Suspense>} />
        <Route path="staff" element={<Suspense fallback={<LoadingFallback />}><LazyStaffList /></Suspense>} />
        <Route path="customers" element={<Suspense fallback={<LoadingFallback />}><LazyCustomers /></Suspense>} />
        <Route path="social-hub" element={<Suspense fallback={<LoadingFallback />}><LazySocialHub /></Suspense>} />
        <Route path="post/:id" element={<Suspense fallback={<LoadingFallback />}><LazyPostDetail /></Suspense>} />
        <Route path="inventory" element={<Suspense fallback={<LoadingFallback />}><LazyInventory /></Suspense>} />
        <Route path="vacancies" element={<Suspense fallback={<LoadingFallback />}><LazyVacancies /></Suspense>} />
        <Route path="promotions" element={<Suspense fallback={<LoadingFallback />}><LazyPromotions /></Suspense>} />
        {/* <Route path="chat" element={<Suspense fallback={<LoadingFallback />}><LazyChatView /></Suspense>} /> */}
        <Route path="services" element={<Suspense fallback={<LoadingFallback />}><LazyServices /></Suspense>} />
        <Route path="notifications" element={<Suspense fallback={<LoadingFallback />}><LazyNotifications /></Suspense>} />
        <Route path="salon-profile" element={<Suspense fallback={<LoadingFallback />}><LazySalonProfile /></Suspense>} />
        <Route path="demand-forecast" element={<Suspense fallback={<LoadingFallback />}><LazyDemandForecaster /></Suspense>} />
        <Route path="checkout" element={<Suspense fallback={<LoadingFallback />}><LazyCheckout /></Suspense>} />
        <Route path="subscriptions" element={<Suspense fallback={<LoadingFallback />}><LazySubscription /></Suspense>} />
        <Route path="billing" element={<Suspense fallback={<LoadingFallback />}><LazyBilling /></Suspense>} />
        <Route path="staff-portal/:staffId?" element={<Suspense fallback={<LoadingFallback />}><LazyStaffPortal /></Suspense>} />
                <Route path="account-settings" element={<Suspense fallback={<LoadingFallback />}><LazyAccountSettings /></Suspense>} />
        <Route path="account-settings/activity" element={<Suspense fallback={<LoadingFallback />}><LazyAllActivity /></Suspense>} />
      </Route>

      {/* Redirects for duplicate/alias paths */}
      <Route path="auth" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="appointments" element={<Navigate to={ROUTES.SCHEDULE} replace />} />
      <Route path="archive" element={<Navigate to={ROUTES.SOCIAL_HUB} replace />} />
      <Route path="apothecary" element={<Navigate to={ROUTES.INVENTORY} replace />} />
      <Route path="salonProfile" element={<Navigate to={ROUTES.SALON_PROFILE} replace />} />
      <Route path="forecast" element={<Navigate to={ROUTES.DEMAND_FORECAST} replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
