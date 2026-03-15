import React from 'react';
import { Box, Typography, Stack, IconButton, Button, alpha, useTheme } from '@mui/material';
import { X, AlertTriangle } from 'lucide-react';

export type OnboardingBannerType = 'profile_incomplete' | 'services_min';

interface OnboardingBannerProps {
  type: OnboardingBannerType;
  onClose: () => void;
  onAction: () => void;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ type, onClose, onAction }) => {
  const theme = useTheme();

  const getBannerConfig = () => {
    switch (type) {
      case 'profile_incomplete':
        return {
          icon: <AlertTriangle size={18} />,
          message: 'Please complete your Salon Profile. Customers cannot book services until your profile is updated.',
          buttonLabel: 'Complete Profile',
          bgColor: alpha('#EAB308', 0.1),
          borderColor: alpha('#EAB308', 0.2),
          iconColor: '#EAB308',
        };
      case 'services_min':
        return {
          icon: <AlertTriangle size={18} />,
          message: 'Please add at least 3 services in your Service Menu. Customers cannot book your salon until services are available.',
          buttonLabel: 'Add Services',
          bgColor: alpha('#EAB308', 0.1),
          borderColor: alpha('#EAB308', 0.2),
          iconColor: '#EAB308',
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
        className: 'animate-slideDown',
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
          <Box sx={{ color: config.iconColor, display: 'flex' }}>{config.icon}</Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            {config.message}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="contained"
            onClick={onAction}
            sx={{
              bgcolor: config.iconColor,
              color: '#050914',
              fontWeight: 800,
              fontSize: '11px',
              px: 2,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: alpha(config.iconColor, 0.8),
              },
            }}
          >
            {config.buttonLabel}
          </Button>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) },
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OnboardingBanner;
