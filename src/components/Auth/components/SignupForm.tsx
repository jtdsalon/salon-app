import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    InputAdornment,
    MenuItem,
    Alert,
} from '@mui/material';
import { Mail, Lock, User, Building2, Tag } from 'lucide-react';
import { textFieldProps } from '../constants/auth';
import { ACCENT_COLOR, ACCENT_COLOR_DARK } from '@/lib/constants/theme';

interface SignupFormProps {
    email: string;
    password: string;
    salonName: string;
    artisanName: string;
    category: string;
    phone: string;
    categories: string[];
    categoriesLoading?: boolean;
    agreedToTerms: boolean;
    errors: Record<string, string>;
    authError?: string | null;
    isLoading: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSalonNameChange: (value: string) => void;
    onArtisanNameChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onAgreedToTermsChange: (value: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onSwitchToLogin: () => void;
    onOpenManifesto: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
    email,
    password,
    salonName,
    artisanName,
    category,
    phone,
    categories,
    categoriesLoading = false,
    agreedToTerms,
    errors,
    authError,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onSalonNameChange,
    onArtisanNameChange,
    onCategoryChange,
    onPhoneChange,
    onAgreedToTermsChange,
    onSubmit,
    onSwitchToLogin,
    onOpenManifesto,
}) => {
    return (
        <Stack
            spacing={{ xs: 3, sm: 4 }}
            className="animate-fadeIn"
            sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minWidth: 0 }}
        >
            <Box>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        mb: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        lineHeight: 1.2,
                    }}
                >
                    Create <Box component="span" sx={{ color: ACCENT_COLOR }}>Account</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Create your salon account to get started.
                </Typography>
            </Box>

            <form onSubmit={onSubmit} noValidate style={{ width: '100%', minWidth: 0 }}>
                <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                    <TextField
                        fullWidth
                        label="Salon Name"
                        value={salonName}
                        onChange={(e) => onSalonNameChange(e.target.value)}
                        error={!!errors.salonName}
                        helperText={errors.salonName}
                        {...textFieldProps}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Building2 size={18} /></InputAdornment>,
                            sx: { borderRadius: '20px' }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Your Name"
                        value={artisanName}
                        onChange={(e) => onArtisanNameChange(e.target.value)}
                        error={!!errors.artisanName}
                        helperText={errors.artisanName}
                        {...textFieldProps}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment>,
                            sx: { borderRadius: '20px' }
                        }}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            select
                            label="Salon Category"
                            value={category}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            error={!!errors.category}
                            helperText={errors.category}
                            disabled={categoriesLoading}
                            {...textFieldProps}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    {categoriesLoading ? <CircularProgress size={18} /> : <Tag size={18} />}
                                </InputAdornment>,
                                sx: { borderRadius: '20px' }
                            }}
                        >
                            <MenuItem value="">
                                <em>{categoriesLoading ? 'Loading...' : 'Select Category'}</em>
                            </MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Contact Number"
                            value={phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            placeholder="077 XXX XXXX"
                            {...textFieldProps}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>+94</Typography>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '20px' }
                            }}
                        />
                    </Stack>
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
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        {...textFieldProps}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock size={18} /></InputAdornment>,
                            sx: { borderRadius: '20px' }
                        }}
                    />

                    <Box
                        sx={{
                            p: { xs: 1.5, sm: 2.5 },
                            borderRadius: '16px',
                            bgcolor: errors.terms ? 'rgba(244, 63, 94, 0.05)' : 'action.hover',
                            border: '1.5px solid',
                            borderColor: errors.terms ? 'error.main' : 'divider',
                            transition: 'all 0.3s',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={agreedToTerms}
                                    onChange={(e) => onAgreedToTermsChange(e.target.checked)}
                                    sx={{ color: errors.terms ? 'error.main' : 'divider', '&.Mui-checked': { color: ACCENT_COLOR } }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: errors.terms ? 'error.main' : 'text.primary' }}>
                                    I agree to the <Box
                                        component="span"
                                        onClick={onOpenManifesto}
                                        sx={{ color: ACCENT_COLOR, fontWeight: 900, textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: ACCENT_COLOR_DARK } }}
                                    >
                                        Terms and Conditions
                                    </Box>.
                                </Typography>
                            }
                        />
                        {errors.terms && (
                            <Typography sx={{ fontSize: '11px', color: 'error.main', ml: 4, mt: 0.5, fontWeight: 700 }}>
                                {errors.terms}
                            </Typography>
                        )}
                    </Box>

                    {authError && (
                        <Alert severity="error" sx={{ borderRadius: '16px' }}>
                            {authError}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={isLoading}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            py: { xs: 1.5, sm: 2 },
                            fontSize: '12px',
                            fontWeight: 900,
                            minHeight: { xs: 44, sm: 48 },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                    </Button>
                </Stack>
            </form>

            <Box sx={{ textAlign: 'center', pt: { xs: 0, sm: 0 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    Already have an account?{' '}
                    <Button
                        onClick={onSwitchToLogin}
                        size="small"
                        sx={{ color: '#EAB308', fontWeight: 900, p: 0, minWidth: 'auto', textTransform: 'none', fontSize: 'inherit', '&:hover': { color: '#ca9b07', bgcolor: 'transparent' } }}
                    >
                        Sign in
                    </Button>
                </Typography>
            </Box>
        </Stack>
    );
};