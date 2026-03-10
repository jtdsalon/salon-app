import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Box, Fab } from '@mui/material';
import { MessageSquare } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppView } from '@/components/types';
import { PATH_TO_APP_VIEW, ROUTES } from '@/routes/routeConfig';
import { useSalonLayout } from './SalonLayoutContext';
import { useAuthContext } from '@/state/auth';
import TopNavbar from './TopNavbar';
import CartDrawer from '@/components/CartDrawer';
import SubscriptionBanner, { BannerType } from '../SubscriptionBanner';
import OnboardingBanner, { OnboardingBannerType } from '../OnboardingBanner';
import { isSalonProfileComplete, MIN_SERVICES_REQUIRED } from '@/lib/onboarding';
import { ACCENT_COLOR, ACCENT_COLOR_DARK, ACCENT_COLOR_RGBA } from '@/lib/constants/theme';
import type { RootState } from '@/state/store';

function getCurrentView(pathname: string): AppView {
  return PATH_TO_APP_VIEW[pathname] ?? AppView.DASHBOARD;
}

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { cart, mode, isFocusMode, isCartOpen, setIsCartOpen, handleUpdateCartQuantity, handleRemoveFromCart, handleCheckout } = useSalonLayout();

  const salon = useSelector((state: RootState) => state.salon.salon);
  const serviceList = useSelector((state: RootState) => state.service.serviceList);
  const serviceLoading = useSelector((state: RootState) => state.service.loading);
  const effectiveSalonId = user?.salonId ?? (user?.roles as { salonId?: string }[] | undefined)?.[0]?.salonId ?? salon?.id;
  const profileIncomplete = salon != null && !isSalonProfileComplete(salon);
  const servicesMin = !serviceLoading && serviceList.length < MIN_SERVICES_REQUIRED;
  const onboardingType: OnboardingBannerType | null = profileIncomplete ? 'profile_incomplete' : servicesMin ? 'services_min' : null;
  const [onboardingBannerVisible, setOnboardingBannerVisible] = useState(true);

  // Subscription banner from backend (auth user.subscription.banner)
  const serverBanner = user?.subscription?.banner;
  const [bannerVisible, setBannerVisible] = useState(true);
  const bannerType: BannerType = (serverBanner?.type as BannerType) ?? 'trial_ending';
  const bannerDaysLeft = serverBanner?.daysLeft ?? 5;
  const showBanner = bannerVisible && serverBanner != null;
  const hasSalonContext = effectiveSalonId != null;
  const showOnboardingBanner = onboardingBannerVisible && onboardingType != null && hasSalonContext;

  const currentView = getCurrentView(location.pathname);
  const isScheduleView = currentView === AppView.SCHEDULE;
  const hideNavbar = isFocusMode && isScheduleView;

  useEffect(() => {
    localStorage.setItem('glow_apothecary_cart', JSON.stringify(cart));
  }, [cart]);

  // Doc §3.2: redirect to Salon Profile with Edit dialog when profile incomplete and user lands on Dashboard
  useEffect(() => {
    if (salon && profileIncomplete && location.pathname === ROUTES.DASHBOARD) {
      navigate(ROUTES.SALON_PROFILE, { replace: true, state: { openSalonEdit: true } });
    }
  }, [salon, profileIncomplete, location.pathname, navigate]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? '#0F172A' : '#F8FAFC' },
          secondary: { main: ACCENT_COLOR, dark: ACCENT_COLOR_DARK },
          error: { main: '#F43F5E' },
          background: {
            default: mode === 'light' ? '#fcfcfc' : '#020617',
            paper: mode === 'light' ? '#ffffff' : '#0F172A',
          },
          text: {
            primary: mode === 'light' ? '#0F172A' : '#F1F5F9',
            secondary: mode === 'light' ? '#64748B' : '#94A3B8',
          },
          success: { main: '#10B981' },
          divider: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
          action: {
            selected: mode === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(248, 250, 252, 0.05)',
            hover: mode === 'light' ? 'rgba(15, 23, 42, 0.03)' : 'rgba(248, 250, 252, 0.03)',
          },
        },
        typography: {
          fontFamily: '"Inter", "sans-serif"',
          h3: { fontWeight: 900, letterSpacing: '-0.04em' },
          h4: { fontWeight: 900 },
        },
        shape: { borderRadius: 24 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: 'none' },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'background-color 0.4s ease',
        }}
      >
        {!hideNavbar && <TopNavbar />}
        {showOnboardingBanner && !hideNavbar && (
          <OnboardingBanner
            type={onboardingType!}
            onClose={() => setOnboardingBannerVisible(false)}
            onAction={() =>
              onboardingType === 'profile_incomplete'
                ? navigate(ROUTES.SALON_PROFILE, { state: { openSalonEdit: true } })
                : navigate(ROUTES.SERVICES)
            }
          />
        )}
        {showBanner && !showOnboardingBanner && !hideNavbar && (
          <SubscriptionBanner
            type={bannerType}
            daysLeft={bannerDaysLeft}
            onClose={() => setBannerVisible(false)}
            onUpgrade={() => navigate(ROUTES.SUBSCRIPTIONS)}
          />
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: hideNavbar ? 0 : (isScheduleView ? { xs: 2, md: 4, lg: 5 } : { xs: 2, md: 4 }),
            py: hideNavbar ? 0 : (isScheduleView ? { xs: 2, md: 3 } : { xs: 3, md: 4 }),
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
          }}
        >
          <Box sx={{ maxWidth: isScheduleView ? 'none' : 1400, mx: 'auto', width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Box>
        </Box>

        {(!isScheduleView || !isFocusMode) && (
          <Fab
            color="primary"
            aria-label="chat"
            onClick={() => navigate(ROUTES.CHAT)}
            sx={{
              position: 'fixed',
              bottom: 40,
              right: 40,
              bgcolor: ACCENT_COLOR,
              color: mode === 'dark' ? '#050914' : '#FFFFFF',
              '&:hover': { bgcolor: ACCENT_COLOR_DARK },
              width: 72,
              height: 72,
              boxShadow: `0 20px 40px ${ACCENT_COLOR_RGBA(0.2)}`,
              zIndex: 1000,
            }}
          >
            <MessageSquare size={32} strokeWidth={2.5} />
          </Fab>
        )}
      </Box>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </ThemeProvider>
  );
};

export default MainLayout;
