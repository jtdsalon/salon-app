import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../state/auth';
import { useSettings } from '../../state/settings/useSettings';
import { ROUTES } from '@/routes/routeConfig';
import { getFullImageUrl } from '@/lib/util/imageUrl';
import { uploadPostImageApi } from '@/services/api/feedService';

// Modular Components
import IdentityTab from './tabs/IdentityTab';
import SecurityTab from './tabs/SecurityTab';
import NotificationsTab from './tabs/NotificationsTab';
import BillingTab from './tabs/BillingTab';
import VerificationVault from './dialogs/VerificationVault';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AccountSettings: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const { user, logout } = useAuthContext();
  const {
    settings,
    activityLog,
    activityLoading,
    loading,
    updating,
    deleting,
    error,
    success,
    successMessage,
    getUserSettings,
    updateUserSettings,
    updatePassword,
    updateNotifications,
    toggleTwoFactor,
    getActivityLog,
    deleteAccount,
    clearSuccess,
    clearError,
  } = useSettings();

  const [tabValue, setTabValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '' as string | undefined,
    twoFactor: false,
    notifs: {
      email: false,
      sms: false,
      system: false,
      marketing: false,
      newBookings: false,
      dailyReports: false,
      systemUpdates: false,
    }
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const avatarPreviewUrlRef = useRef<string | null>(null);

  // Fetch user settings on mount
  useEffect(() => {
    if (user?.id) {
      getUserSettings(user.id);
      getActivityLog(user.id, 10, 0);
    }
  }, [user?.id]);

  // Update local state when settings are fetched
  useEffect(() => {
    if (settings) {
      setUserData(prev => ({
        ...prev,
        name: settings.name || '',
        email: settings.email || '',
        phone: settings.phone || '',
        bio: settings.bio || '',
        avatar: settings.avatar,
        twoFactor: settings.twoFactor || false,
        notifs: settings.notifications || {
          email: false,
          sms: false,
          system: false,
          marketing: false,
          newBookings: false,
          dailyReports: false,
          systemUpdates: false,
        }
      }));
      setOriginalEmail(settings.email || '');
    }
  }, [settings]);

  // Revoke object URL when preview changes or unmount
  useEffect(() => {
    const prev = avatarPreviewUrlRef.current;
    if (prev) {
      URL.revokeObjectURL(prev);
    }
    avatarPreviewUrlRef.current = avatarPreviewUrl;
    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }
    };
  }, [avatarPreviewUrl]);

  // Show success/error notifications
  useEffect(() => {
    if (success && successMessage) {
      if (successMessage === 'Account deleted successfully') {
        clearSuccess();
        logout();
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }
      setNotificationType('success');
      setNotificationMessage(successMessage);
      setShowNotification(true);
      clearSuccess();
      if (isVerifyingEmail) setIsVerifyingEmail(false);
      if (successMessage === 'Settings updated successfully') {
        setIsSaving(false);
        setAvatarFile(null);
        setAvatarPreviewUrl(null);
      }
    }
  }, [success, successMessage, clearSuccess, logout, navigate]);

  useEffect(() => {
    if (error) {
      setIsSaving(false);
      setNotificationType('error');
      setNotificationMessage(error || 'An error occurred');
      setShowNotification(true);
      clearError();
    }
  }, [error]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    if (!user?.id) return;
    
    if (userData.email !== originalEmail) {
      setIsVerifyingEmail(true);
      return;
    }
    finalizeSave();
  };

  const finalizeSave = async (emailVerificationCode?: string) => {
    if (!user?.id) return;

    setIsSaving(true);
    let avatarUrl: string | undefined = userData.avatar;

    if (avatarFile) {
      try {
        const res = await uploadPostImageApi(avatarFile);
        const url = (res?.data as any)?.data?.url ?? (res?.data as any)?.url;
        if (url) avatarUrl = url;
      } catch (e: any) {
        setIsSaving(false);
        setNotificationType('error');
        setShowNotification(true);
        return;
      }
    }

    const data: Record<string, unknown> = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      ...(avatarUrl !== undefined && { avatar: avatarUrl }),
    };
    if (userData.email !== originalEmail && emailVerificationCode) {
      data.emailVerificationCode = emailVerificationCode;
    }
    updateUserSettings(user.id, data);
  };

  const handleSavePassword = (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (!user?.id) return;
    updatePassword(user.id, passwordData);
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    if (!user?.id) return;
    toggleTwoFactor(user.id, enabled);
    setUserData(prev => ({ ...prev, twoFactor: enabled }));
  };

  const handleSaveNotifications = () => {
    if (!user?.id) return;
    updateNotifications(user.id, userData.notifs);
  };

  const handleDeleteAccount = (password: string) => {
    if (!user?.id) return;
    deleteAccount(user.id, password);
  };

  const handleAvatarSelect = (file: File) => {
    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = null;
    }
    const url = URL.createObjectURL(file);
    setAvatarPreviewUrl(url);
    setAvatarFile(file);
  };

  const avatarDisplayUrl = avatarPreviewUrl ?? getFullImageUrl(userData.avatar) ?? undefined;

  return (
    <Box sx={{ pb: 10, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }} className="animate-fadeIn">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Account <Box component="span" sx={{ color: '#EAB308' }}>Settings</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Manage your profile, security settings, and app preferences.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          allowScrollButtonsMobile
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 900,
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              minWidth: { xs: 80, sm: 100 },
              mr: { xs: 1, sm: 2 }
            }
          }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="Billing" />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <IdentityTab 
          userData={userData} 
          setUserData={setUserData} 
          originalEmail={originalEmail} 
          isSaving={isSaving || updating} 
          onSave={handleSave} 
          isDark={isDark}
          loading={loading}
          activityLog={activityLog}
          activityLoading={activityLoading}
          avatarDisplayUrl={avatarDisplayUrl}
          onAvatarSelect={handleAvatarSelect}
          onViewAllActivity={() => navigate(ROUTES.ACCOUNT_SETTINGS_ACTIVITY)}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <SecurityTab 
          userData={userData} 
          setUserData={setUserData} 
          isDark={isDark}
          onTwoFactorToggle={handleTwoFactorToggle}
          onPasswordChange={handleSavePassword}
          onDeleteAccount={handleDeleteAccount}
          updating={updating}
          deleting={deleting}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <NotificationsTab 
          userData={userData}
          setUserData={setUserData}
          isDark={isDark}
          onSave={handleSaveNotifications}
          updating={updating}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={3}>
        <BillingTab isDark={isDark} />
      </CustomTabPanel>

      <VerificationVault 
        open={isVerifyingEmail} 
        onClose={() => setIsVerifyingEmail(false)} 
        email={userData.email} 
        onVerified={(otp) => finalizeSave(otp)} 
        isSaving={isSaving || updating} 
        isDark={isDark}
        sampleCode="123456"
      />

      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity={notificationType}
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountSettings;
