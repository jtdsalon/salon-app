import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Sparkles,
  MessageCircle,
  UserPlus,
  AtSign,
  Trash2,
  CheckCheck,
  Bell,
  ChevronRight,
  X,
  Calendar,
  Info,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '@/lib/util/imageUrl';
import { useNotifications } from '@/components/common/layouts/NotificationContext';
import type { AppNotification } from '@/components/common/layouts/NotificationContext';
import { ROUTES } from '@/routes/routeConfig';

const NotificationsView: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';
  const { notifications, unreadCount, loading, fetchError, fetchNotifications, markAllRead, markAsRead, removeNotification, clearAll } = useNotifications();
  const [tabValue, setTabValue] = useState(0);

  const filteredNotifications = useMemo(() => {
    switch (tabValue) {
      case 1:
        return notifications.filter((n) =>
          ['booking_new', 'booking_confirmed', 'booking_rescheduled', 'booking_cancelled', 'cancellation_customer', 'cancellation_salon', 'cancellation_system'].includes(n.type)
        );
      case 2:
        return notifications.filter((n) =>
          ['job_application_new', 'job_application_approved', 'job_application_rejected'].includes(n.type)
        );
      case 3:
        return notifications.filter((n) =>
          ['review_new', 'rating_new', 'reply_to_review'].includes(n.type)
        );
      default:
        return notifications;
    }
  }, [notifications, tabValue]);

  const handleMarkAllRead = () => markAllRead();
  const handleClearAll = () => clearAll();
  const handleDelete = (id: string) => removeNotification(id);

  const isBookingType = (type: string) =>
    ['booking_new', 'booking_confirmed', 'booking_rescheduled', 'booking_cancelled', 'cancellation_customer', 'cancellation_salon', 'cancellation_system'].includes(type);

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.isRead) markAsRead(notif.id);
    // Booking notifications: go to schedule and optionally open the related booking
    if (notif.bookingId || isBookingType(notif.type)) {
      navigate(ROUTES.SCHEDULE, { state: notif.bookingId ? { openBookingId: notif.bookingId } : undefined });
      return;
    }
    if (notif.navigationTarget && !notif.navigationTarget.startsWith('/bookings/')) {
      navigate(notif.navigationTarget);
      return;
    }
    if (notif.postId) {
      navigate(`/post/${notif.postId}`);
    } else if (notif.jobId) {
      navigate(ROUTES.VACANCIES);
    } else if (notif.reviewId) {
      navigate(ROUTES.SALON_PROFILE);
    }
  };

  const getNotifIcon = (type: string) => {
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
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', pt: 6, mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 400, color: 'text.primary', mb: 0.5, letterSpacing: '0.5em' }}>ACTIVITY</Typography>
          <Typography sx={{ fontSize: '8px', fontWeight: 900, color: 'secondary.main', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Your Aesthetic Interactions</Typography>
        </Box>

        {/* Global Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: 'text.primary' }}>
              {unreadCount} UNREAD
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              startIcon={<CheckCheck size={14} />}
              onClick={handleMarkAllRead}
              disabled={notifications.every(n => n.isRead)}
              sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary' }}
            >
              MARK ALL READ
            </Button>
            <Button 
              size="small" 
              startIcon={<Trash2 size={14} />}
              onClick={handleClearAll}
              sx={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}
            >
              CLEAR ARCHIVE
            </Button>
          </Stack>
        </Stack>

        {/* Filter Tabs */}
        <Box sx={{ mb: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, v) => setTabValue(v)}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: 'text.primary', height: 2 },
              '& .MuiTab-root': { 
                fontSize: '10px', 
                fontWeight: 800, 
                letterSpacing: '0.1em', 
                color: 'text.secondary',
                minWidth: 'auto',
                px: 2,
                py: 2
              },
              '& .Mui-selected': { color: `text.primary !important` }
            }}
          >
            <Tab label="ALL" />
            <Tab label="BOOKINGS" />
            <Tab label="JOBS" />
            <Tab label="REVIEWS" />
          </Tabs>
        </Box>

        {fetchError && (
          <Box sx={{ py: 2, px: 2, mb: 2, bgcolor: 'error.dark', color: 'error.contrastText', borderRadius: 2 }}>
            <Typography sx={{ fontSize: '12px' }}>{fetchError}</Typography>
          </Box>
        )}

        {/* Notifications List */}
        <Fade in timeout={600}>
          <Box>
            {loading ? (
              <Box sx={{ py: 12, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Loading...</Typography>
              </Box>
            ) : filteredNotifications.length === 0 ? (
              <Box sx={{ py: 12, textAlign: 'center' }}>
                <Bell size={48} color={theme.palette.divider} strokeWidth={1} style={{ marginBottom: 24 }} />
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontWeight: 300 }}>
                  Silence is beautiful. No notifications to show.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredNotifications.map((notif) => (
                  <ListItem 
                    key={notif.id}
                    disablePadding
                    secondaryAction={
                      <IconButton size="small" onClick={() => handleDelete(notif.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
                        <X size={14} />
                      </IconButton>
                    }
                    sx={{ 
                      mb: 1, 
                      borderRadius: '16px',
                      overflow: 'hidden',
                      bgcolor: notif.isRead ? 'transparent' : (isDarkMode ? 'rgba(226, 194, 117, 0.05)' : 'rgba(212, 175, 55, 0.03)'),
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemButton sx={{ py: 2, px: 2 }} onClick={() => handleNotificationClick(notif)}>
                      <ListItemAvatar sx={{ minWidth: 56 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar src={getFullImageUrl(notif.fromUserAvatar ?? '')} sx={{ width: 40, height: 40, border: `1px solid ${theme.palette.divider}` }} />
                          <Box sx={{ 
                            position: 'absolute', 
                            bottom: -2, 
                            right: -2, 
                            bgcolor: 'background.paper', 
                            borderRadius: '50%', 
                            p: 0.5, 
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getNotifIcon(notif.type)}
                          </Box>
                        </Box>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>
                            {notif.fromUserName} <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>{notif.message}</Box>
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Typography sx={{ fontSize: '10px', color: 'text.secondary', opacity: 0.6, fontWeight: 700 }}>{notif.timeAgo.toUpperCase()}</Typography>
                            {!notif.isRead && <Chip label="NEW" size="small" sx={{ height: 16, fontSize: '8px', fontWeight: 900, bgcolor: 'secondary.main', color: isDarkMode ? 'primary.main' : '#fff' }} />}
                          </Stack>
                        }
                      />
                      <ChevronRight size={16} color={theme.palette.divider} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default NotificationsView;
