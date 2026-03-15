import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { textFieldProps } from '../constants/auth';
import { ACCENT_COLOR } from '@/lib/constants/theme';

interface LoginFormProps {
    email: string;
    password: string;
    errors: Record<string, string>;
    loginError?: string | null;
    isLoading: boolean;
    showPassword: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onTogglePassword: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onSwitchToSignup: () => void;
    onSwitchToForgot: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    email,
    password,
    errors,
    loginError,
    isLoading,
    showPassword,
    onEmailChange,
    onPasswordChange,
    onTogglePassword,
    onSubmit,
    onSwitchToSignup,
    onSwitchToForgot,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Stack spacing={4} className="animate-fadeIn" sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
                    Sign <Box component="span" sx={{ color: ACCENT_COLOR }}>In</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Access your dashboard and manage your salon.
                </Typography>
            </Box>

            {loginError && (
                <Alert severity="error" icon={<AlertCircle size={18} />} sx={{ borderRadius: '14px' }}>
                    {loginError}
                </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                <Stack spacing={2.5} sx={{ width: '100%', boxSizing: 'border-box', px: 1 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        {...textFieldProps}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment>,
                            sx: { borderRadius: '20px' }
                        }}
                    />
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        {...textFieldProps}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock size={18} /></InputAdornment>,
                            endAdornment: (
                                <IconButton size="small" onClick={onTogglePassword}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                            ),
                            sx: { borderRadius: '20px' }
                        }}
                    />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <FormControlLabel
                            control={<Checkbox size="small" sx={{ color: 'divider', '&.Mui-checked': { color: ACCENT_COLOR } }} />}
                            label={<Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Remember me</Typography>}
                        />
                        <Button
                            size="small"
                            onClick={onSwitchToForgot}
                            sx={{ color: ACCENT_COLOR, fontWeight: 800, fontSize: '12px', textTransform: 'none' }}
                        >
                            Forgot password?
                        </Button>
                    </Stack>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={isLoading}
                        sx={{ borderRadius: '100px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                </Stack>
            </form>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Don't have an account?{' '}
                    <Button
                        onClick={onSwitchToSignup}
                        sx={{ color: '#EAB308', fontWeight: 900, p: 0, minWidth: 'auto', textTransform: 'none', '&:hover': { color: '#ca9b07', bgcolor: 'transparent' } }}
                    >
                        Sign up
                    </Button>
                </Typography>
            </Box>
        </Stack>
    );
};