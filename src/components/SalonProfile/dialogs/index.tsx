import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  Fade,
  CircularProgress,
  Avatar,
  InputAdornment,
  MenuItem,
  Checkbox,
  Alert,
  Snackbar,
  Chip,
  useMediaQuery
} from '@mui/material';
import {
  X,
  AlertTriangle,
  Camera,
  ImageIcon as ImageIconLucide,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { OperatingHour } from '../types';
import { getFullImageUrl } from '../../../lib/util/imageUrl';
import { alpha, useTheme } from '@mui/material/styles';
import {
  validateSalonForm,
  validateField,
  validateOperatingHour,
  SalonFormErrors,
  hasErrors
} from '../../../lib/validators/salonFormValidator';
import { RequiredIndicator } from '../../common/RequiredIndicator';

interface SalonEditDialogProps {
  open: boolean;
  onClose: () => void;
  salonFormData: any;
  onFormDataChange: (data: any) => void;
  onOperatingHourChange: (index: number, field: keyof OperatingHour, value: any) => void;
  onImageUpload: (type: 'avatar' | 'cover') => (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSave: () => void;
  isProcessingImage: boolean;
  isUpdating: boolean;
  updateError: string | null;
  updateSuccess: boolean;
  clearMessages: () => void;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  imagePreviewUrls?: { avatar?: string; cover?: string };
}

export const SalonEditDialog: React.FC<SalonEditDialogProps> = ({
  open,
  onClose,
  salonFormData,
  onFormDataChange,
  onOperatingHourChange,
  onImageUpload,
  onSave,
  isProcessingImage,
  isUpdating,
  updateError,
  updateSuccess,
  clearMessages,
  avatarInputRef,
  coverInputRef,
  imagePreviewUrls = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [errors, setErrors] = React.useState<SalonFormErrors>({});
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const generateSuggestions = React.useCallback(() => {
    if (!salonFormData.name) return;
    const base = salonFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'salon';
    const suffixes = ['salon', 'official', 'studio', 'glow', 'beauty', 'spa', 'hub'];
    const newSuggestions = [
      base,
      `${base}_${Math.floor(Math.random() * 1000)}`,
      `${base}_${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
      `the_${base}`,
      `${base}_official`,
      `${base}_style`
    ].sort(() => 0.5 - Math.random()).slice(0, 3);
    setSuggestions(newSuggestions);
  }, [salonFormData.name]);

  React.useEffect(() => {
    if (open && salonFormData.name && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [open, salonFormData.name, generateSuggestions, suggestions.length]);

  // Auto-close dialog after successful update
  React.useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 500); // Small delay to let snackbar appear first
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, onClose]);

  const handleClose = () => {
    clearMessages();
    setErrors({});
    setTouched(new Set());
    setSuggestions([]);
    onClose();
  };

  // Construct full image URLs from relative paths
  const fullAvatarUrl = getFullImageUrl(salonFormData.avatar);
  const fullCoverUrl = getFullImageUrl(salonFormData.cover);

  // Handle field blur to validate
  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => new Set(prev).add(fieldName));

    let error: string | undefined;

    if (fieldName === 'hours') {
      error = validateField('hours', salonFormData.hours);
    } else {
      error = validateField(fieldName as any, salonFormData[fieldName]);
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Handle field change with real-time validation
  const handleFieldChange = (fieldName: string, value: any) => {
    onFormDataChange({ ...salonFormData, [fieldName]: value });

    // Real-time validation if field has been touched
    if (touched.has(fieldName)) {
      const error = validateField(fieldName as any, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  // Handle operating hour change with validation
  const handleOperatingHourFieldChange = (index: number, field: keyof OperatingHour, value: any) => {
    onOperatingHourChange(index, field, value);

    // Validate the specific hour if touched
    if (touched.has(`hour_${index}`)) {
      const updatedHour = { ...salonFormData.hours[index], [field]: value };
      const error = validateOperatingHour(updatedHour);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Handle operating hour blur
  const handleOperatingHourBlur = (index: number) => {
    setTouched(prev => new Set(prev).add(`hour_${index}`));
    const hour = salonFormData.hours[index];
    const error = validateOperatingHour(hour);
    setErrors(prev => ({
      ...prev,
      hours: error
    }));
  };

  // Handle save with full validation
  const handleSave = () => {
    const formErrors = validateSalonForm(salonFormData);
    setErrors(formErrors);
    setTouched(new Set(Object.keys(formErrors)));

    if (!hasErrors(formErrors)) {
      onSave();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '48px',
            p: isMobile ? 0 : 1,
          }
        }}
      >
        <DialogTitle sx={{ p: isMobile ? 3 : 4, pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 900 }}>Edit Salon Profile</Typography>
            <IconButton onClick={handleClose} disabled={isUpdating}><X size={20} /></IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">Update the public details of your salon.</Typography>
        </DialogTitle>

        {updateError && (
          <Box sx={{ px: isMobile ? 3 : 4, pt: 2 }}>
            <Alert severity="error" onClose={clearMessages} sx={{ borderRadius: '16px' }}>
              {updateError}
            </Alert>
          </Box>
        )}

        <DialogContent sx={{ px: isMobile ? 3 : 4, pt: 2, pb: isMobile ? 2 : 3, overflowY: 'auto' }}>
          <Stack spacing={isMobile ? 3 : 4}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Cover Image <RequiredIndicator /></Typography>
              <Box sx={{ position: 'relative', height: isMobile ? 120 : 160, borderRadius: isMobile ? '16px' : '24px', overflow: 'hidden', border: '1px solid', borderColor: errors.cover ? 'error.main' : 'divider', bgcolor: 'action.hover' }}>
                {imagePreviewUrls.cover || fullCoverUrl ? (
                  <Box component="img" src={imagePreviewUrls.cover || fullCoverUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isProcessingImage ? 0.5 : 1 }} />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                    <ImageIconLucide size={48} color="currentColor" strokeWidth={1} style={{ opacity: 0.4 }} />
                  </Box>
                )}
                <Button
                  component="span"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isProcessingImage || isUpdating}
                  startIcon={isProcessingImage ? <CircularProgress size={16} color="inherit" /> : <ImageIconLucide size={18} />}
                  sx={{ position: 'absolute', bottom: isMobile ? 12 : 16, right: isMobile ? 12 : 16, bgcolor: 'rgba(255,255,255,0.8)', color: 'text.primary', backdropFilter: 'blur(10px)', borderRadius: '100px', px: isMobile ? 1.5 : 2, fontSize: isMobile ? '0.8rem' : undefined }}
                >
                  Change Cover
                </Button>
                <input type="file" hidden ref={coverInputRef} accept="image/*" onChange={onImageUpload('cover')} />
              </Box>
              {errors.cover && (
                <Typography variant="caption" color="error.main" sx={{ mt: -1 }}>{errors.cover}</Typography>
              )}

              <Stack direction="row" spacing={isMobile ? 2 : 3} alignItems="center">
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar src={imagePreviewUrls.avatar || fullAvatarUrl} sx={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, border: '4px solid', borderColor: errors.avatar ? 'error.main' : 'background.paper', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <IconButton
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isProcessingImage || isUpdating}
                    size="small"
                    sx={{ position: 'absolute', bottom: -4, right: -4, bgcolor: 'secondary.main', color: 'white', border: '2px solid white' }}
                  >
                    <Camera size={14} />
                  </IconButton>
                  <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={onImageUpload('avatar')} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Logo <RequiredIndicator /></Typography>
                  <Typography variant="caption" color="text.secondary">Recommend: Square image, 400x400px</Typography>
                  {errors.avatar && (
                    <Typography variant="caption" color="error.main" display="block" sx={{ mt: 0.5 }}>{errors.avatar}</Typography>
                  )}
                </Box>
              </Stack>
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label={<>Salon Name <RequiredIndicator /></>}
                value={salonFormData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                disabled={isUpdating}
                error={touched.has('name') && !!errors.name}
                helperText={touched.has('name') ? errors.name : ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              />
              <TextField
                fullWidth
                label={<>Public Handle <RequiredIndicator /></>}
                value={salonFormData.handle}
                onChange={(e) => handleFieldChange('handle', e.target.value)}
                onBlur={() => handleFieldBlur('handle')}
                disabled={isUpdating}
                error={touched.has('handle') && !!errors.handle}
                helperText={touched.has('handle') ? errors.handle : ''}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography variant="body2" sx={{ fontWeight: 900, color: 'text.secondary' }}>@</Typography></InputAdornment>,
                  sx: { borderRadius: '20px', fontWeight: 700 }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              />
              {/* Handle Suggestions */}
              <Box sx={{ mt: -1, mb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    SUGGESTIONS
                  </Typography>
                  <IconButton size="small" onClick={generateSuggestions} disabled={isUpdating || !salonFormData.name} sx={{ p: 0.5 }}>
                    <RefreshCw size={12} />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                  {suggestions.map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={`@${suggestion}`}
                      size="small"
                      onClick={() => handleFieldChange('handle', suggestion)}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '11px',
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.text.primary, 0.1),
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              <TextField
                fullWidth
                select
                label="Salon Category"
                value={salonFormData.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                onBlur={() => handleFieldBlur('category')}
                disabled={isUpdating}
                error={touched.has('category') && !!errors.category}
                helperText={touched.has('category') ? errors.category : ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              >
                <MenuItem value="">Select a category...</MenuItem>
                <MenuItem value="Hair Salon">Hair Salon</MenuItem>
                <MenuItem value="Spa">Spa</MenuItem>
                <MenuItem value="Nail Studio">Nail Studio</MenuItem>
                <MenuItem value="Beauty Center">Beauty Center</MenuItem>
                <MenuItem value="Wellness">Wellness</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Philosophy & Bio"
                multiline
                rows={isMobile ? 2 : 3}
                value={salonFormData.bio}
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                onBlur={() => handleFieldBlur('bio')}
                disabled={isUpdating}
                error={!!errors.bio}
                helperText={errors.bio || `${salonFormData.bio?.length || 0}/1000`}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              />
              <TextField
                fullWidth
                label={<>Primary Address <RequiredIndicator /></>}
                value={salonFormData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                onBlur={() => handleFieldBlur('address')}
                disabled={isUpdating}
                error={touched.has('address') && !!errors.address}
                helperText={touched.has('address') ? errors.address : ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={<>City <RequiredIndicator /></>}
                  value={salonFormData.city ?? ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  onBlur={() => handleFieldBlur('city')}
                  disabled={isUpdating}
                  error={touched.has('city') && !!errors.city}
                  helperText={touched.has('city') ? errors.city : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
                <TextField
                  fullWidth
                  label={<>Area or neighbourhood <RequiredIndicator /></>}
                  value={salonFormData.area ?? ''}
                  onChange={(e) => handleFieldChange('area', e.target.value)}
                  onBlur={() => handleFieldBlur('area')}
                  disabled={isUpdating}
                  error={touched.has('area') && !!errors.area}
                  helperText={touched.has('area') ? errors.area : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
              </Stack>

              <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 2, mb: 1, color: 'text.secondary', fontSize: isMobile ? '0.8rem' : undefined }}>Social &amp; Web (optional)</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                <TextField
                  fullWidth
                  label="Website URL"
                  placeholder="https://..."
                  value={salonFormData.website ?? ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  disabled={isUpdating}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
                <TextField
                  fullWidth
                  label="Instagram"
                  placeholder="username or @handle"
                  value={salonFormData.instagram ?? ''}
                  onChange={(e) => handleFieldChange('instagram', e.target.value)}
                  disabled={isUpdating}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
                <TextField
                  fullWidth
                  label="Facebook"
                  placeholder="page or profile"
                  value={salonFormData.facebook ?? ''}
                  onChange={(e) => handleFieldChange('facebook', e.target.value)}
                  disabled={isUpdating}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
                <TextField
                  fullWidth
                  label="TikTok"
                  placeholder="username or @handle"
                  value={salonFormData.tiktok ?? ''}
                  onChange={(e) => handleFieldChange('tiktok', e.target.value)}
                  disabled={isUpdating}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                />
              </Stack>

              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', mt: 2, fontSize: isMobile ? '1rem' : undefined }}>Operating Hours <RequiredIndicator /></Typography>

              {errors.hours && touched.has('hours') && (
                <Alert severity="error" sx={{ borderRadius: '16px', mb: 2 }}>
                  {errors.hours}
                </Alert>
              )}

              <Stack spacing={2}>
                {salonFormData.hours && salonFormData.hours.map((hour: OperatingHour, idx: number) => (
                  <Box key={hour.day} sx={{ p: isMobile ? 1.5 : 2, borderRadius: isMobile ? '16px' : '24px', border: '1.5px solid', borderColor: hour.isOpen ? 'secondary.main' : 'divider', bgcolor: hour.isOpen ? 'rgba(181, 148, 16, 0.02)' : 'action.hover' }}>
                    <Stack direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} justifyContent="space-between" spacing={isMobile ? 2 : 0}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: isMobile ? '100%' : 'auto', flex: isMobile ? undefined : 1 }}>
                        <Typography sx={{ fontWeight: 800, minWidth: isMobile ? 72 : 100, fontSize: isMobile ? '13px' : '14px' }}>{hour.day}</Typography>
                        <FormControlLabel
                          control={<Switch checked={hour.isOpen} onChange={(e) => handleOperatingHourFieldChange(idx, 'isOpen', e.target.checked)} color="secondary" disabled={isUpdating} />}
                          label={<Typography sx={{ fontSize: '12px', fontWeight: 900, color: hour.isOpen ? 'secondary.main' : 'text.secondary' }}>{hour.isOpen ? 'OPEN' : 'CLOSED'}</Typography>}
                        />
                      </Stack>

                      <Fade in={hour.isOpen}>
                        <Stack direction="row" spacing={2} sx={{ width: isMobile ? '100%' : 'auto', flex: isMobile ? undefined : 1, opacity: hour.isOpen ? 1 : 0 }}>
                          <TextField
                            type="time"
                            label="Open"
                            value={hour.open}
                            onChange={(e) => handleOperatingHourFieldChange(idx, 'open', e.target.value)}
                            onBlur={() => handleOperatingHourBlur(idx)}
                            disabled={isUpdating}
                            size="small"
                            fullWidth={isMobile}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                          />
                          <TextField
                            type="time"
                            label="Close"
                            value={hour.close}
                            onChange={(e) => handleOperatingHourFieldChange(idx, 'close', e.target.value)}
                            onBlur={() => handleOperatingHourBlur(idx)}
                            disabled={isUpdating}
                            size="small"
                            fullWidth={isMobile}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                          />
                        </Stack>
                      </Fade>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 3 : 4, pt: 2, pb: isMobile ? 'max(24px, env(safe-area-inset-bottom))' : 2 }}>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleSave}
            disabled={isUpdating}
            sx={{
              borderRadius: '100px',
              bgcolor: 'text.primary',
              color: 'background.paper',
              py: isMobile ? 1.5 : 2,
              fontWeight: 900,
              '&:hover': { bgcolor: 'secondary.main' },
              '&:disabled': { opacity: 0.6 }
            }}
          >
            {isUpdating ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={updateSuccess}
        autoHideDuration={3000}
        onClose={clearMessages}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={clearMessages}
          severity="success"
          sx={{ borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1 }}
          icon={<CheckCircle size={20} />}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm, title, message }) => (
  <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '32px', p: 1, maxWidth: { xs: 'calc(100vw - 32px)', sm: 320 }, width: { xs: '100%', sm: 'auto' } } }}>
    <DialogTitle sx={{ textAlign: 'center' }}>
      <Box sx={{ color: '#ef4444', mb: 1 }}><AlertTriangle size={48} style={{ margin: '0 auto' }} /></Box>
      <Typography component="span" variant="h6" sx={{ fontWeight: 900 }}>{title}</Typography>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" align="center">{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 2 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 800 }}>Keep It</Button>
      <Button variant="contained" onClick={onConfirm} sx={{ bgcolor: '#ef4444', color: 'white', borderRadius: '100px', px: 3, fontWeight: 900, '&:hover': { bgcolor: '#dc2626' } }}>
        Archive
      </Button>
    </DialogActions>
  </Dialog>
);