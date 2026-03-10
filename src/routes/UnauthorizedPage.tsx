import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthContext } from '@/state/auth';
import { ROUTES } from './routeConfig';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleBackToLogin = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              mb: 2,
            }}
          >
            <ShieldAlert size={40} />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
              Access Denied
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.6, fontWeight: 500 }}>
              You don&apos;t have permission to access the salon app. Only Salon Admins and Staff with granted access
              can use this application.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleBackToLogin}
            startIcon={<ArrowLeft size={18} />}
            sx={{
              borderRadius: '100px',
              px: 4,
              py: 1.5,
              bgcolor: 'text.primary',
              color: 'background.paper',
              fontWeight: 900,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            BACK TO LOGIN
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default UnauthorizedPage;
