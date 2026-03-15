import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthAction } from '@/components/Auth/hooks/useAuthAction';
import { getCategories } from '@/state/salon/getCategories';
import authService from '@/services/api/authService';
import type { RootState } from '@/state/store';

type AuthMode = 'login' | 'signup' | 'forgot';

interface FormState {
  email: string;
  password: string;
  salonName: string;
  artisanName: string;
  category: string;
  phone: string;
  agreedToTerms: boolean;
}

export interface UseAuthCallbacks {
  onLogin: () => void;
  onVerificationComplete?: (salonId: string | undefined) => void;
}

export const useAuth = (callbacks: UseAuthCallbacks | (() => void)) => {
  const dispatch = useDispatch();
  const { login, register, user, loading: authLoading, error: authError, clearError } = useAuthAction();
  const onLogin = typeof callbacks === 'function' ? callbacks : callbacks.onLogin;
  const onVerificationComplete = typeof callbacks === 'function' ? undefined : callbacks?.onVerificationComplete;
  const { categories, categoriesLoading } = useSelector((state: RootState) => state.salon);
  const awaitingRegisterSuccess = useRef(false);

  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    salonName: '',
    artisanName: '',
    category: '',
    phone: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Show auth error. Signup: inline in form + snackbar. Login: inline in form. Stay on form, preserve input.
  useEffect(() => {
    if (authError) {
      if (awaitingRegisterSuccess.current) {
        awaitingRegisterSuccess.current = false;
      }
      if (mode === 'signup') {
        setSnackbar({ open: true, message: authError, severity: 'error' });
      }
    }
  }, [authError, mode]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) =>
    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);

  const handleAction = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (mode === 'login') {
        if (!formState.email) newErrors.email = 'Email ritual required.';
        else if (!validateEmail(formState.email)) newErrors.email = 'Invalid email identity.';
        if (!formState.password) newErrors.password = 'Cipher required.';
      } else if (mode === 'signup') {
        if (!formState.salonName) newErrors.salonName = 'Sanctuary name required.';
        if (!formState.artisanName) newErrors.artisanName = 'Primary artisan required.';
        if (!formState.category) newErrors.category = 'Sanctuary category required.';
        if (!formState.phone) newErrors.phone = 'Contact number required.';
        else if (!validatePhone(formState.phone)) newErrors.phone = 'Invalid phone format.';
        if (!formState.email) newErrors.email = 'Email identity required.';
        else if (!validateEmail(formState.email)) newErrors.email = 'Invalid email identity.';
        if (!formState.password) newErrors.password = 'Cipher required.';
        else if (formState.password.length < 8) newErrors.password = 'Cipher must be at least 8 runes.';
        if (!formState.agreedToTerms) newErrors.terms = 'Manifesto must be acknowledged.';
      } else if (mode === 'forgot') {
        if (!formState.email) newErrors.email = 'Email identity required.';
        else if (!validateEmail(formState.email)) newErrors.email = 'Invalid email identity.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      if (mode === 'login') {
        login({ email: formState.email, password: formState.password });
      } else if (mode === 'signup') {
        awaitingRegisterSuccess.current = true;
        register({
          email: formState.email,
          password: formState.password,
          firstName: formState.artisanName,
          lastName: formState.salonName,
          phone: formState.phone,
          category: formState.category,
        });
      } else if (mode === 'forgot') {
        try {
          await authService.forgotPassword(formState.email);
          setSnackbar({ open: true, message: 'If an account exists, you will receive a reset link.', severity: 'success' });
          setMode('login');
        } catch (err: unknown) {
          const e = err as { response?: { data?: { message?: string } }; message?: string; errorMessage?: string };
          const msg = e?.response?.data?.message ?? e?.errorMessage ?? e?.message ?? 'Failed to send reset link.';
          setSnackbar({ open: true, message: msg, severity: 'error' });
        }
      }
    },
    [mode, formState, login, register]
  );

  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setErrors({});
      clearError();
    },
    [clearError]
  );

  const updateFormField = useCallback(
    (field: keyof FormState, value: string | boolean) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (authError) clearError();
    },
    [authError, clearError]
  );

  return {
    mode,
    formState,
    errors,
    authError,
    showPassword,
    isLoading: authLoading,
    isManifestoOpen,
    snackbar,
    categories,
    categoriesLoading,
    handleAction,
    switchMode,
    updateFormField,
    setShowPassword,
    setAgreedToTerms: (value: boolean) => updateFormField('agreedToTerms', value),
    setIsManifestoOpen,
    setSnackbar,
  };
};
