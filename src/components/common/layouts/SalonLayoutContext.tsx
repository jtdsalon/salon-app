import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const SALON_THEME_STORAGE_KEY = 'salon_app_theme_mode';
import type { Product, Appointment } from '@/components/types';
import { AppView } from '@/components/types';

export interface CartItem extends Product {
  quantity: number;
}

interface SalonLayoutContextValue {
  // Theme
  mode: 'light' | 'dark';
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  handleAddToCart: (product: Product) => void;
  handleUpdateCartQuantity: (id: string, delta: number) => void;
  handleRemoveFromCart: (id: string) => void;
  handleOpenCart: () => void;
  handleCheckout: () => void;

  // Focus mode (fullscreen appointments)
  isFocusMode: boolean;
  setIsFocusMode: (v: boolean) => void;

  // Salon profile
  selectedSalonId: string | undefined;
  setSelectedSalonId: (id: string | undefined) => void;

  // Services lookup for checkout
  handleCheckoutAppointment: (apt: Appointment) => void;

  // Checkout complete (clears cart, navigates to dashboard)
  handleCompleteCheckout: () => void;

  // Navigate to salon profile with id
  navigateToSalonProfile: (salonId: string) => void;

  // Logout
  onLogout?: () => void;
}

const SalonLayoutContext = createContext<SalonLayoutContextValue | null>(null);

export function useSalonLayout(): SalonLayoutContextValue {
  const ctx = useContext(SalonLayoutContext);
  if (!ctx) {
    throw new Error('useSalonLayout must be used within SalonLayoutProvider');
  }
  return ctx;
}

interface SalonLayoutProviderProps {
  children: React.ReactNode;
  onLogout?: () => void;
  onNavigateToCheckout?: () => void;
  onNavigateToView?: (view: AppView) => void;
  onNavigateToDashboard?: () => void;
  services?: Array<{ id: string; name: string; price: number }>;
}

export function SalonLayoutProvider({
  children,
  onLogout,
  onNavigateToCheckout,
  onNavigateToView,
  onNavigateToDashboard,
  services = [],
}: SalonLayoutProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(SALON_THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return 'light';
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState<string | undefined>(undefined);

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      const next = m === 'light' ? 'dark' : 'light';
      localStorage.setItem(SALON_THEME_STORAGE_KEY, next);
      document.body.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleOpenCart = useCallback(() => setIsCartOpen(true), []);
  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    onNavigateToCheckout?.();
  }, [onNavigateToCheckout]);

  const handleCompleteCheckout = useCallback(() => {
    setCart([]);
    onNavigateToDashboard?.();
  }, [onNavigateToDashboard]);

  const navigateToSalonProfile = useCallback(
    (salonId: string) => {
      setSelectedSalonId(salonId);
      onNavigateToView?.(AppView.SALON_PROFILE);
    },
    [onNavigateToView]
  );

  const handleCheckoutAppointment = useCallback(
    (apt: Appointment) => {
      const service = services.find((s) => s.id === apt.serviceId);
      if (!service) return;
      const product: Product = {
        id: service.id,
        name: service.name,
        brand: 'SALON SERVICE',
        price: service.price,
        stock: 1,
        minStock: 0,
        category: 'Service',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop',
        barcode: `SRV-${service.id}`,
        description: `Professional ${service.name} by Glow Artisans.`,
      };
      setCart([{ ...product, quantity: 1 }]);
      onNavigateToView?.(AppView.CHECKOUT);
    },
    [services, onNavigateToView]
  );

  const value = useMemo<SalonLayoutContextValue>(
    () => ({
      mode,
      toggleTheme,
      cart,
      isCartOpen,
      setIsCartOpen,
      handleAddToCart,
      handleUpdateCartQuantity,
      handleRemoveFromCart,
      handleOpenCart,
      handleCheckout,
      handleCompleteCheckout,
      navigateToSalonProfile,
      isFocusMode,
      setIsFocusMode,
      selectedSalonId,
      setSelectedSalonId,
      handleCheckoutAppointment,
      onLogout,
    }),
    [
      mode,
      toggleTheme,
      cart,
      isCartOpen,
      handleAddToCart,
      handleUpdateCartQuantity,
      handleRemoveFromCart,
      handleCheckout,
      handleCompleteCheckout,
      navigateToSalonProfile,
      isFocusMode,
      selectedSalonId,
      handleCheckoutAppointment,
      onLogout,
    ]
  );

  return (
    <SalonLayoutContext.Provider value={value}>
      {children}
    </SalonLayoutContext.Provider>
  );
}
