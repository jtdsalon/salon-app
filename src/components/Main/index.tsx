import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

// @ts-ignore
import { AppView, CartItem, Product, Appointment } from '../types';
// @ts-ignore
import TopNavbar from '../TopNavbar';
import CartDrawer from '../CartDrawer';

interface MainLayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  handleAddToCart: (product: Product) => void;
  handleCheckoutAppointment: (apt: Appointment) => void;
  handleUpdateCartQuantity: (id: string, delta: number) => void;
  handleRemoveFromCart: (id: string) => void;
  handleCheckout: () => void;
  renderView: () => React.ReactNode;
  isFocusMode?: boolean;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  setCurrentView,
  cart,
  isCartOpen,
  setIsCartOpen,
  handleAddToCart,
  handleCheckoutAppointment,
  handleUpdateCartQuantity,
  handleRemoveFromCart,
  handleCheckout,
  renderView,
  isFocusMode = false,
  onLogout,
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    localStorage.setItem('glow_apothecary_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.body.setAttribute('data-theme', newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: mode === 'light' ? '#0F172A' : '#F8FAFC',
          },
          secondary: {
            main: '#EAB308',
            dark: '#EAB308',
          },
          error: {
            main: '#F43F5E',
          },
          background: {
            default: mode === 'light' ? '#fcfcfc' : '#020617',
            paper: mode === 'light' ? '#ffffff' : '#0F172A',
          },
          text: {
            primary: mode === 'light' ? '#0F172A' : '#F1F5F9',
            secondary: mode === 'light' ? '#64748B' : '#94A3B8',
          },
          success: {
            main: '#10B981',
          },
          divider: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
          action: {
            selected: mode === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(248, 250, 252, 0.05)',
            hover: mode === 'light' ? 'rgba(15, 23, 42, 0.03)' : 'rgba(248, 250, 252, 0.03)',
          }
        },
        typography: {
          fontFamily: '"Inter", "sans-serif"',
          h3: {
            fontWeight: 900,
            letterSpacing: '-0.04em',
          },
          h4: {
            fontWeight: 900,
          },
        },
        shape: {
          borderRadius: 24,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  // Determine if we should hide navbar (focus mode on schedule view)
  const isScheduleView = currentView === AppView.SCHEDULE;
  const hideNavbar = isFocusMode && isScheduleView;

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
        {!hideNavbar && (
          <TopNavbar 
            currentView={currentView} 
            setView={setCurrentView} 
            isDarkMode={mode === 'dark'}
            toggleTheme={toggleTheme}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onLogout={onLogout}
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
          <Box sx={{ 
            maxWidth: isScheduleView ? 'none' : 1400, 
            mx: 'auto', 
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {renderView()}
          </Box>
        </Box>

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
