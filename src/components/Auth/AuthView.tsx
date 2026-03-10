import React from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Container,
} from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { ManifestoDialog } from './components/ManifestoDialog';
import { HeroSection } from './components/HeroSection';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

interface AuthViewProps {
  onLogin: () => void;
  onVerificationComplete?: (salonId: string | undefined) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onVerificationComplete }) => {
  const {
    mode,
    formState,
    errors,
    authError,
    isLoading,
    snackbar,
    isManifestoOpen,
    categories,
    categoriesLoading,
    handleAction,
    switchMode,
    updateFormField,
    setShowPassword,
    showPassword,
    setAgreedToTerms,
    setIsManifestoOpen,
    setSnackbar,
  } = useAuth({ onLogin, onVerificationComplete });

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            email={formState.email}
            password={formState.password}
            errors={errors}
            loginError={authError}
            isLoading={isLoading}
            showPassword={showPassword}
            onEmailChange={(value) => updateFormField('email', value)}
            onPasswordChange={(value) => updateFormField('password', value)}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleAction}
            onSwitchToSignup={() => switchMode('signup')}
            onSwitchToForgot={() => switchMode('forgot')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            email={formState.email}
            password={formState.password}
            salonName={formState.salonName}
            artisanName={formState.artisanName}
            category={formState.category}
            phone={formState.phone}
            categories={categories}
            categoriesLoading={categoriesLoading}
            agreedToTerms={formState.agreedToTerms}
            errors={errors}
            authError={authError}
            isLoading={isLoading}
            onEmailChange={(value) => updateFormField('email', value)}
            onPasswordChange={(value) => updateFormField('password', value)}
            onSalonNameChange={(value) => updateFormField('salonName', value)}
            onArtisanNameChange={(value) => updateFormField('artisanName', value)}
            onCategoryChange={(value) => updateFormField('category', value)}
            onPhoneChange={(value) => updateFormField('phone', value)}
            onAgreedToTermsChange={(value) => updateFormField('agreedToTerms', value)}
            onSubmit={handleAction}
            onSwitchToLogin={() => switchMode('login')}
            onOpenManifesto={() => setIsManifestoOpen(true)}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            email={formState.email}
            errors={errors}
            isLoading={isLoading}
            onEmailChange={(value) => updateFormField('email', value)}
            onSubmit={handleAction}
            onSwitchToLogin={() => switchMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <HeroSection />
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        px: { xs: 4, sm: 8, lg: 12 }, 
        bgcolor: 'background.paper',
        overflow: 'auto'
      }}>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box sx={{ maxWidth: 440, mx: 'auto', width: '100%' }}>
            {renderForm()}
          </Box>
        </Container>
      </Box>

      <ManifestoDialog
        open={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsManifestoOpen(false);
        }}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ borderRadius: '100px', fontWeight: 800 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthView;