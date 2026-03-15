import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    MenuItem,
    Alert,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Branch } from '../../types';
import { RequiredIndicator } from '@/components/common/RequiredIndicator';

interface BranchModalProps {
    open: boolean;
    onClose: () => void;
    editingBranch: Branch | null;
    branchFormData: Partial<Branch>;
    onFormDataChange: (data: Partial<Branch>) => void;
    onSave: () => void;
    loading?: boolean;
    creating?: boolean;
    updating?: boolean;
    error?: any;
    success?: boolean;
    successMessage?: string;
}

export const BranchModal: React.FC<BranchModalProps> = ({
    open,
    onClose,
    editingBranch,
    branchFormData,
    onFormDataChange,
    onSave,
    loading = false,
    creating = false,
    updating = false,
    error = null,
    success = false,
    successMessage = '',
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFieldChange = (field: keyof Branch, value: any) => {
        onFormDataChange({ ...branchFormData, [field]: value });
    };

    const isProcessing = creating || updating || loading;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        borderRadius: isMobile ? 0 : '32px',
                        p: isMobile ? 0 : 1,
                        bgcolor: 'background.paper',
                        backgroundImage: 'none',
                        border: isMobile ? 'none' : '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        color: 'text.primary',
                        '--Paper-overlay': 'none',
                    },
                },
            }}
        >
            <DialogTitle sx={{
                p: { xs: 2, sm: 4 },
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
                    {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.8rem', sm: 'inherit' } }}>
                    {editingBranch
                        ? 'Update the details of this location'
                        : 'Add a new location to your salon'}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2, sm: 4 }, pt: 3, color: 'text.primary' }}>
                <Stack spacing={3}>
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: '16px' }}>
                            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
                        </Alert>
                    )}

                    {success && successMessage && (
                        <Alert severity="success" sx={{ borderRadius: '16px' }}>
                            {successMessage}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label={<>Location Name <RequiredIndicator /></>}
                        value={branchFormData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="e.g., Downtown Branch, Riverside"
                        disabled={isProcessing}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                '&:hover': {
                                    '& fieldset': {
                                        borderColor: 'primary.main',
                                    }
                                }
                            }
                        }}
                        InputProps={{
                            sx: { fontWeight: 600 }
                        }}
                    />

                    <TextField
                        fullWidth
                        label={<>Address <RequiredIndicator /></>}
                        multiline
                        rows={2}
                        value={branchFormData.address || ''}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        placeholder="Complete physical address with landmarks"
                        disabled={isProcessing}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Contact Number"
                        value={branchFormData.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="077 XXX XXXX"
                        disabled={isProcessing}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <Typography
                                    variant="caption"
                                    component="span"
                                    sx={{
                                        mr: 1,
                                        color: 'text.secondary',
                                        fontWeight: 700
                                    }}
                                >
                                    +94
                                </Typography>
                            ),
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={branchFormData.isPrimary || false}
                                onChange={(e) => handleFieldChange('isPrimary', e.target.checked)}
                                disabled={isProcessing}
                                sx={{
                                    color: 'secondary.main',
                                    '&.Mui-checked': {
                                        color: 'secondary.main',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 20,
                                    }
                                }}
                            />
                        }
                        label={
                            <Stack>
                                <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>
                                    Set as Primary Branch
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    This location will be featured as the main salon in searches
                                </Typography>
                            </Stack>
                        }
                        sx={{
                            mt: 1,
                            '& .MuiFormControlLabel-label': {
                                flex: 1
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Operational Status"
                        value={branchFormData.status || 'active'}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                        disabled={isProcessing}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            }
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        borderRadius: '16px',
                                        mt: 1.5,
                                        bgcolor: 'background.paper',
                                        backgroundImage: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="active">🟢 Active & Accepting Clients</MenuItem>
                        <MenuItem value="maintenance">🟡 Under Renovation</MenuItem>
                        <MenuItem value="closed">🔴 Temporarily Closed</MenuItem>
                        <MenuItem value="permanent-closed">⚫ Permanently Closed</MenuItem>
                    </TextField>
                </Stack>
            </DialogContent>

            <DialogActions sx={{
                p: { xs: 2, sm: 4 },
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        disabled={isProcessing}
                        sx={{
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 900,
                            borderWidth: '1.5px',
                            py: 1.5,
                            color: 'text.secondary',
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'text.primary',
                                color: 'text.primary',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Discard changes
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        onClick={onSave}
                        disabled={isProcessing}
                        sx={{
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 900,
                            py: 1.5,
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
                            '&:disabled': { opacity: 0.6, cursor: 'not-allowed' }
                        }}
                    >
                        {isProcessing ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={16} sx={{ color: 'inherit' }} />
                                <span>{editingBranch ? 'Updating...' : 'Creating...'}</span>
                            </Stack>
                        ) : (
                            editingBranch ? 'Update branch' : 'Save branch'
                        )}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};