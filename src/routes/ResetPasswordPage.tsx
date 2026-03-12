import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Stack, CircularProgress } from '@mui/material';
import { ROUTES } from './routeConfig';
import authService from '@/services/api/authService';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!password) next.password = 'Password required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    if (!token) {
      setErrors({ form: 'Invalid reset link.' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ?? (err as Error)?.message ?? 'Failed to reset password.';
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', color: 'success.main' }}>
            Password reset successfully. Redirecting to login…
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.04em' }}>
          Set new <Box component="span" sx={{ color: '#EAB308' }}>password</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your new password below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {errors.form && (
              <Typography variant="body2" color="error">{errors.form}</Typography>
            )}
            <TextField
              fullWidth
              type="password"
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              required
              autoComplete="new-password"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!errors.confirm}
              helperText={errors.confirm}
              required
              autoComplete="new-password"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ borderRadius: '12px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset password'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{ fontWeight: 700 }}
            >
              Back to login
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
