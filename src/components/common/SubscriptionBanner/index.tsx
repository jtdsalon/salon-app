import React from 'react';
import { Box, Typography, Stack, IconButton, Button, alpha, useTheme } from '@mui/material';
import { X, AlertTriangle, Zap, Clock, CreditCard } from 'lucide-react';

export type BannerType = 'trial_ending' | 'payment_due' | 'expired';

interface SubscriptionBannerProps {
  type: BannerType;
  daysLeft?: number;
  onClose: () => void;
  onUpgrade: () => void;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ type, daysLeft, onClose, onUpgrade }) => {
  const theme = useTheme();

  const getBannerConfig = () => {
    switch (type) {
      case 'trial_ending':
        return {
          icon: <Clock size={18} />,
          message: `Your free membership ends in ${daysLeft} days. Upgrade now to keep your Pro features!`,
          buttonLabel: 'Upgrade Now',
          bgColor: alpha('#EAB308', 0.1),
          borderColor: alpha('#EAB308', 0.2),
          iconColor: '#EAB308'
        };
      case 'payment_due':
        return {
          icon: <CreditCard size={18} />,
          message: `Your next payment is due in ${daysLeft} days. Please ensure your billing info is up to date.`,
          buttonLabel: 'Manage Billing',
          bgColor: alpha('#3B82F6', 0.1),
          borderColor: alpha('#3B82F6', 0.2),
          iconColor: '#3B82F6'
        };
      case 'expired':
        return {
          icon: <AlertTriangle size={18} />,
          message: 'Your membership has expired. Some features may be restricted until you renew.',
          buttonLabel: 'Renew Now',
          bgColor: alpha('#EF4444', 0.1),
          borderColor: alpha('#EF4444', 0.2),
          iconColor: '#EF4444'
        };
    }
  };

  const config = getBannerConfig();

  return (
    <Box
      sx={{
        bgcolor: config.bgColor,
        borderBottom: `1px solid ${config.borderColor}`,
        py: 1.5,
        px: { xs: 2, md: 4 },
        position: 'relative',
        zIndex: 1100,
        className: 'animate-slideDown'
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 'xl', mx: 'auto' }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ color: config.iconColor, display: 'flex' }}>
            {config.icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {config.message}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="contained"
            onClick={onUpgrade}
            sx={{
              bgcolor: config.iconColor,
              color: type === 'payment_due' ? 'white' : '#050914',
              fontWeight: 800,
              fontSize: '11px',
              px: 2,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: alpha(config.iconColor, 0.8)
              }
            }}
          >
            {config.buttonLabel}
          </Button>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SubscriptionBanner;
