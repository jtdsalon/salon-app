import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    IconButton,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { ChevronLeft, Mail } from 'lucide-react';
import { textFieldProps } from '../constants/auth';

interface ForgotPasswordFormProps {
    email: string;
    errors: Record<string, string>;
    isLoading: boolean;
    onEmailChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    email,
    errors,
    isLoading,
    onEmailChange,
    onSubmit,
    onSwitchToLogin,
}) => {
    return (
        <Stack spacing={4} className="animate-fadeIn">
            <Box>
                <IconButton onClick={onSwitchToLogin} sx={{ ml: -1, mb: 2, color: 'text.secondary' }}>
                    <ChevronLeft size={24} />
                </IconButton>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
                    Forgot <Box component="span" sx={{ color: 'secondary.main' }}>Password</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Enter your email and we'll send you a reset link.
                </Typography>
            </Box>

            <form onSubmit={onSubmit} noValidate>
                <Stack spacing={3}>
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
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={isLoading}
                        sx={{ borderRadius: '100px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
};