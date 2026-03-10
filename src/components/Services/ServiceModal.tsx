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
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { X, Sparkles, Clock, AlertCircle, CheckCircle, Upload } from 'lucide-react';

import { optimizeImage } from '@/components/SalonProfile/imageProcessor';
import { getFullImageUrl } from '@/lib/util/imageUrl';
import { RequiredIndicator } from '@/components/common/RequiredIndicator';
import { ServiceMenuCategories } from './constants';

/** Shared label props for consistent styling across all form fields */
const formLabelProps = {
  shrink: true,
  sx: { fontWeight: 600 } as const,
};

export interface ServiceFormData {
  id?: string;
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  duration?: number;
  duration_minutes?: number;
  images?: (File | string)[];
}

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  editingService: ServiceFormData | null;
  serviceFormData: Partial<ServiceFormData>;
  onFormDataChange: (data: Partial<ServiceFormData>) => void;
  onSave: () => void;
  loading?: boolean;
  creating?: boolean;
  updating?: boolean;
  error?: any;
  success?: boolean;
  successMessage?: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  open,
  onClose,
  editingService,
  serviceFormData,
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
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  const isLoading = creating || updating || loading || isProcessingImages;
  const isEditing = !!editingService?.id;

  const getPreviewUrl = (img: File | string): string => {
    if (img instanceof File) return URL.createObjectURL(img);
    return getFullImageUrl(img) || img;
  };

  const formImages = serviceFormData.images;
  useEffect(() => {
    const images = Array.isArray(formImages) ? formImages : [];
    const urls = images.map((img) => getPreviewUrl(img));
    setImagePreviewUrls(urls);
    return () => urls.forEach((u) => (u.startsWith('blob:') ? URL.revokeObjectURL(u) : null));
  }, [open, editingService?.id, formImages?.length]);

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

    if (!serviceFormData.name?.trim()) {
      errors.name = 'Service name is required';
    }

    if (!serviceFormData.category?.trim()) {
      errors.category = 'Category is required';
    }

    const description = (serviceFormData.description || '').trim();
    if (description.length > 0 && description.length < 10) {
      errors.description = 'Description must be at least 10 characters (or leave empty)';
    }

    if (serviceFormData.price === undefined || serviceFormData.price === null || serviceFormData.price < 0) {
      errors.price = 'Valid price is required';
    }

    const duration = serviceFormData.duration_minutes ?? serviceFormData.duration;
    if (duration === undefined || duration === null || duration < 15) {
      errors.duration = 'Duration must be at least 15 minutes';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    const next = { ...serviceFormData, [field]: value };
    if (field === 'duration' || field === 'duration_minutes') {
      const d = Number(value);
      next.duration = d;
      next.duration_minutes = d;
    }
    onFormDataChange(next);
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const nextErr = { ...prev };
        delete nextErr[field];
        return nextErr;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const currentImages = serviceFormData.images || [];
    const slotsLeft = 5 - currentImages.length;
    if (slotsLeft <= 0) return;

    const toProcess: File[] = [];
    for (let i = 0; i < Math.min(files.length, slotsLeft); i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, images: 'File size must be less than 5MB' }));
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({ ...prev, images: 'Please upload image files only' }));
        continue;
      }
      toProcess.push(file);
    }

    if (toProcess.length === 0) return;

    setIsProcessingImages(true);
    try {
      const optimizedFiles = await Promise.all(
        toProcess.map((file) => optimizeImage(file, { maxWidth: 1200, quality: 0.85 }))
      );
      const newImages = [...currentImages, ...optimizedFiles];
      handleFieldChange('images', newImages);
      setImagePreviewUrls(newImages.map((img) => (img instanceof File ? URL.createObjectURL(img) : getFullImageUrl(img) || img)));
      if (formErrors.images) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.images;
          return next;
        });
      }
    } catch (err) {
      console.error('Image optimization failed:', err);
      setFormErrors((prev) => ({ ...prev, images: 'Failed to process image. Please try again.' }));
    } finally {
      setIsProcessingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = serviceFormData.images || [];
    const urlToRevoke = imagePreviewUrls[index];
    if (urlToRevoke?.startsWith('blob:')) URL.revokeObjectURL(urlToRevoke);
    const updatedImages = currentImages.filter((_, i) => i !== index);
    const updatedPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    handleFieldChange('images', updatedImages);
    setImagePreviewUrls(updatedPreviewUrls);
  };

  const handleSaveClick = () => {
    if (validateForm()) onSave();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '48px',
          p: 1,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          color: 'text.primary',
        },
      }}
    >
      <DialogTitle sx={{ p: 4, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
              {isEditing ? 'Edit Service' : 'Add Service'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? 'Update the details of this service' : 'Add a new service to your salon menu'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={isLoading}
            sx={{ border: '1.5px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 2, pb: 0, maxHeight: '80vh', overflow: 'auto', overflowX: 'visible', color: 'text.primary' }}>
        <Stack spacing={3} sx={{ pt: 0.5 }}>
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
                '& .MuiAlert-message': { fontWeight: 600, fontSize: '14px' },
              }}
            >
              {successMessage || (isEditing ? 'Service updated successfully!' : 'Service added successfully!')}
            </Alert>
          )}

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
                '& .MuiAlert-message': { fontWeight: 600, fontSize: '14px' },
              }}
            >
              {typeof error === 'string' ? error : error?.message || 'An error occurred. Please try again.'}
            </Alert>
          )}

          <Stack
            spacing={2.5}
            sx={{
              pt: 0.5,
              '& .MuiInputLabel-root': { fontWeight: 600 },
            }}
          >
            <TextField
              fullWidth
              label={<>Service Name <RequiredIndicator /></>}
              value={serviceFormData.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g., Ultimate Hair Transformation"
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isLoading}
              InputLabelProps={formLabelProps}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Sparkles size={18} color="inherit" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '20px', fontWeight: 600 },
              }}
            />

            <TextField
              fullWidth
              select
              label={<>Category <RequiredIndicator /></>}
              value={serviceFormData.category || ''}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              error={!!formErrors.category}
              helperText={formErrors.category}
              disabled={isLoading}
              InputLabelProps={formLabelProps}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              MenuProps={{
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
              }}
            >
              {ServiceMenuCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Description (optional)"
              multiline
              rows={2}
              value={serviceFormData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Describe this service... (optional; if provided, min 10 characters)"
              error={!!formErrors.description}
              helperText={formErrors.description}
              disabled={isLoading}
              InputLabelProps={formLabelProps}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label={<>Price (LKR) <RequiredIndicator /></>}
                type="number"
                value={serviceFormData.price ?? ''}
                onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                placeholder="e.g., 2500"
                error={!!formErrors.price}
                helperText={formErrors.price}
                disabled={isLoading}
                InputLabelProps={formLabelProps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>Rs.</Typography>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '16px' },
                }}
              />
              <TextField
                fullWidth
                label={<>Duration (Min) <RequiredIndicator /></>}
                type="number"
                value={(serviceFormData.duration_minutes ?? serviceFormData.duration) ?? ''}
                onChange={(e) => handleFieldChange('duration', Number(e.target.value))}
                placeholder="e.g., 60"
                error={!!formErrors.duration}
                helperText={formErrors.duration}
                disabled={isLoading}
                InputLabelProps={formLabelProps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                        <Clock size={18} strokeWidth={2} />
                        <Typography variant="caption" sx={{ fontWeight: 900 }}>min</Typography>
                      </Stack>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '16px' },
                }}
              />
            </Stack>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>
                SERVICE IMAGES (Optional, max 5) {imagePreviewUrls.length > 0 && `(${imagePreviewUrls.length}/5)`}
              </Typography>
              {imagePreviewUrls.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  {imagePreviewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <img src={url} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isLoading}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: '#EF4444',
                          color: 'white',
                          width: 24,
                          height: 24,
                          '&:hover': { bgcolor: '#DC2626' },
                        }}
                      >
                        <X size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
              <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="service-images-upload"
                disabled={isLoading || imagePreviewUrls.length >= 5}
              />
              <label htmlFor="service-images-upload">
                <Button
                  component="span"
                  variant="outlined"
                  fullWidth
                  disabled={isLoading || imagePreviewUrls.length >= 5}
                  startIcon={isProcessingImages ? <CircularProgress size={18} color="inherit" /> : <Upload size={18} />}
                  sx={{
                    borderRadius: '16px',
                    borderColor: formErrors.images ? '#EF4444' : 'divider',
                    color: formErrors.images ? '#EF4444' : 'text.primary',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': { bgcolor: formErrors.images ? 'rgba(239, 68, 68, 0.05)' : 'action.hover' },
                  }}
                >
                  Add Service Images (Optional, Max 5)
                </Button>
              </label>
              {formErrors.images && (
                <Typography sx={{ color: '#EF4444', fontSize: '12px', fontWeight: 600, mt: 1 }}>{formErrors.images}</Typography>
              )}
            </Box>
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
            '&:hover': { bgcolor: 'text.primary', opacity: 0.9, transform: 'translateY(-1px)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
            '&:disabled': { bgcolor: 'text.disabled', opacity: 0.5 },
          }}
        >
          {isLoading && <CircularProgress size={20} sx={{ color: 'inherit' }} />}
          {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Service' : 'Add to Menu')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
