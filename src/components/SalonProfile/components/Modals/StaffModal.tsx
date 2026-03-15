import React, { useState, useEffect, useCallback } from 'react';
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
    useTheme,
    FormControlLabel,
    Checkbox,
    Autocomplete,
} from '@mui/material';
import { User, Briefcase, Camera, Star, TrendingUp, X, AlertCircle, CheckCircle, Clock, Scissors, CalendarOff, Trash2, Plus } from 'lucide-react';
import { RequiredIndicator } from '@/components/common/RequiredIndicator';
import { Staff, Service } from '../../types';
import { getStaffSchedulesApi, updateStaffSchedulesApi, type StaffScheduleItem } from '@/services/api/staffService';
import { getSalonBreaksApi, createSalonBreakApi, deleteSalonBreakApi, type SalonBreakItem } from '@/services/api/salonService';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    salonId?: string | null;
    serviceList?: Service[];
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
    salonId,
    serviceList = [],
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [localSchedules, setLocalSchedules] = useState<Array<{ day_of_week: number; start_time: string; end_time: string }>>(
        () => DAY_NAMES.map((_, i) => ({ day_of_week: i, start_time: '09:00', end_time: '17:00' }))
    );
    const [localServiceIds, setLocalServiceIds] = useState<string[]>([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [breaks, setBreaks] = useState<SalonBreakItem[]>([]);
    const [loadingBreaks, setLoadingBreaks] = useState(false);
    const [addLeaveOpen, setAddLeaveOpen] = useState(false);
    const [newLeave, setNewLeave] = useState({ break_date: '', start_time: '00:00', end_time: '23:59', label: '' });
    const [savingLeave, setSavingLeave] = useState(false);

    const isLoading = creating || updating || loading;
    const isEditing = !!editingStaff;
    const staffBreaks = breaks.filter((b) => b.staff_id === editingStaff?.id);

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

    // Load staff schedules when editing
    useEffect(() => {
        if (!open || !editingStaff?.id) return;
        setLoadingSchedules(true);
        getStaffSchedulesApi(editingStaff.id)
            .then((res) => {
                const list = (res.data as any)?.data?.schedules ?? (res.data as any)?.schedules ?? [];
                const byDay = (list as StaffScheduleItem[]).reduce<Record<number, { start_time: string; end_time: string }>>((acc, s) => {
                    acc[s.day_of_week] = { start_time: s.start_time || '09:00', end_time: s.end_time || '17:00' };
                    return acc;
                }, {});
                setLocalSchedules(
                    DAY_NAMES.map((_, i) => ({
                        day_of_week: i,
                        start_time: byDay[i]?.start_time ?? '09:00',
                        end_time: byDay[i]?.end_time ?? '17:00',
                    }))
                );
            })
            .catch(() => setLocalSchedules(DAY_NAMES.map((_, i) => ({ day_of_week: i, start_time: '09:00', end_time: '17:00' }))))
            .finally(() => setLoadingSchedules(false));
    }, [open, editingStaff?.id]);

    // Sync service_ids from editing staff
    useEffect(() => {
        if (!open) return;
        const ids = (editingStaff as any)?.service_ids ?? staffFormData?.service_ids ?? [];
        setLocalServiceIds(Array.isArray(ids) ? ids : []);
    }, [open, editingStaff, staffFormData?.service_ids]);

    // Load salon breaks when modal open
    useEffect(() => {
        if (!open || !salonId) return;
        setLoadingBreaks(true);
        getSalonBreaksApi(salonId)
            .then((res) => {
                const list = (res.data as any)?.data?.breaks ?? (res.data as any)?.breaks ?? [];
                setBreaks(Array.isArray(list) ? list : []);
            })
            .catch(() => setBreaks([]))
            .finally(() => setLoadingBreaks(false));
    }, [open, salonId]);

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

    const handleScheduleChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
        setLocalSchedules((prev) =>
            prev.map((s) => (s.day_of_week === dayIndex ? { ...s, [field]: value } : s))
        );
    };

    const handleServiceIdsChange = (_: any, value: Service[]) => {
        const ids = value.map((s) => s.id);
        setLocalServiceIds(ids);
        onFormDataChange({ ...staffFormData, service_ids: ids });
    };

    const handleAddLeave = useCallback(() => {
        if (!salonId || !editingStaff?.id || !newLeave.break_date.trim()) return;
        setSavingLeave(true);
        createSalonBreakApi(salonId, {
            staff_id: editingStaff.id,
            break_date: newLeave.break_date,
            start_time: newLeave.start_time,
            end_time: newLeave.end_time,
            label: newLeave.label || 'Leave',
        })
            .then(() => {
                return getSalonBreaksApi(salonId);
            })
            .then((res) => {
                const list = (res.data as any)?.data?.breaks ?? (res.data as any)?.breaks ?? [];
                setBreaks(Array.isArray(list) ? list : []);
                setNewLeave({ break_date: '', start_time: '00:00', end_time: '23:59', label: '' });
                setAddLeaveOpen(false);
            })
            .finally(() => setSavingLeave(false));
    }, [salonId, editingStaff?.id, newLeave]);

    const handleDeleteBreak = useCallback(
        (breakId: string) => {
            if (!salonId) return;
            deleteSalonBreakApi(salonId, breakId).then(() => {
                setBreaks((prev) => prev.filter((b) => b.id !== breakId));
            });
        },
        [salonId]
    );

    const handleSaveClick = async () => {
        if (!validateForm()) return;
        if (isEditing && editingStaff?.id) {
            try {
                await updateStaffSchedulesApi(editingStaff.id, localSchedules);
            } catch (_) {}
        }
        onFormDataChange({ ...staffFormData, service_ids: localServiceIds });
        onSave();
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
                    mt: 3,
                    overflow: 'hidden',
                    ...(isDark
                        ? {
                            bgcolor: '#0B1224',
                            backgroundImage: 'none',
                            border: '1px solid',
                            borderColor: 'rgba(255,255,255,0.08)',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
                        }
                        : {
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        }),
                }
            }}
        >
            <DialogTitle sx={{ p: 4, pb: 2, color: isDark ? 'white' : undefined }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                            {isEditing ? 'Edit Staff' : 'Add Staff Member'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
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

            <DialogContent sx={{ px: 4, pt: 2, pb: 0, bgcolor: 'transparent', color: isDark ? 'white' : undefined }}>
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

                            {/* Working hours - only when editing */}
                            {isEditing && (
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, px: 1 }}>
                                        <Clock size={16} />
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                            WORKING HOURS (per day)
                                        </Typography>
                                    </Stack>
                                    {loadingSchedules ? (
                                        <Stack direction="row" justifyContent="center" py={2}>
                                            <CircularProgress size={24} />
                                        </Stack>
                                    ) : (
                                        <Stack spacing={1}>
                                            {localSchedules.map((s) => (
                                                <Stack key={s.day_of_week} direction="row" alignItems="center" spacing={1}>
                                                    <Typography variant="body2" sx={{ width: 100, fontWeight: 600 }}>
                                                        {DAY_NAMES[s.day_of_week].slice(0, 3)}
                                                    </Typography>
                                                    <TextField
                                                        size="small"
                                                        type="time"
                                                        value={s.start_time}
                                                        onChange={(e) => handleScheduleChange(s.day_of_week, 'start_time', e.target.value)}
                                                        disabled={isLoading}
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{ step: 900 }}
                                                        sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>–</Typography>
                                                    <TextField
                                                        size="small"
                                                        type="time"
                                                        value={s.end_time}
                                                        onChange={(e) => handleScheduleChange(s.day_of_week, 'end_time', e.target.value)}
                                                        disabled={isLoading}
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{ step: 900 }}
                                                        sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                    />
                                                </Stack>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            )}

                            {/* Assign services */}
                            {serviceList.length > 0 && (
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, px: 1 }}>
                                        <Scissors size={16} />
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                            ASSIGN SERVICES
                                        </Typography>
                                    </Stack>
                                    <Autocomplete
                                        multiple
                                        options={serviceList}
                                        getOptionLabel={(opt) => opt.name ?? ''}
                                        value={serviceList.filter((s) => localServiceIds.includes(s.id))}
                                        onChange={handleServiceIdsChange}
                                        disabled={isLoading}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select services this staff can perform"
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                            />
                                        )}
                                    />
                                </Box>
                            )}

                            {/* Leave days - only when editing and salonId */}
                            {isEditing && salonId && (
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, px: 1 }}>
                                        <CalendarOff size={16} />
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                            LEAVE DAYS
                                        </Typography>
                                    </Stack>
                                    {loadingBreaks ? (
                                        <Stack direction="row" justifyContent="center" py={1}>
                                            <CircularProgress size={20} />
                                        </Stack>
                                    ) : (
                                        <Stack spacing={1}>
                                            {staffBreaks.map((b) => (
                                                <Stack
                                                    key={b.id}
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{
                                                        py: 1,
                                                        px: 1.5,
                                                        borderRadius: '12px',
                                                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'grey.100',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {b.break_date || (b.day_of_week != null ? DAY_NAMES[b.day_of_week] : '—')} {b.start_time}–{b.end_time}
                                                        {b.label ? ` · ${b.label}` : ''}
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => handleDeleteBreak(b.id)} disabled={isLoading}>
                                                        <Trash2 size={14} />
                                                    </IconButton>
                                                </Stack>
                                            ))}
                                            {!addLeaveOpen ? (
                                                <Button
                                                    size="small"
                                                    startIcon={<Plus size={16} />}
                                                    onClick={() => setAddLeaveOpen(true)}
                                                    disabled={isLoading}
                                                    sx={{ alignSelf: 'flex-start', borderRadius: '12px' }}
                                                >
                                                    Add leave
                                                </Button>
                                            ) : (
                                                <Stack spacing={1} sx={{ p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'grey.50' }}>
                                                    <TextField
                                                        size="small"
                                                        label="Date"
                                                        type="date"
                                                        value={newLeave.break_date}
                                                        onChange={(e) => setNewLeave((p) => ({ ...p, break_date: e.target.value }))}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                    />
                                                    <Stack direction="row" spacing={1}>
                                                        <TextField
                                                            size="small"
                                                            label="Start"
                                                            type="time"
                                                            value={newLeave.start_time}
                                                            onChange={(e) => setNewLeave((p) => ({ ...p, start_time: e.target.value }))}
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                        <TextField
                                                            size="small"
                                                            label="End"
                                                            type="time"
                                                            value={newLeave.end_time}
                                                            onChange={(e) => setNewLeave((p) => ({ ...p, end_time: e.target.value }))}
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                        />
                                                    </Stack>
                                                    <TextField
                                                        size="small"
                                                        label="Label (optional)"
                                                        value={newLeave.label}
                                                        onChange={(e) => setNewLeave((p) => ({ ...p, label: e.target.value }))}
                                                        placeholder="e.g. Vacation"
                                                        fullWidth
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                    />
                                                    <Stack direction="row" spacing={1}>
                                                        <Button size="small" onClick={() => setAddLeaveOpen(false)} sx={{ borderRadius: '12px' }}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={handleAddLeave}
                                                            disabled={savingLeave || !newLeave.break_date.trim()}
                                                            sx={{ borderRadius: '12px' }}
                                                        >
                                                            {savingLeave ? <CircularProgress size={16} /> : 'Add'}
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            )}
                                        </Stack>
                                    )}
                                </Box>
                            )}

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
                                    label="Contact Number"
                                    value={staffFormData.phone || ''}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    placeholder="077 XXX XXXX"
                                    disabled={isLoading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>+94</Typography>
                                            </InputAdornment>
                                        ),
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
                        borderRadius: '12px',
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        py: 1.5,
                        fontSize: '11px',
                        fontWeight: 900,
                        minHeight: 44,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
                        '&:disabled': { opacity: 0.5 },
                    }}
                >
                    {isLoading && <CircularProgress size={20} sx={{ color: 'inherit' }} />}
                    {isLoading
                        ? (isEditing ? 'Updating...' : 'Enrolling...')
                        : (isEditing ? 'Update staff' : 'Add staff member')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};