import { AppView } from '@/components/types';

/** Base path for the app (must match Vite base in vite.config). No trailing slash. */
export const BASE_PATH = (import.meta.env.BASE_URL ?? '/salon-app/').replace(/\/+$/, '') || ''

/** Canonical paths for salon app. Use these for navigation. */
export const ROUTES = {
  LOGIN: '/login',
  VERIFICATION: '/verification',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',
  SCHEDULE: '/schedule',
  STAFF: '/staff',
  CUSTOMERS: '/customers',
  SOCIAL_HUB: '/social-hub',
  INVENTORY: '/inventory',
  VACANCIES: '/vacancies',
  CHAT: '/chat',
  SERVICES: '/services',
  NOTIFICATIONS: '/notifications',
  SALON_PROFILE: '/salon-profile',
  DEMAND_FORECAST: '/demand-forecast',
  CHECKOUT: '/checkout',
  SUBSCRIPTIONS: '/subscriptions',
  BILLING: '/billing',
  STAFF_PORTAL: '/staff-portal',
  ACCOUNT_SETTINGS: '/account-settings',
  ACCOUNT_SETTINGS_ACTIVITY: '/account-settings/activity',
  PROMOTIONS: '/promotions',
  POST_DETAIL: '/post/:id',
  RESET_PASSWORD: '/auth/reset-password/:token',
} as const;

/** Map AppView to path for TopNavbar navigation */
export const APP_VIEW_TO_PATH: Record<AppView, string> = {
  [AppView.AUTH]: ROUTES.LOGIN,
  [AppView.DASHBOARD]: ROUTES.DASHBOARD,
  [AppView.SCHEDULE]: ROUTES.SCHEDULE,
  [AppView.STAFF]: ROUTES.STAFF,
  [AppView.CUSTOMERS]: ROUTES.CUSTOMERS,
  [AppView.ARCHIVE]: ROUTES.SOCIAL_HUB,
  [AppView.APOTHECARY]: ROUTES.INVENTORY,
  [AppView.CHAT]: ROUTES.CHAT,
  [AppView.SERVICES]: ROUTES.SERVICES,
  [AppView.NOTIFICATIONS]: ROUTES.NOTIFICATIONS,
  [AppView.SALON_PROFILE]: ROUTES.SALON_PROFILE,
  [AppView.DEMAND_FORECAST]: ROUTES.DEMAND_FORECAST,
  [AppView.CHECKOUT]: ROUTES.CHECKOUT,
  [AppView.SUBSCRIPTIONS]: ROUTES.SUBSCRIPTIONS,
  [AppView.BILLING]: ROUTES.BILLING,
  [AppView.STAFF_PORTAL]: ROUTES.STAFF_PORTAL,
  [AppView.INVENTORY]: ROUTES.INVENTORY,
  [AppView.VACANCIES]: ROUTES.VACANCIES,
  [AppView.ACCOUNT_SETTINGS]: ROUTES.ACCOUNT_SETTINGS,
  [AppView.PROMOTIONS]: ROUTES.PROMOTIONS,
};

/** Map path to AppView (for determining current view from URL) */
export const PATH_TO_APP_VIEW: Record<string, AppView> = {
  [ROUTES.DASHBOARD]: AppView.DASHBOARD,
  [ROUTES.SCHEDULE]: AppView.SCHEDULE,
  '/appointments': AppView.SCHEDULE,
  [ROUTES.STAFF]: AppView.STAFF,
  [ROUTES.CUSTOMERS]: AppView.CUSTOMERS,
  [ROUTES.SOCIAL_HUB]: AppView.ARCHIVE,
  '/archive': AppView.ARCHIVE,
  [ROUTES.INVENTORY]: AppView.APOTHECARY,
  '/apothecary': AppView.APOTHECARY,
  [ROUTES.VACANCIES]: AppView.VACANCIES,
  [ROUTES.CHAT]: AppView.CHAT,
  [ROUTES.SERVICES]: AppView.SERVICES,
  [ROUTES.NOTIFICATIONS]: AppView.NOTIFICATIONS,
  [ROUTES.SALON_PROFILE]: AppView.SALON_PROFILE,
  '/salonProfile': AppView.SALON_PROFILE,
  [ROUTES.DEMAND_FORECAST]: AppView.DEMAND_FORECAST,
  '/forecast': AppView.DEMAND_FORECAST,
  [ROUTES.CHECKOUT]: AppView.CHECKOUT,
  [ROUTES.SUBSCRIPTIONS]: AppView.SUBSCRIPTIONS,
  [ROUTES.BILLING]: AppView.BILLING,
  [ROUTES.STAFF_PORTAL]: AppView.STAFF_PORTAL,
  [ROUTES.ACCOUNT_SETTINGS]: AppView.ACCOUNT_SETTINGS,
  [ROUTES.PROMOTIONS]: AppView.PROMOTIONS,
};
