import React, { useRef, useEffect } from 'react';
import { 
  Grid2, Stack, Paper, Typography, Box, Avatar, IconButton, Chip, TextField, Button, 
  List, ListItem, ListItemIcon, ListItemText, alpha, CircularProgress, InputAdornment 
} from '@mui/material';
import { Camera, User } from 'lucide-react';
import type { ActivityLog } from '@/state/settings/types';
import { getActivityIcon, formatActivityDate } from '../activityUtils';

interface IdentityTabProps {
  userData: any;
  setUserData: (data: any) => void;
  originalEmail: string;
  isSaving: boolean;
  onSave: () => void;
  isDark: boolean;
  loading?: boolean;
  activityLog?: ActivityLog[];
  /** True while the activity log is being fetched (card shows loading until done) */
  activityLoading?: boolean;
  /** URL to show for the avatar (saved URL or preview from new selection) */
  avatarDisplayUrl?: string | null;
  /** Called when user selects an image file */
  onAvatarSelect?: (file: File) => void;
  /** Called when user clicks VIEW ALL ACTIVITY */
  onViewAllActivity?: () => void;
}

const IdentityTab: React.FC<IdentityTabProps> = ({
  userData,
  setUserData,
  originalEmail,
  isSaving,
  onSave,
  isDark,
  loading,
  activityLog = [],
  activityLoading = false,
  avatarDisplayUrl,
  onAvatarSelect,
  onViewAllActivity,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onAvatarSelect?.(file);
    }
    e.target.value = '';
  };

  const displayItems = activityLoading ? [] : activityLog.map((item) => ({
    action: item.action || 'Activity',
    date: formatActivityDate(item.createdAt),
    icon: getActivityIcon(item.action || '', item.targetType || ''),
  }));
  const showActivityLoading = activityLoading && activityLog.length === 0;
  const showEmptyState = !activityLoading && activityLog.length === 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, lg: 7 }}>
        <Stack spacing={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Public Profile</Typography>
            
            <Stack spacing={3}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box sx={{ position: 'relative' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  <Avatar 
                    src={avatarDisplayUrl || undefined} 
                    sx={{ width: 100, height: 100, border: '4px solid #EAB308' }} 
                  >
                    {(userData.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <IconButton 
                    onClick={handleAvatarButtonClick}
                    disabled={isSaving}
                    sx={{ 
                      position: 'absolute', bottom: 0, right: 0, 
                      bgcolor: '#EAB308', color: '#050914',
                      '&:hover': { bgcolor: '#FACC15' },
                      width: 32, height: 32,
                      border: `3px solid ${isDark ? '#0B1224' : 'white'}`
                    }}
                    size="small"
                    aria-label="Change profile photo"
                  >
                    <Camera size={14} />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>{userData.name || 'User'}</Typography>
                  <Chip label="ADMINISTRATOR" size="small" sx={{ bgcolor: alpha('#EAB308', 0.1), color: '#EAB308', fontWeight: 900, fontSize: '10px', borderRadius: '6px', mt: 1 }} />
                </Box>
              </Stack>

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>FULL NAME</Typography>
                  <TextField 
                    fullWidth 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})} 
                    disabled={isSaving}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>EMAIL ADDRESS</Typography>
                  <TextField 
                    fullWidth 
                    value={userData.email} 
                    onChange={(e) => setUserData({...userData, email: e.target.value})} 
                    disabled={isSaving}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
                    helperText={userData.email !== originalEmail ? "Check your email for a verification code after saving" : ""}
                    FormHelperTextProps={{ sx: { fontWeight: 700, color: '#EAB308' } }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>CONTACT NUMBER</Typography>
                  <TextField 
                    fullWidth 
                    label=""
                    placeholder="077 XXX XXXX"
                    value={userData.phone} 
                    onChange={(e) => setUserData({...userData, phone: e.target.value})} 
                    disabled={isSaving}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>+94</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>BIO</Typography>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={3} 
                    value={userData.bio} 
                    onChange={(e) => setUserData({...userData, bio: e.target.value})} 
                    disabled={isSaving}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '18px' } }} 
                  />
                </Grid2>
              </Grid2>

              <Button 
                variant="contained" 
                disableElevation 
                onClick={onSave}
                disabled={isSaving}
                sx={{ py: 1.8, px: 6, borderRadius: '100px', bgcolor: isDark ? 'white' : '#0F172A', color: isDark ? '#050914' : 'white', fontWeight: 900, width: 'fit-content' }}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Saving Changes...
                  </>
                ) : userData.email !== originalEmail ? 'Verify & Save' : 'Save Profile'}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Grid2>

      <Grid2 size={{ xs: 12, lg: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Recent Activity</Typography>
          {showActivityLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: '#EAB308' }} />
            </Box>
          ) : showEmptyState ? (
            <Typography color="text.secondary" sx={{ py: 3, fontWeight: 600, fontSize: '13px' }}>
              No recent activity.
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {displayItems.map((item, i) => (
                <ListItem key={i} sx={{ px: 0, py: 1.5, borderBottom: i < displayItems.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <ListItemIcon sx={{ minWidth: 32, color: '#EAB308' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.action} 
                    secondary={item.date} 
                    primaryTypographyProps={{ fontWeight: 800, fontSize: '13px' }}
                    secondaryTypographyProps={{ fontWeight: 600, fontSize: '11px' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button fullWidth sx={{ mt: 2, fontWeight: 900, color: '#EAB308', fontSize: '11px' }} onClick={onViewAllActivity}>VIEW ALL ACTIVITY</Button>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default IdentityTab;
