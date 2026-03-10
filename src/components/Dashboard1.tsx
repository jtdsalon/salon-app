import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useAuthContext } from '@/state/auth';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    onLogout?.();
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'background.default' }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
              Welcome to Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hello, {user?.firstName} {user?.lastName}! 👋
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>User Info</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {user?.role || 'User'}
              </Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            endIcon={<LogOut size={18} />}
            onClick={handleLogout}
            sx={{
              borderRadius: '100px',
              bgcolor: 'error.main',
              color: 'white',
              fontWeight: 800,
              py: 1.5,
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Dashboard;