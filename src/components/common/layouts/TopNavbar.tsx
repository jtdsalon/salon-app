import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Badge,
  useTheme,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  alpha,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Popover,
} from '@mui/material';
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Archive,
  ShoppingBag,
  MessageSquare,
  Bell,
  Moon,
  Sun,
  Menu as MenuIcon,
  X,
  BrainCircuit,
  Wallet,
  Briefcase,
  LogOut,
  Settings,
  ChevronDown,
  UserPlus,
  Calendar,
  Info,
  Sparkles,
  MessageCircle,
  Tag,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppView } from '@/components/types';
import { useAuthContext } from '@/state/auth';
import type { RootState } from '@/state/store';
import { getFullImageUrl } from '@/lib/util/imageUrl';
import { useSalonLayout } from './SalonLayoutContext';
import { useNotifications } from './NotificationContext';
import type { AppNotification } from './NotificationContext';
import { APP_VIEW_TO_PATH, PATH_TO_APP_VIEW, ROUTES } from '@/routes/routeConfig';

const navItems = [
  { id: AppView.DASHBOARD, label: 'Dashboard' },
  { id: AppView.SCHEDULE, label: 'Schedule' },
  { id: AppView.ARCHIVE, label: 'LookBook' },
  { id: AppView.PROMOTIONS, label: 'Promotions' },
  // { id: AppView.CHAT, label: 'Chat' },
  { id: AppView.APOTHECARY, label: 'Shop' },
  { id: AppView.VACANCIES, label: 'Recruiting' },
];

const menuItems = [
  { id: AppView.DEMAND_FORECAST, label: 'AI Demand Predict' },
  { id: AppView.CUSTOMERS, label: 'Customer Collective' },
  { id: AppView.SUBSCRIPTIONS, label: 'Subscription' },
  { id: AppView.BILLING, label: 'Financial Vault' },
  { id: AppView.SALON_PROFILE, label: 'Salon Profile' },
  { id: AppView.ACCOUNT_SETTINGS, label: 'Account Settings' },
];

const icons: Record<string, React.ReactNode> = {
  [AppView.DASHBOARD]: <LayoutDashboard size={20} />,
  [AppView.SCHEDULE]: <CalendarDays size={20} />,
  [AppView.ARCHIVE]: <Archive size={20} />,
  [AppView.PROMOTIONS]: <Tag size={20} />,
  [AppView.CHAT]: <MessageSquare size={20} />,
  [AppView.APOTHECARY]: <ShoppingBag size={20} />,
  [AppView.VACANCIES]: <UserPlus size={18} />,
  [AppView.DEMAND_FORECAST]: <BrainCircuit size={18} />,
  [AppView.CUSTOMERS]: <UserCircle size={18} />,
  [AppView.SUBSCRIPTIONS]: <Wallet size={18} />,
  [AppView.BILLING]: <Wallet size={18} />,
  [AppView.SALON_PROFILE]: <Settings size={18} />,
  [AppView.ACCOUNT_SETTINGS]: <Settings size={16} />,
  [AppView.STAFF_PORTAL]: <Briefcase size={18} />,
  [AppView.NOTIFICATIONS]: <Bell size={18} />,
};

function getCurrentView(pathname: string): AppView {
  return PATH_TO_APP_VIEW[pathname] ?? AppView.DASHBOARD;
}

function getNotifIcon(type: string, theme: { palette: { secondary: { main: string } } }) {
  switch (type) {
    case 'booking_new':
    case 'booking_confirmed':
    case 'booking_rescheduled':
    case 'booking_cancelled':
    case 'cancellation_customer':
    case 'cancellation_salon':
    case 'cancellation_system':
      return <Calendar size={14} color={theme.palette.secondary.main} />;
    case 'job_application_new':
    case 'job_application_approved':
    case 'job_application_rejected':
      return <Briefcase size={14} color="#06B6D4" />;
    case 'review_new':
    case 'rating_new':
    case 'reply_to_review':
      return <Info size={14} color="#F59E0B" />;
    case 'like':
      return <Sparkles size={14} color={theme.palette.secondary.main} fill={theme.palette.secondary.main} />;
    case 'comment':
      return <MessageCircle size={14} color="#4F46E5" />;
    case 'follow':
    case 'mention':
      return <UserPlus size={14} color="#10B981" />;
    default:
      return <Bell size={14} />;
  }
}

const TopNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const { user } = useAuthContext();
  const salon = useSelector((state: RootState) => state.salon.salon);
  const {
    toggleTheme,
    onLogout,
  } = useSalonLayout();
  const { notifications, unreadCount } = useNotifications();

  const currentView = getCurrentView(location.pathname);
  const isStaffPortalView = currentView === AppView.STAFF_PORTAL || (location.pathname === ROUTES.SALON_PROFILE && new URLSearchParams(location.search).get('tab') === 'staff');
  const isDarkMode = theme.palette.mode === 'dark';
  const openMenu = Boolean(anchorEl);

  const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : '—';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role ? user.role.replace(/_/g, ' ').toUpperCase() : 'MASTER ARTISAN • LEAD ADMIN';
  const salonName = salon?.name || 'Glow Salon';
  const salonAvatarUrl = salon?.avatar || salon?.image_url;

  const handleNav = (view: AppView) => {
    if (view === AppView.STAFF_PORTAL) {
      navigate(`${ROUTES.SALON_PROFILE}?tab=staff`);
      setMobileMenuOpen(false);
      setAnchorEl(null);
      return;
    }
    const path = APP_VIEW_TO_PATH[view];
    if (path) {
      navigate(path);
    }
    setMobileMenuOpen(false);
    setAnchorEl(null);
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenNotifications = (e: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(e.currentTarget);
  const handleCloseNotifications = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    onLogout?.();
    handleCloseMenu();
    setMobileMenuOpen(false);
  };

  return (
    <Box
      component="nav"
      sx={{
        height: { xs: 64, md: 72 },
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1.5, md: 4 },
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        alignItems="center"
        sx={{ mr: { xs: 1, md: 6 }, cursor: 'pointer' }}
        onClick={() => handleNav(AppView.DASHBOARD)}
      >
        {salonAvatarUrl ? (
          <Box
            component="img"
            src={getFullImageUrl(salonAvatarUrl)}
            alt={salonName}
            sx={{
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 },
              borderRadius: '10px',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 },
              bgcolor: isDarkMode ? '#1E293B' : '#0F172A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 9.6H22L15.8 14.2L18.2 21.8L12 17.2L5.8 21.8L8.2 14.2L2 9.6H9.6L12 2Z" fill="#EAB308" />
            </svg>
          </Box>
        )}
        <Stack spacing={-0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography sx={{ fontWeight: 900, color: theme.palette.text.primary, fontSize: { xs: '12px', md: '14px' } }}>
            {salonName.split(' ')[0].toUpperCase()}
          </Typography>
          <Typography sx={{ fontWeight: 900, color: '#B59410', fontSize: { xs: '12px', md: '14px' } }}>
            {salonName.split(' ').slice(1).join(' ').toUpperCase()}
          </Typography>
        </Stack>
      </Stack>

      {!isMobile && (
        <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => handleNav(item.id)}
              startIcon={icons[item.id]}
              sx={{
                borderRadius: '14px',
                px: 2,
                py: 1,
                fontWeight: 800,
                fontSize: '13px',
                textTransform: 'none',
                bgcolor: currentView === item.id ? (isDarkMode ? 'rgba(234, 179, 8, 0.1)' : alpha('#EAB308', 0.08)) : 'transparent',
                color: currentView === item.id ? '#EAB308' : theme.palette.text.secondary,
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      )}

      {isMobile && <Box sx={{ flex: 1 }} />}

      <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
        <Badge badgeContent={unreadCount > 0 ? unreadCount : undefined} color="error" overlap="circular">
          <IconButton
            onClick={handleOpenNotifications}
            sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, border: `1px solid ${theme.palette.divider}` }}
          >
            <Bell size={18} />
          </IconButton>
        </Badge>

        <Box
          onClick={handleOpenMenu}
          sx={{
            ml: 1,
            p: '4px',
            borderRadius: '100px',
            border: `2px solid ${openMenu ? '#EAB308' : theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#EAB308' },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 28, md: 32 },
              height: { xs: 28, md: 32 },
              bgcolor: '#0F172A',
              color: '#EAB308',
              fontSize: '14px',
              fontWeight: 900,
            }}
          >
            {userInitials}
          </Avatar>
          {!isExtraSmall && <ChevronDown size={14} style={{ marginLeft: 4, marginRight: 2, color: theme.palette.text.secondary }} />}
        </Box>

        {isMobile && (
          <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ ml: 0.5, border: `1px solid ${theme.palette.divider}` }}>
            <MenuIcon size={20} />
          </IconButton>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            width: 320,
            borderRadius: '24px',
            bgcolor: isDarkMode ? '#0B1224' : 'white',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: isDarkMode ? '#0B1224' : 'white',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: `1px solid ${theme.palette.divider}`,
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 1.5, bgcolor: '#0F172A', color: '#EAB308', fontSize: '24px', fontWeight: 900, border: '2px solid #EAB308' }}>
            {userInitials}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
            {userRole}
          </Typography>
          {salon && (
            <Typography variant="caption" sx={{ color: '#EAB308', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mt: 0.5 }}>
              {salonName}
            </Typography>
          )}
        </Box>
        <Divider sx={{ mb: 1 }} />
        {!isMobile && menuItems.map((item) => (
          <MenuItem key={item.id} onClick={() => handleNav(item.id)} sx={{ py: 1.5, px: 3 }}>
            <ListItemIcon sx={{ color: currentView === item.id ? '#EAB308' : 'text.secondary' }}>{icons[item.id]}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '14px', color: currentView === item.id ? 'text.primary' : 'text.secondary' }} />
          </MenuItem>
        ))}
        <MenuItem onClick={() => { toggleTheme(); handleCloseMenu(); }} sx={{ py: 1.5, px: 3 }}>
          <ListItemIcon sx={{ color: 'text.secondary' }}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</ListItemIcon>
          <ListItemText primary={isDarkMode ? 'Switch to Light Flow' : 'Switch to Dark Vault'} primaryTypographyProps={{ fontWeight: 700, fontSize: '14px', color: 'text.secondary' }} />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="outlined" color="error" startIcon={<LogOut size={18} />} onClick={handleLogout} sx={{ borderRadius: '12px', py: 1.2, fontWeight: 900, fontSize: '13px', borderColor: alpha(theme.palette.error.main, 0.2), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.05) } }}>
            Exit Sanctuary Vault
          </Button>
        </Box>
      </Menu>

      <Popover
        open={Boolean(notifAnchorEl)}
        anchorEl={notifAnchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 2,
            width: { xs: 'calc(100vw - 32px)', sm: 320 },
            maxWidth: 400,
            maxHeight: { xs: '70vh', sm: 480 },
            borderRadius: { xs: '20px', sm: '24px' },
            boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.12)',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: isDarkMode ? 'rgba(15, 23, 42, 1)' : '#0A0F1C', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>NOTIFICATIONS</Typography>
          {unreadCount > 0 && <Typography sx={{ fontSize: '9px', fontWeight: 600, color: 'secondary.main' }}>{unreadCount} NEW</Typography>}
        </Box>
        <Box sx={{ maxHeight: 340, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '10px' } }}>
          <List sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Bell size={24} color={theme.palette.divider} />
                <Typography sx={{ mt: 1, fontSize: '11px', color: 'text.secondary' }}>No new updates</Typography>
              </Box>
            ) : (
              notifications.slice(0, 4).map((notif, idx) => (
                <React.Fragment key={notif.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 2,
                      px: 2,
                      cursor: 'pointer',
                      bgcolor: notif.isRead ? 'transparent' : 'rgba(212, 175, 55, 0.03)',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar src={notif.fromUserAvatar} sx={{ width: 36, height: 36, border: `1px solid ${theme.palette.divider}` }} />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            bgcolor: 'background.paper',
                            borderRadius: '50%',
                            p: 0.4,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getNotifIcon(notif.type, theme)}
                        </Box>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography component="span" sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary', display: 'block' }}>
                          {notif.fromUserName} <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>{notif.message}</Box>
                        </Typography>
                      }
                      secondary={
                        <Typography component="span" sx={{ fontSize: '9px', color: 'text.secondary', mt: 0.5, fontWeight: 600, opacity: 0.6, display: 'block' }}>{notif.timeAgo}</Typography>
                      }
                    />
                  </ListItem>
                  {idx < Math.min(notifications.length, 4) - 1 && <Divider component="li" sx={{ borderColor: theme.palette.divider, mx: 2 }} />}
                </React.Fragment>
              ))
            )}
          </List>
        </Box>
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            fullWidth
            onClick={() => {
              handleCloseNotifications();
              navigate(ROUTES.NOTIFICATIONS);
            }}
            sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}
          >
            View All Activity
          </Button>
        </Box>
      </Popover>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 320 }, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' } }}
      >
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {salonAvatarUrl ? (
                <Box component="img" src={getFullImageUrl(salonAvatarUrl)} alt={salonName} sx={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: 32, height: 32, bgcolor: isDarkMode ? '#1E293B' : '#0F172A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.4 9.6H22L15.8 14.2L18.2 21.8L12 17.2L5.8 21.8L8.2 14.2L2 9.6H9.6L12 2Z" fill="#EAB308" />
                  </svg>
                </Box>
              )}
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {salonName}
              </Typography>
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <X size={24} />
            </IconButton>
          </Stack>
          <List>
            <Typography variant="caption" sx={{ px: 2, fontWeight: 900, color: '#EAB308', letterSpacing: '0.1em' }}>
              MAIN CONSOLE
            </Typography>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNav(item.id)} selected={currentView === item.id} sx={{ borderRadius: '12px' }}>
                  <ListItemIcon sx={{ minWidth: 40, color: currentView === item.id ? '#EAB308' : 'text.secondary' }}>{icons[item.id]}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 800, fontSize: '15px' }} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" sx={{ px: 2, fontWeight: 900, color: '#EAB308', letterSpacing: '0.1em' }}>
              GOVERNANCE & CLIENTS
            </Typography>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => handleNav(item.id)} selected={currentView === item.id} sx={{ borderRadius: '12px' }}>
                  <ListItemIcon sx={{ minWidth: 40, color: currentView === item.id ? '#EAB308' : 'text.secondary' }}>{icons[item.id]}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 800, fontSize: '15px' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Stack spacing={2}>
            <Button fullWidth variant="outlined" onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} startIcon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />} sx={{ py: 1.5, borderRadius: '16px', fontWeight: 900, borderColor: 'divider' }}>
              {isDarkMode ? 'Light Flow' : 'Dark Vault'}
            </Button>
            <Button fullWidth variant="contained" color="error" startIcon={<LogOut size={20} />} onClick={handleLogout} sx={{ py: 1.5, borderRadius: '16px', fontWeight: 900 }}>
              Exit Sanctuary Vault
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TopNavbar;
