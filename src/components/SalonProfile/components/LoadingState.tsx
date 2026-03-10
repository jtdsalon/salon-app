import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

export const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        width: '100%',
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading salon profile...
        </Typography>
      </Stack>
    </Box>
  );
};
