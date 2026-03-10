import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid2,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Chip,
  InputAdornment,
  alpha,
  useTheme,
  Switch,
  Divider,
  Alert
} from '@mui/material';
import { ChevronRight, ChevronLeft, Check, Percent, Clock, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCreatePromotionForm, PROMOTION_STEPS, PROMOTION_TYPES } from './hooks';
import type { PromotionType } from './hooks';

export const CreatePromotion: React.FC<{
  salonId: string;
  editPromotionId?: string;
  duplicateFromId?: string;
  onCancel: () => void;
  onSave: () => void;
}> = ({ salonId, editPromotionId, duplicateFromId, onCancel, onSave }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const {
    activeStep,
    formData,
    services,
    fieldErrors,
    loadingEdit,
    isEdit,
    displayError,
    handleNext,
    handleBack,
    handleFieldChange,
    handleSubmit,
    clearSubmitError,
    handleClearError,
    isSubmitting,
  } = useCreatePromotionForm({ salonId, editPromotionId, duplicateFromId, onSave });

  const steps = PROMOTION_STEPS;
  const promotionTypes = [...PROMOTION_TYPES];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Basic Information</Typography>
              <Typography variant="body2" color="text.secondary">Define the core details of your promotion.</Typography>
            </Box>
            <TextField
              fullWidth
              label="Promotion Title"
              placeholder="e.g., Summer Glow Special"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              error={!!fieldErrors.title}
              helperText={fieldErrors.title}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Tell your customers what makes this offer special..."
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            <FormControl fullWidth>
              <InputLabel>Promotion Type</InputLabel>
              <Select
                value={formData.type}
                label="Promotion Type"
                onChange={(e) => handleFieldChange('type', e.target.value)}
                sx={{ borderRadius: '16px' }}
              >
                {promotionTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {(formData.type as PromotionType) === 'Campaign' || (formData.type as PromotionType) === 'First-Time Offer' ? (
              <TextField
                fullWidth
                label="Promo Code"
                placeholder="e.g., NEWUSER10"
                value={formData.code}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                error={!!fieldErrors.code}
                helperText={fieldErrors.code || 'Customers enter this code at checkout'}
                inputProps={{ maxLength: 50 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
            ) : null}
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Discount Configuration</Typography>
              <Typography variant="body2" color="text.secondary">Choose how much your customers will save.</Typography>
            </Box>
            
            {(formData.type as PromotionType) !== 'Bundle Package' && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: '24px', 
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: '1.5px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1)
                }}
              >
                <RadioGroup
                  value={formData.discountType}
                  onChange={(e) => handleFieldChange('discountType', e.target.value)}
                >
                  <Stack direction="row" spacing={4}>
                    <FormControlLabel 
                      value="percentage" 
                      control={<Radio color="warning" />} 
                      label={<Typography sx={{ fontWeight: 800 }}>Percentage (%)</Typography>} 
                    />
                    <FormControlLabel 
                      value="fixed" 
                      control={<Radio color="warning" />} 
                      label={<Typography sx={{ fontWeight: 800 }}>Fixed Amount (Rs.)</Typography>} 
                    />
                  </Stack>
                </RadioGroup>
              </Paper>
            )}

            {(formData.type as PromotionType) === 'Bundle Package' ? (
              <TextField
                fullWidth
                label="Bundle Price"
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => handleFieldChange('bundlePrice', e.target.value)}
                error={!!fieldErrors.bundlePrice}
                helperText={fieldErrors.bundlePrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontWeight: 900 }}>Rs.</Typography>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '16px', fontWeight: 900, fontSize: '1.2rem' }
                }}
              />
            ) : (
              <TextField
                fullWidth
                label="Discount Value"
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleFieldChange('discountValue', e.target.value)}
                error={!!fieldErrors.discountValue}
                helperText={fieldErrors.discountValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formData.discountType === 'percentage' ? <Percent size={18} /> : <Typography sx={{ fontWeight: 900 }}>Rs.</Typography>}
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '16px', fontWeight: 900, fontSize: '1.2rem' }
                }}
              />
            )}

            {/* Live Preview Card */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>LIVE PREVIEW</Typography>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: '24px', 
                  bgcolor: '#EAB308', 
                  color: '#050914',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 24px -8px rgba(234, 179, 8, 0.4)'
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {(formData.type as PromotionType) === 'Bundle Package'
                      ? `Rs.${formData.bundlePrice || '0'} Bundle`
                      : formData.discountType === 'percentage'
                        ? `${formData.discountValue || '0'}% OFF`
                        : `Rs.${formData.discountValue || '0'} OFF`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.8 }}>
                    {formData.title || 'Your Promotion Title'}
                  </Typography>
                </Box>
                <Sparkles size={40} opacity={0.5} />
              </Paper>
            </Box>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Service Selection</Typography>
              <Typography variant="body2" color="text.secondary">Select which services are included in this offer.</Typography>
            </Box>
            <Autocomplete
              multiple
              options={services}
              getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
              value={services.filter((s) => formData.selectedServiceIds.includes(s.id))}
              onChange={(_, newValue) => handleFieldChange('selectedServiceIds', newValue.map((s) => (typeof s === 'string' ? '' : s.id)).filter(Boolean))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Services"
                  placeholder="Type to search..."
                  error={!!fieldErrors.selectedServiceIds}
                  helperText={fieldErrors.selectedServiceIds}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={typeof option === 'string' ? option : option.name}
                      {...tagProps}
                      sx={{ borderRadius: '8px', fontWeight: 700 }}
                    />
                  );
                })
              }
            />
            {services.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {services.slice(0, 6).map((svc) => (
                  <Chip
                    key={svc.id}
                    label={svc.name}
                    onClick={() => {
                      if (!formData.selectedServiceIds.includes(svc.id)) {
                        handleFieldChange('selectedServiceIds', [...formData.selectedServiceIds, svc.id]);
                      }
                    }}
                    variant="outlined"
                    sx={{ borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )}
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Duration & Timing</Typography>
              <Typography variant="body2" color="text.secondary">Set when this promotion will be active.</Typography>
            </Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            error={!!fieldErrors.startDate}
            helperText={fieldErrors.startDate}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            error={!!fieldErrors.endDate}
            helperText={fieldErrors.endDate}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
        </Grid2>
      </Grid2>

            <Divider />

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={18} color="#EAB308" /> Happy Hour Timing
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Restrict offer to specific hours of the day.</Typography>
                </Box>
                <Switch 
                  checked={formData.isHappyHour} 
                  onChange={(e) => handleFieldChange('isHappyHour', e.target.checked)}
                  color="warning"
                />
              </Stack>

              <AnimatePresence>
                {formData.isHappyHour && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                  <Grid2 container spacing={2} sx={{ mt: 1 }}>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="From"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={formData.happyHourStart}
                        onChange={(e) => handleFieldChange('happyHourStart', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="To"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={formData.happyHourEnd}
                        onChange={(e) => handleFieldChange('happyHourEnd', e.target.value)}
                        error={!!fieldErrors.happyHourEnd}
                        helperText={fieldErrors.happyHourEnd}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                      />
                    </Grid2>
                  </Grid2>
                    <Typography variant="caption" sx={{ mt: 2, display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                      Example: Monday – Thursday, 10 AM – 2 PM
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Limits & Visibility</Typography>
              <Typography variant="body2" color="text.secondary">Finalize the rules for your promotion.</Typography>
            </Box>
            
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Priority"
            type="number"
            placeholder="0"
            value={formData.priority}
            onChange={(e) => handleFieldChange('priority', e.target.value)}
            error={!!fieldErrors.priority}
            helperText={fieldErrors.priority || 'Higher = shown first (0 = default)'}
            inputProps={{ min: 0 }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Total Usage Limit"
            type="number"
            placeholder="e.g., 100"
            value={formData.usageLimit}
            onChange={(e) => handleFieldChange('usageLimit', e.target.value)}
            error={!!fieldErrors.usageLimit}
            helperText={fieldErrors.usageLimit || 'Max uses (empty = unlimited)'}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Per-User Limit"
            type="number"
            value={formData.perUserLimit}
            onChange={(e) => handleFieldChange('perUserLimit', e.target.value)}
            error={!!fieldErrors.perUserLimit}
            helperText={fieldErrors.perUserLimit || 'Uses per customer'}
            inputProps={{ min: 1 }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
        </Grid2>
      </Grid2>

            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: '24px', 
                border: '1.5px solid', 
                borderColor: formData.isFeatured ? '#EAB308' : 'divider',
                bgcolor: formData.isFeatured ? alpha('#EAB308', 0.05) : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#EAB308', color: '#050914' }}>
                    <Star size={20} fill="currentColor" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                      Featured Promotion <Chip label="PAID AD" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 900, bgcolor: '#050914', color: 'white' }} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Boost visibility by showing this offer at the top of the app.
                    </Typography>
                  </Box>
                </Stack>
                <Switch 
                  checked={formData.isFeatured} 
                  onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                  color="warning"
                />
              </Stack>
            </Paper>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            {isEdit ? 'Edit' : 'Create'} <Box component="span" sx={{ color: '#EAB308' }}>Promotion</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Follow the steps to launch your new marketing campaign.
          </Typography>
        </Box>
        <Button 
          variant="text" 
          onClick={onCancel}
          sx={{ fontWeight: 800, color: 'text.secondary', borderRadius: '12px' }}
        >
          CANCEL
        </Button>
      </Stack>

      {displayError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => {
            clearSubmitError();
            handleClearError();
          }}
        >
          {displayError}
        </Alert>
      )}
      {loadingEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>Loading promotion...</Alert>
      )}
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ 
          mb: 8,
          '& .MuiStepIcon-root.Mui-active': { color: '#EAB308' },
          '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' },
          '& .MuiStepLabel-label': { fontWeight: 700, fontSize: '12px' }
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper 
        elevation={0}
        sx={{ 
          p: 5, 
          borderRadius: '40px', 
          border: '1.5px solid', 
          borderColor: 'divider',
          bgcolor: isDark ? '#0f172a' : 'white',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ChevronLeft size={18} />}
            sx={{ 
              borderRadius: '16px', 
              px: 4, 
              py: 1.5, 
              fontWeight: 800,
              border: '1.5px solid',
              borderColor: 'divider'
            }}
          >
            BACK
          </Button>
          <Box sx={{ flex: 1 }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || loadingEdit}
              startIcon={<Check size={18} />}
              sx={{ 
                borderRadius: '16px', 
                px: 6, 
                py: 1.5, 
                fontWeight: 900,
                bgcolor: '#EAB308',
                color: '#050914',
                '&:hover': { bgcolor: '#FACC15' }
              }}
            >
              {isSubmitting ? 'SAVING...' : isEdit ? 'UPDATE PROMOTION' : 'LAUNCH PROMOTION'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ChevronRight size={18} />}
              sx={{ 
                borderRadius: '16px', 
                px: 6, 
                py: 1.5, 
                fontWeight: 900,
                bgcolor: '#050914',
                color: 'white',
                '&:hover': { bgcolor: '#1e293b' }
              }}
            >
              CONTINUE
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};
