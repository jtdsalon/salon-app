import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    MenuItem,
    InputAdornment,
    Slider,
    Box,
    Avatar,
    IconButton,
    Typography,
    Chip,
    Alert,
    CircularProgress,
} from '@mui/material';
import { User, Briefcase, Camera, Star, TrendingUp, X, AlertCircle, CheckCircle } from 'lucide-react';
import { RequiredIndicator } from '@/components/common/RequiredIndicator';
import { Staff } from '../../types';

interface StaffModalProps {
    open: boolean;
    onClose: () => void;
    editingStaff: Staff | null;
    staffFormData: Partial<Staff>;
    onFormDataChange: (data: Partial<Staff>) => void;
    onSave: () => void;
    loading?: boolean;
    creating?: boolean;
    updating?: boolean;
    error?: any;
    success?: boolean;
    successMessage?: string;
}

export const StaffModal: React.FC<StaffModalProps> = ({
    open,
    onClose,
    editingStaff,
    staffFormData,
    onFormDataChange,
    onSave,
    loading = false,
    creating = false,
    updating = false,
    error = null,
    success = false,
    successMessage = '',
}) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const isLoading = creating || updating || loading;
    const isEditing = !!editingStaff;

    // Show success message temporarily
    useEffect(() => {
        if (success && successMessage) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, successMessage, onClose]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!staffFormData.name?.trim()) {
            errors.name = 'Name is required';
        }

        if (!staffFormData.role?.trim()) {
            errors.role = 'Specialty role is required';
        }

        if (staffFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffFormData.email)) {
            errors.email = 'Invalid email address';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFieldChange = (field: keyof Staff, value: any) => {
        onFormDataChange({ ...staffFormData, [field]: value });
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors((prev) => ({ ...prev, avatar: 'File size must be less than 5MB' }));
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setFormErrors((prev) => ({ ...prev, avatar: 'Please upload an image file' }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                handleFieldChange('avatar', reader.result as string);
                if (formErrors.avatar) {
                    setFormErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.avatar;
                        return newErrors;
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            onSave();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '48px',
                    p: 1,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    overflow: 'hidden',
                }
            }}
        >
            <DialogTitle sx={{ p: 4, pb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                            {isEditing ? 'Edit Staff' : 'Add Staff Member'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isEditing
                                ? 'Update staff member details'
                                : 'Add a new staff member to your team'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        disabled={isLoading}
                        sx={{
                            border: '1.5px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 4, pt: 2, pb: 0 }}>
                <Stack spacing={3}>
                    {/* Success Message */}
                    {showSuccess && success && (
                        <Alert
                            severity="success"
                            icon={<CheckCircle size={20} />}
                            sx={{
                                borderRadius: '16px',
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                border: '1.5px solid',
                                borderColor: 'rgba(16, 185, 129, 0.3)',
                                '& .MuiAlert-message': {
                                    fontWeight: 600,
                                    fontSize: '14px',
                                }
                            }}
                        >
                            {successMessage || (isEditing ? 'Staff updated successfully!' : 'Staff member added successfully!')}
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert
                            severity="error"
                            icon={<AlertCircle size={20} />}
                            sx={{
                                borderRadius: '16px',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: '#EF4444',
                                border: '1.5px solid',
                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                '& .MuiAlert-message': {
                                    fontWeight: 600,
                                    fontSize: '14px',
                                }
                            }}
                        >
                            {typeof error === 'string' ? error : error?.message || 'An error occurred. Please try again.'}
                        </Alert>
                    )}

                    <Stack spacing={4}>
                        {/* Avatar Upload Section */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={staffFormData.avatar}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        border: '4px solid',
                                        borderColor: formErrors.avatar ? '#EF4444' : 'background.paper',
                                        boxShadow: formErrors.avatar
                                            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                                            : '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <User size={42} />
                                </Avatar>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={handleAvatarUpload}
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    disabled={isLoading}
                                />
                                <label htmlFor="avatar-upload">
                                    <IconButton
                                        component="span"
                                        size="small"
                                        disabled={isLoading}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 2,
                                            right: 2,
                                            bgcolor: 'secondary.main',
                                            color: 'white',
                                            border: '3px solid',
                                            borderColor: 'background.paper',
                                            '&:hover': {
                                                bgcolor: 'secondary.dark'
                                            },
                                            '&:disabled': {
                                                bgcolor: 'text.disabled',
                                                opacity: 0.5,
                                            }
                                        }}
                                    >
                                        <Camera size={14} />
                                    </IconButton>
                                </label>
                            </Box>
                        </Box>

                        {formErrors.avatar && (
                            <Typography sx={{ color: '#EF4444', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                                {formErrors.avatar}
                            </Typography>
                        )}

                        {/* Form Fields */}
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label={<>Name <RequiredIndicator /></>}
                                value={staffFormData.name || ''}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                placeholder="e.g., Isabella Rodriguez"
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={18} color="inherit" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: '20px',
                                        fontWeight: 600
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label={<>Specialty Role <RequiredIndicator /></>}
                                value={staffFormData.role || ''}
                                onChange={(e) => handleFieldChange('role', e.target.value)}
                                placeholder="e.g., Master Colorist, Senior Stylist"
                                error={!!formErrors.role}
                                helperText={formErrors.role}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Briefcase size={18} color="inherit" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: '20px',
                                        fontWeight: 600
                                    }
                                }}
                            />

                            {/* Experience Level */}
                            <Box>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1, px: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                        YEARS OF MASTERY
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                                        {staffFormData.experience || 0} YEARS
                                    </Typography>
                                </Stack>
                                <Slider
                                    value={staffFormData.experience || 0}
                                    onChange={(_, v) => handleFieldChange('experience', v)}
                                    min={0}
                                    max={30}
                                    disabled={isLoading}
                                    marks={[
                                        { value: 0, label: 'Novice' },
                                        { value: 10, label: 'Expert' },
                                        { value: 20, label: 'Master' },
                                        { value: 30, label: 'Legend' },
                                    ]}
                                    sx={{
                                        color: 'secondary.main',
                                        '& .MuiSlider-markLabel': {
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            color: 'text.secondary'
                                        }
                                    }}
                                />
                            </Box>

                            {/* Commission Rate */}
                            <Box>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1, px: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                        COMMISSION RATE
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <TrendingUp size={12} color="inherit" />
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                                            {Math.round((staffFormData.commissionRate || 0) * 100)}%
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Slider
                                    value={(staffFormData.commissionRate || 0) * 100}
                                    onChange={(_, v) => handleFieldChange('commissionRate', (v as number) / 100)}
                                    min={0}
                                    max={50}
                                    disabled={isLoading}
                                    sx={{ color: 'secondary.main' }}
                                />
                            </Box>

                            {/* Rating - Only show when editing */}
                            {isEditing && (
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1, px: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                            CLIENT RATING
                                        </Typography>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Star size={12} fill="currentColor" />
                                            <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                                                {staffFormData.rating?.toFixed(1) || '5.0'}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Slider
                                        value={staffFormData.rating || 5}
                                        onChange={(_, v) => handleFieldChange('rating', v)}
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        disabled={isLoading}
                                        sx={{ color: 'secondary.main' }}
                                    />
                                </Box>
                            )}

                            {/* Status Selection */}
                            <TextField
                                fullWidth
                                select
                                label="Deployment Status"
                                value={staffFormData.status || 'active'}
                                onChange={(e) => handleFieldChange('status', e.target.value)}
                                disabled={isLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '20px',
                                    }
                                }}
                            >
                                <MenuItem value="active">
                                    <Chip
                                        label="ACTIVE"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10B981',
                                            fontWeight: 900,
                                            fontSize: '10px',
                                            mr: 1
                                        }}
                                    />
                                    Active Duty
                                </MenuItem>
                                <MenuItem value="on-leave">
                                    <Chip
                                        label="LEAVE"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                                            color: '#F59E0B',
                                            fontWeight: 900,
                                            fontSize: '10px',
                                            mr: 1
                                        }}
                                    />
                                    On Sabbatical
                                </MenuItem>
                                <MenuItem value="inactive">
                                    <Chip
                                        label="ARCHIVED"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(148, 163, 184, 0.1)',
                                            color: '#64748B',
                                            fontWeight: 900,
                                            fontSize: '10px',
                                            mr: 1
                                        }}
                                    />
                                    Archived
                                </MenuItem>
                            </TextField>

                            {/* Contact Information */}
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={staffFormData.email || ''}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    placeholder="staff@salon.com"
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    disabled={isLoading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={staffFormData.phone || ''}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    placeholder="+94 77 XXX XXXX"
                                    disabled={isLoading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                        }
                                    }}
                                />
                            </Stack>

                            {/* Bio */}
                            <TextField
                                fullWidth
                                label="Bio"
                                multiline
                                rows={3}
                                value={staffFormData.bio || ''}
                                onChange={(e) => handleFieldChange('bio', e.target.value)}
                                placeholder="Share their experience, specialties, and skills..."
                                disabled={isLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                    }
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={handleSaveClick}
                    disabled={isLoading}
                    sx={{
                        borderRadius: '100px',
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        py: 2,
                        fontWeight: 900,
                        fontSize: '15px',
                        letterSpacing: '0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                            bgcolor: 'text.primary',
                            opacity: 0.9,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        },
                        '&:disabled': {
                            bgcolor: 'text.disabled',
                            opacity: 0.5,
                        }
                    }}
                >
                    {isLoading && <CircularProgress size={20} sx={{ color: 'inherit' }} />}
                    {isLoading
                        ? (isEditing ? 'Updating...' : 'Enrolling...')
                        : (isEditing ? 'Update Staff' : 'Add Staff Member')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};