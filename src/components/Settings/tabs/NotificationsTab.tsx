import React from 'react';
import { Grid2, Paper, Typography, Stack, Box, Divider, Switch, alpha, Button, CircularProgress } from '@mui/material';
import { Bell } from 'lucide-react';

interface NotificationsTabProps {
  userData: any;
  setUserData: (data: any) => void;
  isDark: boolean;
  onSave: () => void;
  updating?: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ userData, setUserData, isDark, onSave, updating }) => {
  const handleNotificationChange = (key: string) => {
    setUserData({
      ...userData,
      notifs: {
        ...userData.notifs,
        [key]: !userData.notifs[key]
      }
    });
  };

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, md: 8, lg: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Notification Settings</Typography>
          <Stack spacing={4}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#EAB308', letterSpacing: '0.15em', mb: 3, display: 'block' }}>HOW WE REACH YOU</Typography>
              <Stack spacing={2.5}>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Detailed reports and appointment summaries.' },
                  { key: 'sms', label: 'Text Messages', desc: 'Instant alerts for booking changes.' },
                  { key: 'system', label: 'Push Notifications', desc: 'In-app alerts and browser notifications.' }
                ].map((channel) => (
                  <Box key={channel.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{channel.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{channel.desc}</Typography>
                    </Box>
                    <Switch 
                      checked={userData.notifs[channel.key]} 
                      onChange={() => handleNotificationChange(channel.key)}
                      disabled={updating}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
            
            <Divider />

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#EAB308', letterSpacing: '0.15em', mb: 3, display: 'block' }}>WHAT YOU GET NOTIFIED ABOUT</Typography>
              <Stack spacing={2.5}>
                {[
                  { key: 'newBookings', label: 'New Bookings', desc: 'When a customer schedules a new service.' },
                  { key: 'dailyReports', label: 'Daily Reports', desc: 'Daily summary of sales and revenue.' },
                  { key: 'systemUpdates', label: 'System Updates', desc: 'Important news about the salon portal.' }
                ].map((event) => (
                  <Box key={event.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{event.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{event.desc}</Typography>
                    </Box>
                    <Switch 
                      checked={userData.notifs[event.key]} 
                      onChange={() => handleNotificationChange(event.key)}
                      disabled={updating}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onSave}
            disabled={updating}
            sx={{ mt: 6, py: 1.8, borderRadius: '16px', bgcolor: isDark ? 'white' : '#0F172A', color: isDark ? '#050914' : 'white', fontWeight: 900 }}
          >
            {updating ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : 'Save Settings'}
          </Button>
        </Paper>
      </Grid2>
      
      <Grid2 size={{ xs: 12, md: 4, lg: 6 }}>
        <Box sx={{ p: 4, borderRadius: '40px', bgcolor: alpha('#EAB308', 0.05), border: '1px dashed', borderColor: '#EAB308' }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Bell size={48} color="#EAB308" />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>We respect your time</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.8, px: 4 }}>
              We only send high-priority notifications so you can stay focused on your work.
            </Typography>
          </Stack>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default NotificationsTab;
