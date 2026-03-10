
import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box, 
  Typography, TextField, Button, CircularProgress, alpha 
} from '@mui/material';
import { Shield } from 'lucide-react';

interface VerificationVaultProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onVerified: (otp: string) => void;
  isSaving: boolean;
  isDark: boolean;
  /** Sample code for dev (email not implemented). Shown as hint when provided. */
  sampleCode?: string;
}

const VerificationVault: React.FC<VerificationVaultProps> = ({ open, onClose, email, onVerified, isSaving, isDark, sampleCode }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '32px',
          bgcolor: isDark ? '#0B1224' : 'white',
          backgroundImage: 'none',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ 
          width: 64, height: 64, 
          bgcolor: alpha('#EAB308', 0.1), 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}>
          <Shield size={32} color="#EAB308" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>Verify <span style={{ color: '#EAB308' }}>Email</span></Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 4 }}>
          Enter the 6-digit code sent to <Box component="span" sx={{ color: isDark ? 'white' : 'black', fontWeight: 800 }}>{email}</Box> to confirm your new email.
        </Typography>
        {sampleCode && (
          <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#EAB308' }}>
            Dev: use <strong>{sampleCode}</strong> (email not implemented yet)
          </Typography>
        )}

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (otpInputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              variant="outlined"
              autoComplete="one-time-code"
              InputProps={{
                sx: {
                  width: 45,
                  height: 55,
                  borderRadius: '12px',
                  bgcolor: isDark ? '#161F33' : '#F8FAFC',
                  fontSize: '20px',
                  fontWeight: 900,
                  textAlign: 'center',
                  '& fieldset': { borderColor: digit ? '#EAB308' : 'divider' },
                },
                inputProps: { style: { textAlign: 'center', padding: 0 } }
              }}
            />
          ))}
        </Stack>

        <Button 
          fullWidth 
          variant="contained" 
          disableElevation
          onClick={() => onVerified(otp.join(''))}
          disabled={otp.join('').length < 6 || isSaving}
          sx={{ 
            py: 2, 
            borderRadius: '100px', 
            bgcolor: isDark ? 'white' : '#0F172A', 
            color: isDark ? '#050914' : 'white', 
            fontWeight: 900 
          }}
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : 'CONFIRM & SAVE'}
        </Button>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
         <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#EAB308' } }}>
           RESEND CODE
         </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationVault;
