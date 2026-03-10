
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  Avatar, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Slider,
  Tooltip,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import { 
  UserPlus, 
  Pencil, 
  Calendar, 
  X, 
  Briefcase, 
  User, 
  Camera,
  CheckCircle2,
  TrendingUp,
  Star,
  MoreVertical,
  ChevronRight,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  Video as TikTok,
  Mail,
  Phone,
  Clock,
  Award,
  Globe,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/state/store';
import { useStaff } from '@/state/staff';
import { Staff } from './types';

function mapApiStaffToStaff(s: any): Staff {
  return {
    id: s.id,
    name: s.name ?? s.display_name ?? 'Staff',
    role: s.role ?? 'Artisan',
    email: s.email ?? '',
    phone: s.phone ?? '',
    bio: s.bio ?? '',
    specialties: s.specialties ?? [],
    socials: s.socials ?? {},
    experience: s.experience ?? 0,
    joinedDate: s.joinedDate ?? s.joined_date ?? new Date().toISOString().split('T')[0],
    commissionRate: s.commissionRate ?? s.commission_rate ?? 0.2,
    status: s.status ?? 'active',
    avatar: s.avatar ?? s.avatar_url ?? '',
    rating: s.rating ?? 0,
    monthlyRevenue: s.monthlyRevenue ?? s.monthly_revenue ?? 0,
  };
}

const StaffList: React.FC = () => {
  const theme = useTheme();
  const salon = useSelector((state: RootState) => state.salon.salon);
  const salonId = salon?.id ?? null;
  const { staffList: staffListFromApi, loading, handleGetStaff, handleCreateStaff, handleUpdateStaff } = useStaff();
  const staffList = staffListFromApi.map(mapApiStaffToStaff);

  useEffect(() => {
    if (salonId) handleGetStaff(salonId);
  }, [salonId, handleGetStaff]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [agreedToManifesto, setAgreedToManifesto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '', role: '', email: '', phone: '', bio: '', specialties: [],
    socials: { instagram: '', tiktok: '', facebook: '', linkedin: '' },
    experience: 5, joinedDate: new Date().toISOString().split('T')[0],
    commissionRate: 0.2, status: 'active', avatar: '',
  });

  const handleOpenModal = (staff?: Staff) => {
    setAgreedToManifesto(false);
    setErrors({});
    if (staff) {
      setEditingStaff(staff);
      setNewStaff(staff);
    } else {
      setEditingStaff(null);
      setNewStaff({
        name: '', role: '', email: '', phone: '', bio: '', specialties: [],
        socials: { instagram: '', tiktok: '', facebook: '', linkedin: '' },
        experience: 5, joinedDate: new Date().toISOString().split('T')[0],
        commissionRate: 0.2, status: 'active', avatar: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddStaff = () => {
    const newErrors: Record<string, string> = {};
    if (!newStaff.name) newErrors.name = 'Artisan identity required.';
    if (!newStaff.role) newErrors.role = 'Professional role required.';
    if (!newStaff.email) newErrors.email = 'Portal e-mail required.';
    if (!agreedToManifesto && !editingStaff) newErrors.manifesto = 'The Glow Manifesto must be acknowledged.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: newStaff.name!,
      role: newStaff.role!,
      email: newStaff.email!,
      phone: newStaff.phone ?? '',
      bio: newStaff.bio ?? '',
      specialties: newStaff.specialties ?? [],
      socials: newStaff.socials ?? {},
      experience: newStaff.experience ?? 0,
      joinedDate: newStaff.joinedDate ?? new Date().toISOString().split('T')[0],
      commissionRate: newStaff.commissionRate ?? 0.2,
      status: (newStaff.status as any) ?? 'active',
      avatar: newStaff.avatar ?? undefined,
      ...(salonId && !editingStaff ? { salon_id: salonId } : {}),
    };

    if (editingStaff) {
      handleUpdateStaff(editingStaff.id, payload);
    } else {
      handleCreateStaff(payload);
    }
    handleCloseModal();
  };

  const getStatusChip = (status: Staff['status']) => {
    switch (status) {
      case 'active': return <Chip label="ACTIVE" size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }} />;
      case 'on-leave': return <Chip label="ON LEAVE" size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }} />;
      case 'blocked': return <Chip label="BLOCKED" size="small" icon={<Ban size={12} />} sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }} />;
      default: return <Chip label="INACTIVE" size="small" sx={{ fontWeight: 900, borderRadius: '8px', bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }} />;
    }
  };

  if (loading && staffList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: '#EAB308' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }} className="animate-fadeIn">
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 6, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, letterSpacing: '-0.04em', fontWeight: 900 }}>Artisan Collective</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Curate and manage your world-class team of aesthetic professionals.</Typography>
        </Box>
        <Button variant="contained" disableElevation onClick={() => handleOpenModal()} startIcon={<UserPlus size={20} />} sx={{ borderRadius: '100px', bgcolor: '#0F172A', px: 4, py: 1.5, fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#1E293B' } }}>Enroll Artisan</Button>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}><TableRow><TableCell sx={{ py: 3, fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>ARTISAN PROFILE</TableCell><TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>CONTACTS</TableCell><TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>STATUS</TableCell><TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>COMMISSION</TableCell><TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>PERFORMANCE</TableCell><TableCell align="right" sx={{ pr: 4, fontWeight: 800, color: 'text.secondary', fontSize: '12px', letterSpacing: '0.1em' }}>ACTIONS</TableCell></TableRow></TableHead>
          <TableBody>
            {staffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
                  No staff enrolled yet. Click &quot;Enroll Artisan&quot; to add your first team member.
                </TableCell>
              </TableRow>
            ) : staffList.map((staff) => (
              <TableRow key={staff.id} hover sx={{ transition: 'background-color 0.2s', opacity: staff.status === 'blocked' ? 0.6 : 1 }}>
                <TableCell sx={{ py: 3 }}><Stack direction="row" spacing={2} alignItems="center"><Avatar src={staff.avatar} sx={{ width: 52, height: 52, border: '2px solid', borderColor: 'divider' }} /><Box><Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{staff.name}</Typography><Typography sx={{ fontSize: '12px', color: 'text.secondary', fontWeight: 600 }}>{staff.role}</Typography></Box></Stack></TableCell>
                <TableCell><Stack spacing={0.5}><Stack direction="row" spacing={1} alignItems="center"><Mail size={12} color={theme.palette.text.secondary} /><Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{staff.email}</Typography></Stack><Stack direction="row" spacing={1} alignItems="center"><Phone size={12} color={theme.palette.text.secondary} /><Typography sx={{ fontSize: '12px', fontWeight: 500, color: 'text.secondary' }}>{staff.phone}</Typography></Stack></Stack></TableCell>
                <TableCell>{getStatusChip(staff.status)}</TableCell>
                <TableCell><Chip label={`${Math.round(staff.commissionRate * 100)}%`} size="small" sx={{ fontWeight: 900, borderRadius: '8px' }} /></TableCell>
                <TableCell><Stack direction="row" spacing={1} alignItems="center"><Star size={14} fill={theme.palette.secondary.main} color={theme.palette.secondary.main} /><Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{staff.rating}</Typography></Stack></TableCell>
                <TableCell align="right" sx={{ pr: 3 }}><Stack direction="row" spacing={1} justifyContent="flex-end"><Tooltip title="Edit Dossier"><IconButton size="small" onClick={() => handleOpenModal(staff)}><Pencil size={18} /></IconButton></Tooltip><IconButton size="small"><ShieldCheck size={18} color={theme.palette.success.main} /></IconButton></Stack></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '48px', p: 1 } }}>
        <DialogTitle sx={{ p: 4, pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h5" sx={{ fontWeight: 900 }}>{editingStaff ? 'Refine Artisan' : 'Enroll Artisan'}</Typography><IconButton onClick={handleCloseModal} size="small"><X size={20} /></IconButton></Stack>
          <Typography variant="body2" color="text.secondary">Provide the professional dossier for this aesthetic expert.</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 2 }}>
          <Stack spacing={4}>
            <Box><Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', display: 'block', mb: 2 }}>IDENTITY & ACCESS</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} error={!!errors.name} helperText={errors.name} InputProps={{ sx: { borderRadius: '20px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Professional Role" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} error={!!errors.role} helperText={errors.role} InputProps={{ sx: { borderRadius: '20px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Portal Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} error={!!errors.email} helperText={errors.email} InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment>, sx: { borderRadius: '20px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Shift Status" value={newStaff.status} onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value as any })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}>
                    <MenuItem value="active">Active Duty</MenuItem><MenuItem value="on-leave">Sabbatical</MenuItem><MenuItem value="inactive">Archived</MenuItem><MenuItem value="blocked" sx={{ color: '#EF4444' }}>Blocked</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography variant="caption" sx={{ fontWeight: 900 }}>COMMISSION YIELD</Typography><Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main' }}>{Math.round((newStaff.commissionRate || 0) * 100)}%</Typography></Stack>
              <Slider value={(newStaff.commissionRate || 0) * 100} onChange={(_, v) => setNewStaff({ ...newStaff, commissionRate: (v as number) / 100 })} min={0} max={50} sx={{ color: 'secondary.main' }} />
            </Box>
            
            {!editingStaff && (
              <Box>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      size="small" 
                      checked={agreedToManifesto}
                      onChange={(e) => setAgreedToManifesto(e.target.checked)}
                      sx={{ color: errors.manifesto ? 'error.main' : 'divider', '&.Mui-checked': { color: 'secondary.main' } }} 
                    />
                  } 
                  label={
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: errors.manifesto ? 'error.main' : 'text.primary' }}>
                      I acknowledge the <Box component="span" sx={{ fontWeight: 900 }}>Glow Manifesto</Box> and collective guidelines.
                    </Typography>
                  } 
                />
                {errors.manifesto && <Typography sx={{ fontSize: '11px', color: 'error.main', ml: 4, mt: 0.5, fontWeight: 700 }}>{errors.manifesto}</Typography>}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button fullWidth variant="contained" disableElevation onClick={handleAddStaff} sx={{ borderRadius: '100px', bgcolor: 'text.primary', py: 2, fontWeight: 900 }}>{editingStaff ? 'Update Dossier' : 'Confirm Enrollment'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffList;
