import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

interface HeaderSectionProps {
  onBack: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ onBack }) => {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={onBack} size="small">
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Salon Profile
        </Typography>
      </Stack>
    </Box>
  );
};
