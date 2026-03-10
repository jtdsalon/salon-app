import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Grid,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    InputAdornment,
    MenuItem,
    Alert,
} from '@mui/material';
import { Mail, Lock, User, Building2, Phone, Tag } from 'lucide-react';
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
        <Stack spacing={4} className="animate-fadeIn">
            <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
                    Create <Box component="span" sx={{ color: ACCENT_COLOR }}>Account</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Create your salon account to get started.
                </Typography>
            </Box>

            <form onSubmit={onSubmit} noValidate>
                <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                value={phone}
                                onChange={(e) => onPhoneChange(e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                placeholder="+1 (555) 123-4567"
                                {...textFieldProps}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Phone size={18} /></InputAdornment>,
                                    sx: { borderRadius: '20px' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: '24px',
                            bgcolor: errors.terms ? 'rgba(244, 63, 94, 0.05)' : 'action.hover',
                            border: '1.5px solid',
                            borderColor: errors.terms ? 'error.main' : 'divider',
                            transition: 'all 0.3s'
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
                        sx={{ borderRadius: '100px', bgcolor: 'text.primary', color: 'background.paper', py: 2, fontWeight: 900 }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                    </Button>
                </Stack>
            </form>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Already have an account?{' '}
                    <Button
                        onClick={onSwitchToLogin}
                        sx={{ color: 'text.primary', fontWeight: 900, p: 0, minWidth: 'auto', textTransform: 'none' }}
                    >
                        Sign in
                    </Button>
                </Typography>
            </Box>
        </Stack>
    );
};