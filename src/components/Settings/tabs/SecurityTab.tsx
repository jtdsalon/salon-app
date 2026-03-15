import React, { useState } from 'react';
import { Grid2, Stack, Paper, Typography, Box, TextField, Button, Divider, Switch, Chip, alpha, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Lock, Monitor, Smartphone, Download, Trash2, AlertCircle } from 'lucide-react';

interface SecurityTabProps {
  userData: any;
  setUserData: (data: any) => void;
  isDark: boolean;
  onTwoFactorToggle: (enabled: boolean) => void;
  onPasswordChange: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
  updating?: boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ userData, setUserData, isDark, onTwoFactorToggle, onPasswordChange, updating }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordError, setShowPasswordError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const sessions = [
    { device: 'macOS Monterey • Chrome', location: 'San Francisco, USA', active: true, icon: <Monitor size={20} /> },
    { device: 'iPhone 15 Pro • Safari', location: 'San Francisco, USA', active: false, icon: <Smartphone size={20} /> },
  ];

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setShowPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setShowPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setShowPasswordError('Password must be at least 8 characters long');
      return;
    }

    setShowPasswordError('');
    onPasswordChange(passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTwoFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTwoFactorToggle(e.target.checked);
  };

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, lg: 7 }}>
        <Stack spacing={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Password & Security</Typography>
            
            <Stack spacing={4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 2, display: 'block' }}>CHANGE PASSWORD</Typography>
                <Stack spacing={2}>
                  <TextField 
                    fullWidth 
                    type="password" 
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    disabled={updating}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
                  />
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField 
                        fullWidth 
                        type="password" 
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        disabled={updating}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField 
                        fullWidth 
                        type="password" 
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        disabled={updating}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
                      />
                    </Grid2>
                  </Grid2>
                  {showPasswordError && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: alpha('#F43F5E', 0.1), borderRadius: '12px', color: '#F43F5E' }}>
                      <AlertCircle size={16} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{showPasswordError}</Typography>
                    </Box>
                  )}
                </Stack>
                <Button 
                  variant="outlined" 
                  onClick={handlePasswordChange}
                  disabled={updating}
                  sx={{ mt: 2, borderRadius: '100px', fontWeight: 900, borderColor: 'divider', color: 'text.primary' }}
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '15px' }}>Two-Factor Authentication</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Adds an extra layer of security to your account.</Typography>
                </Box>
                <Switch 
                  checked={userData.twoFactor} 
                  onChange={handleTwoFactorChange}
                  disabled={updating}
                />
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: '#F43F5E', bgcolor: alpha('#F43F5E', 0.02) }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: '#F43F5E' }}>Delete Account</Typography>
            <Typography variant="body2" sx={{ mb: 3, fontWeight: 600, color: 'text.secondary' }}>This action cannot be undone. All your data will be permanently removed.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Download size={16} />} 
                sx={{ borderRadius: '100px', fontWeight: 900, border: '2px solid' }}
              >
                Download My Data
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<Trash2 size={16} />}
                onClick={() => setDeleteConfirmOpen(true)}
                sx={{ borderRadius: '100px', fontWeight: 900, bgcolor: '#F43F5E' }}
              >
                Delete Account
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Grid2>

      <Grid2 size={{ xs: 12, lg: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Active Sessions</Typography>
          <Stack spacing={3}>
            {sessions.map((session, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: alpha('#EAB308', 0.1), borderRadius: '10px', color: '#EAB308' }}>
                    {session.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>{session.device}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{session.location}</Typography>
                  </Box>
                </Stack>
                {session.active ? (
                  <Chip label="THIS DEVICE" size="small" sx={{ bgcolor: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 900, fontSize: '9px' }} />
                ) : (
                  <Button size="small" sx={{ fontWeight: 900, color: '#F43F5E' }}>Logout</Button>
                )}
              </Box>
            ))}
          </Stack>
          <Button fullWidth variant="outlined" sx={{ mt: 4, borderRadius: '12px', fontWeight: 900, borderColor: 'divider', color: 'text.secondary' }}>Logout of all other sessions</Button>
        </Paper>
      </Grid2>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#F43F5E' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              This action cannot be undone. Please enter your password to confirm account deletion.
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={updating}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ fontWeight: 900 }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={!deletePassword || updating}
            sx={{ fontWeight: 900, bgcolor: '#F43F5E' }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default SecurityTab;