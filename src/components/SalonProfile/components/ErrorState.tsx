import React from 'react';
import { Box, Typography, Button, Stack, Alert } from '@mui/material';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  onBack: () => void;
  salonId?: string | null;
  dispatch?: any;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onBack, salonId }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="center" sx={{ mt: 4 }}>
        <AlertTriangle size={64} color="#d32f2f" />
        <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Unable to Load Salon Profile
          </Typography>
          <Typography variant="body2">
            {salonId
              ? `Could not load salon with ID: ${salonId}`
              : 'No salon ID provided'}
          </Typography>
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowLeft size={18} />}
          onClick={onBack}
          sx={{ borderRadius: '100px' }}
        >
          Go Back
        </Button>
      </Stack>
    </Box>
  );
};
