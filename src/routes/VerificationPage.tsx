import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Container, Snackbar, Alert } from '@mui/material';
import { useAuthContext } from '@/state/auth';
import { VerificationForm } from '@/components/Auth/components/VerificationForm';
import { ROUTES } from './routeConfig';
import authService from '@/services/api/authService';

/**
 * Verification page - mandatory for users with is_verified === false.
 * Accessible after both signup and login when backend returns is_verified: false.
 * Sample code: 123456 (until email/SMS sending is implemented).
 */
const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySnackOpen, setVerifySnackOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    isVerified,
    isLoading,
    completeVerification,
  } = useAuthContext();

  if (isLoading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box className="animate-spin" sx={{ width: 40, height: 40, border: '3px solid', borderColor: 'divider', borderTopColor: 'secondary.main', borderRadius: '50%' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isVerified) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleVerifyComplete = async (emailCode: string, phoneCode: string) => {
    setVerifyError(null);
    try {
      const { user: updatedUser } = await authService.verifyOtp(emailCode, phoneCode);
      completeVerification(updatedUser);
      navigate(ROUTES.SALON_PROFILE, { replace: true, state: { salonId: updatedUser?.salonId, openSalonEdit: true } });
    } catch (err: unknown) {
      const errAny = err as { response?: { data?: { message?: string } }; errorMessage?: string; message?: string };
      const msg =
        errAny?.response?.data?.message ?? errAny?.errorMessage ?? (err as Error)?.message ?? 'Verification failed';
      setVerifyError(msg);
      setVerifySnackOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
      <Container maxWidth="sm">
        <VerificationForm
          email={user?.email ?? ''}
          phone={user?.phone ?? ''}
          onVerify={handleVerifyComplete}
          onResendEmail={async () => {
            await authService.resendVerificationEmail();
          }}
          onResendPhone={async () => {}}
          isLoading={isLoading}
          sampleCode="123456"
        />
      </Container>
      <Snackbar open={verifySnackOpen} autoHideDuration={5000} onClose={() => setVerifySnackOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setVerifySnackOpen(false)}>
          {verifyError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerificationPage;
