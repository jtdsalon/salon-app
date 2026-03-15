import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box, Typography, Button, alpha } from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { Vacancy } from '../types';

interface StatusConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vacancy: Vacancy | null;
  isDark: boolean;
  isLoading?: boolean;
}

const StatusConfirm: React.FC<StatusConfirmProps> = ({ open, onClose, onConfirm, vacancy, isDark, isLoading }) => {
  if (!vacancy) return null;
  
  const targetStatus = vacancy.status === 'Open' ? 'Closed' : 'Open';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: isDark ? '#0B1224' : 'white',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'divider'}`,
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ p: 3, textAlign: 'center' }}>
        <Stack alignItems="center" spacing={1.5}>
          <Box sx={{ p: 1.5, bgcolor: alpha('#EAB308', 0.1), borderRadius: '50%' }}>
            <AlertCircle size={24} color="#EAB308" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Update Status?</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 3, textAlign: 'center', pt: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.8 }}>
          Are you sure you want to change the status of <strong>{vacancy.title}</strong> to <strong>{targetStatus}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 1.5 }}>
        <Button 
          onClick={onClose}
          disabled={isLoading}
          sx={{ fontWeight: 800, borderRadius: '10px', px: 3, color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onConfirm}
          disabled={isLoading}
          sx={{ 
            bgcolor: vacancy.status === 'Open' ? '#F43F5E' : '#10B981', 
            color: 'white',
            fontWeight: 800, 
            borderRadius: '10px', 
            px: 3,
            '&:hover': {
              bgcolor: vacancy.status === 'Open' ? '#E11D48' : '#059669',
            },
            '&:disabled': { opacity: 0.7, cursor: 'not-allowed' }
          }}
        >
          {isLoading ? 'Updating...' : 'Confirm Change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusConfirm;
