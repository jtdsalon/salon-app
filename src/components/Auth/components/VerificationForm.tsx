import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Shield } from 'lucide-react';

interface VerificationFormProps {
  email: string;
  phone: string;
  onVerify: (emailCode: string, phoneCode: string) => void | Promise<void>;
  onResendEmail?: () => void | Promise<void>;
  onResendPhone?: () => void | Promise<void>;
  isLoading?: boolean;
  /** Sample code for dev (email/SMS not implemented). Shown as hint when provided. */
  sampleCode?: string;
}

const OTP_LENGTH = 6;

const RESEND_COOLDOWN_SEC = 60;

export const VerificationForm: React.FC<VerificationFormProps> = ({
  email,
  phone,
  onVerify,
  onResendEmail,
  onResendPhone,
  isLoading = false,
  sampleCode,
}) => {
  const [emailOtp, setEmailOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [phoneOtp, setPhoneOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendEmailCooldown, setResendEmailCooldown] = useState(0);
  const [resendPhoneCooldown, setResendPhoneCooldown] = useState(0);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendingPhone, setResendingPhone] = useState(false);
  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (
    index: number,
    value: string,
    otp: string[],
    setOtp: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const emailCode = emailOtp.join('');
  const phoneCode = phoneOtp.join('');
  const canSubmit = emailCode.length === OTP_LENGTH && phoneCode.length === OTP_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && !isLoading) {
      onVerify(emailCode, phoneCode);
    }
  };

  const startCooldown = (setCooldown: React.Dispatch<React.SetStateAction<number>>) => {
    setCooldown(RESEND_COOLDOWN_SEC);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendEmail = async () => {
    if (resendEmailCooldown > 0 || resendingEmail || !onResendEmail) return;
    setResendingEmail(true);
    try {
      await onResendEmail();
      startCooldown(setResendEmailCooldown);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleResendPhone = async () => {
    if (resendPhoneCooldown > 0 || resendingPhone || !onResendPhone) return;
    setResendingPhone(true);
    try {
      await onResendPhone();
      startCooldown(setResendPhoneCooldown);
    } finally {
      setResendingPhone(false);
    }
  };

  const otpInputSx = {
    width: 40,
    height: 48,
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 900,
    textAlign: 'center' as const,
    '& fieldset': { borderColor: 'divider' },
  };

  return (
    <Stack spacing={4} className="animate-fadeIn">
      <Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'rgba(234, 179, 8, 0.12)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Shield size={28} color="#EAB308" />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
          Verify <Box component="span" sx={{ color: 'secondary.main' }}>Email & Phone</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Enter the 6-digit codes sent to your email and phone to complete signup.
        </Typography>
        {sampleCode && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, fontWeight: 600, color: 'secondary.main' }}>
            Dev: use <strong>{sampleCode}</strong> for both codes (email/SMS not implemented yet)
          </Typography>
        )}
      </Box>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>
              EMAIL CODE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5 }}>
              Sent to <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{email}</Box>
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {emailOtp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => { emailRefs.current[index] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value, emailOtp, setEmailOtp, emailRefs)}
                  variant="outlined"
                  autoComplete="one-time-code"
                  InputProps={{
                    sx: otpInputSx,
                    inputProps: { style: { textAlign: 'center', padding: 0 }, maxLength: 1 },
                  }}
                />
              ))}
            </Stack>
            <Typography
              variant="caption"
              component="button"
              type="button"
              onClick={handleResendEmail}
              disabled={resendEmailCooldown > 0 || resendingEmail || !onResendEmail}
              sx={{
                mt: 1,
                fontWeight: 700,
                color: resendEmailCooldown > 0 || !onResendEmail ? 'text.disabled' : 'secondary.main',
                cursor: resendEmailCooldown > 0 || !onResendEmail ? 'default' : 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                '&:hover': resendEmailCooldown === 0 && onResendEmail ? { textDecoration: 'underline' } : {},
              }}
            >
              {resendingEmail ? 'Sending…' : resendEmailCooldown > 0 ? `Resend email (${resendEmailCooldown}s)` : 'Resend email code'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>
              PHONE CODE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5 }}>
              Sent to <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{phone}</Box>
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {phoneOtp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => { phoneRefs.current[index] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value, phoneOtp, setPhoneOtp, phoneRefs)}
                  variant="outlined"
                  autoComplete="one-time-code"
                  InputProps={{
                    sx: otpInputSx,
                    inputProps: { style: { textAlign: 'center', padding: 0 }, maxLength: 1 },
                  }}
                />
              ))}
            </Stack>
            <Typography
              variant="caption"
              component="button"
              type="button"
              onClick={handleResendPhone}
              disabled={resendPhoneCooldown > 0 || resendingPhone || !onResendPhone}
              sx={{
                mt: 1,
                fontWeight: 700,
                color: resendPhoneCooldown > 0 || !onResendPhone ? 'text.disabled' : 'secondary.main',
                cursor: resendPhoneCooldown > 0 || !onResendPhone ? 'default' : 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                '&:hover': resendPhoneCooldown === 0 && onResendPhone ? { textDecoration: 'underline' } : {},
              }}
            >
              {resendingPhone ? 'Sending…' : resendPhoneCooldown > 0 ? `Resend SMS (${resendPhoneCooldown}s)` : 'Resend phone code'}
            </Typography>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disableElevation
            disabled={!canSubmit || isLoading}
            sx={{ borderRadius: '100px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Continue'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
