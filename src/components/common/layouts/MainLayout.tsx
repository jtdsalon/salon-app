import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppView } from '@/components/types';
import { PATH_TO_APP_VIEW, ROUTES } from '@/routes/routeConfig';
import { useSalonLayout } from './SalonLayoutContext';
import { useAuthContext } from '@/state/auth';
import TopNavbar from './TopNavbar';
import SubscriptionBanner, { BannerType } from '../SubscriptionBanner';
import OnboardingBanner, { OnboardingBannerType } from '../OnboardingBanner';
import {
  ACCENT_COLOR,
  ACCENT_COLOR_DARK,
  ACCENT_COLOR_HOVER,
  PRIMARY_DARK,
  BG_DARK,
  SUCCESS_COLOR,
  ERROR_COLOR,
  TEXT_MUTED,
  TEXT_MUTED_DARK,
  ON_ACCENT,
} from '@/lib/constants/theme';
import { isSalonProfileComplete, MIN_SERVICES_REQUIRED } from '@/lib/onboarding';
import type { RootState } from '@/state/store';

function getCurrentView(pathname: string): AppView {
  return PATH_TO_APP_VIEW[pathname] ?? AppView.DASHBOARD;
}

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { cart, mode, isFocusMode } = useSalonLayout();

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

  const theme = useMemo(() => {
    return createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? PRIMARY_DARK : '#F8FAFC' },
          secondary: { main: ACCENT_COLOR, dark: ACCENT_COLOR_DARK },
          error: { main: ERROR_COLOR },
          background: {
            default: mode === 'light' ? '#fcfcfc' : BG_DARK,
            paper: mode === 'light' ? '#ffffff' : PRIMARY_DARK,
          },
          text: {
            primary: mode === 'light' ? PRIMARY_DARK : '#F1F5F9',
            secondary: mode === 'light' ? TEXT_MUTED : TEXT_MUTED_DARK,
          },
          success: { main: SUCCESS_COLOR },
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
          MuiButton: {
            styleOverrides: {
              containedSecondary: {
                backgroundColor: ACCENT_COLOR,
                color: ON_ACCENT,
                fontWeight: 900,
                '&:hover': {
                  backgroundColor: ACCENT_COLOR_HOVER,
                  color: ON_ACCENT,
                },
              },
            },
          },
        },
      });
  },
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
          <Box sx={{ maxWidth: isScheduleView ? 'none' : 1400, mx: 'auto', width: '100%', minWidth: 0, overflowX: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
