import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography, 
  IconButton, Grid2, TextField, MenuItem, Box, alpha, InputAdornment, FormHelperText, Button, Paper, useTheme
} from '@mui/material';
import { X, Mail, Phone, MapPin, Type, Info } from 'lucide-react';
import { Vacancy } from '../types';
import { validateVacancyForm } from '../utils';
import RichEditor from '@/components/common/RichEditor';
import { RequiredIndicator } from '@/components/common/RequiredIndicator';

interface VacancyFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (vacancy: Partial<Vacancy>) => void;
  editingVacancy: Vacancy | null;
  isDark: boolean;
  isLoading?: boolean;
}

const VacancyForm: React.FC<VacancyFormProps> = ({ open, onClose, onSave, editingVacancy, isDark, isLoading }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<Vacancy>>({
    title: '',
    type: 'Full-time',
    description: '',
    requirements: ['Standard requirements apply'],
    experience: '',
    salaryRange: '',
    status: 'Open',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingVacancy) {
      setFormData(editingVacancy);
    } else {
      setFormData({
        title: '',
        type: 'Full-time',
        description: '',
        requirements: ['Standard requirements apply'],
        experience: '',
        salaryRange: '',
        status: 'Open',
        contactEmail: '',
        contactPhone: '',
        address: ''
      });
    }
    setErrors({});
  }, [editingVacancy, open]);

  const handleSave = () => {
    const newErrors = validateVacancyForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: isDark ? '#050914' : 'white',
          backgroundImage: 'none',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'divider'}`
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {editingVacancy ? 'Edit Job Opening' : 'New Job Opening'}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <X size={16} />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>JOB TITLE <RequiredIndicator /></Typography>
              <TextField 
                fullWidth 
                error={!!errors.title}
                helperText={errors.title}
                placeholder="e.g. Senior Hair Stylist"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>EMPLOYMENT TYPE</Typography>
              <TextField 
                fullWidth 
                select 
                disabled={isLoading}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
          
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', bgcolor: isDark ? alpha('#FFF', 0.02) : alpha('#000', 0.01), borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#EAB308', mb: 2, display: 'block', letterSpacing: '0.1em' }}>CONTACT INFORMATION</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>APPLICATION EMAIL <RequiredIndicator /></Typography>
                <TextField 
                  fullWidth 
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail}
                  placeholder="careers@glowmgmt.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Mail size={16} /></InputAdornment>
                  }}
                  disabled={isLoading}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>CONTACT NUMBER (OPTIONAL)</Typography>
                <TextField 
                  fullWidth 
                  label=""
                  error={!!errors.contactPhone}
                  helperText={errors.contactPhone}
                  placeholder="077 XXX XXXX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>+94</Typography>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>WORK LOCATION</Typography>
                <TextField 
                  fullWidth 
                  placeholder="e.g. 12-A Aesthetic Way"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MapPin size={16} /></InputAdornment>
                  }}
                  disabled={isLoading}
                />
              </Grid2>
            </Grid2>
          </Paper>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>EXPERIENCE REQUIRED <RequiredIndicator /></Typography>
              <TextField 
                fullWidth 
                error={!!errors.experience}
                helperText={errors.experience}
                placeholder="e.g. 5+ Years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                disabled={isLoading}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>SALARY RANGE</Typography>
              <TextField 
                fullWidth 
                placeholder="e.g. Rs. 80,000 - 120,000"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                disabled={isLoading}
              />
            </Grid2>
          </Grid2>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>JOB DESCRIPTION <RequiredIndicator /></Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#EAB308', fontSize: '9px' }}>RICH TEXT EDITOR</Typography>
                <Type size={10} color="#EAB308" />
              </Stack>
            </Stack>
            
            <RichEditor 
              value={formData.description || ''} 
              onChange={(val) => setFormData({ ...formData, description: val })}
              isDark={isDark}
              error={!!errors.description}
              placeholder="Describe the role, responsibilities, and your salon's culture..."
              disabled={isLoading}
            />
            {errors.description && <FormHelperText error sx={{ ml: 1, mt: 0.5 }}>{errors.description}</FormHelperText>}
            
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
               <Info size={12} color={theme.palette.text.secondary} />
               <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                 Use the toolbar to format your job description. This will be visible on the careers page.
               </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          fullWidth 
          variant="contained" 
          disableElevation
          onClick={handleSave}
          sx={{ 
            height: 52,
            borderRadius: '16px', 
            bgcolor: isDark ? 'white' : '#050914', 
            color: isDark ? '#050914' : 'white',
            fontWeight: 900,
            fontSize: '14px',
            '&:hover': { bgcolor: isDark ? '#F1F5F9' : '#1e293b' }
          }}
          disabled={isLoading}
        >
          {editingVacancy ? 'Save Changes' : 'Post Job Opening'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VacancyForm;