import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/state/auth';
import { useSalonLayout } from '@/components/common/layouts';
import { ROUTES } from './routeConfig';

import Dashboard from '@/components/Dashboard';
import Appointments from '@/components/Appointments';
import StaffList from '@/components/StaffList';
import Customers from '@/components/Customers';
import { FeedView as SocialHub } from '@/components/Feed';
import Inventory from '@/components/Inventory';
import ChatView from '@/components/ChatView';
import Services from '@/components/Services';
import NotificationsView from '@/components/NotificationsView';
import SalonProfile from '@/components/SalonProfile';
import DemandForecaster from '@/components/DemandForecaster';
import CheckoutView from '@/components/CheckoutView';
import SubscriptionView from '@/components/SubscriptionView';
import BillingView from '@/components/BillingView';
import StaffPortal from '@/components/StaffPortal';
import Vacancies from '@/components/Vacancies';
import AccountSettings from '@/components/Settings';
import AllActivityView from '@/components/Settings/AllActivityView';
import { PromotionDashboard } from '@/components/promotions/PromotionDashboard';
import PostDetailView from '@/components/Feed/components/PostDetailView';

export function DashboardPage() {
  return <Dashboard />;
}

export function AppointmentsPage() {
  const { isFocusMode, setIsFocusMode } = useSalonLayout();
  const location = useLocation();
  const openBookingId = (location.state as { openBookingId?: string } | null)?.openBookingId;
  return (
    <Appointments
      isFocusMode={isFocusMode}
      setIsFocusMode={setIsFocusMode}
      openBookingId={openBookingId}
    />
  );
}

export function StaffListPage() {
  return <StaffList />;
}

export function CustomersPage() {
  return <Customers />;
}

export function SocialHubPage() {
  const { navigateToSalonProfile } = useSalonLayout();
  return <SocialHub onViewSalon={navigateToSalonProfile} />;
}

export function PostDetailPage() {
  return <PostDetailView />;
}

export function InventoryPage() {
  const { handleAddToCart } = useSalonLayout();
  return <Inventory onAddToCart={handleAddToCart} />;
}

export function ChatViewPage() {
  return <ChatView />;
}

export function ServicesPage() {
  return <Services />;
}

export function NotificationsPage() {
  return <NotificationsView />;
}

export function SalonProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { selectedSalonId, setSelectedSalonId } = useSalonLayout();
  const state = location.state as { salonId?: string; openSalonEdit?: boolean } | undefined;
  const openSalonEditOnMount = state?.openSalonEdit ?? false;
  const incomingSalonId = state?.salonId;

  useEffect(() => {
    if (incomingSalonId) {
      setSelectedSalonId(incomingSalonId);
    }
  }, [incomingSalonId, setSelectedSalonId]);

  const effectiveSalonId = incomingSalonId ?? selectedSalonId ?? user?.salonId;

  return (
    <SalonProfile
      salonId={effectiveSalonId}
      onBack={() => navigate(ROUTES.SOCIAL_HUB)}
      openSalonEditOnMount={openSalonEditOnMount}
    />
  );
}

export function DemandForecasterPage() {
  return <DemandForecaster />;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, handleCompleteCheckout } = useSalonLayout();
  return (
    <CheckoutView
      items={cart}
      onBack={() => navigate(ROUTES.INVENTORY)}
      onComplete={handleCompleteCheckout}
    />
  );
}

export function SubscriptionPage() {
  return <SubscriptionView />;
}

export function BillingPage() {
  return <BillingView />;
}

export function StaffPortalPage() {
  return <StaffPortal />;
}

export function VacanciesPage() {
  return <Vacancies />;
}

export function PromotionsPage() {
  return <PromotionDashboard />;
}

export function AccountSettingsPage() {
  return <AccountSettings />;
}

export function AllActivityPage() {
  return <AllActivityView />;
}
