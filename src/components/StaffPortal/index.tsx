import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Rating,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Clock,
  AlertCircle,
  ClipboardList,
  Coins,
  TrendingUp,
  History,
  Star,
  ChevronRight,
  Zap,
  BarChart3,
  MessageSquare,
  Sparkles,
  Repeat,
  ArrowLeft,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/state/store';
import { useStaff } from '@/state/staff';
import { getSalonAppointmentsApi } from '@/services/api/appointmentService';
import { getStaffStatsApi, type StaffStats } from '@/services/api/staffService';
import { ROUTES } from '@/routes/routeConfig';

interface PortalAppointment {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  allergies?: string;
  duration?: number;
}

const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (h === 0 && m === 0) return '12:00 AM';
  if (h === 12) return `12:${String(m).padStart(2, '0')} PM`;
  if (h > 12) return `${h - 12}:${String(m).padStart(2, '0')} PM`;
  return `${h}:${String(m).padStart(2, '0')} AM`;
};

const StaffPortal: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const salon = useSelector((state: RootState) => state.salon.salon);
  const { currentStaff, itemLoading, handleGetStaffById } = useStaff();

  const [appointments, setAppointments] = useState<PortalAppointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [staffStats, setStaffStats] = useState<StaffStats | null>(null);
  const [staffStatsLoading, setStaffStatsLoading] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const salonId = (currentStaff as any)?.salonId ?? (currentStaff as any)?.salon_id ?? salon?.id ?? null;

  useEffect(() => {
    if (staffId) {
      handleGetStaffById(staffId);
    }
  }, [staffId, handleGetStaffById]);

  useEffect(() => {
    if (!staffId) {
      setStaffStats(null);
      return;
    }
    let cancelled = false;
    setStaffStatsLoading(true);
    getStaffStatsApi(staffId)
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data ?? null;
        setStaffStats(data);
      })
      .catch(() => {
        if (!cancelled) setStaffStats(null);
      })
      .finally(() => {
        if (!cancelled) setStaffStatsLoading(false);
      });
    return () => { cancelled = true; };
  }, [staffId]);

  useEffect(() => {
    if (!salonId || !staffId) {
      setAppointments([]);
      return;
    }
    let cancelled = false;
    setAppointmentsLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    getSalonAppointmentsApi(salonId, today)
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(data) ? data : [];
        const mapped: PortalAppointment[] = list
          .filter((b: any) => (b.staff_id || '') === staffId)
          .map((b: any) => {
            const customerName = (b as any).customer_name
              || (b.user ? `${(b.user.first_name || '').trim()} ${(b.user.last_name || '').trim()}`.trim() : '')
              || 'Customer';
            let timeStr = '';
            if (b.start_time) {
              if (typeof b.start_time === 'string' && b.start_time.includes('T')) {
                const t = new Date(b.start_time);
                timeStr = `${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
              } else {
                timeStr = String(b.start_time).slice(0, 5);
              }
            }
            const dateStr = b.booking_date ? (typeof b.booking_date === 'string' ? b.booking_date.slice(0, 10) : new Date(b.booking_date).toISOString().slice(0, 10)) : today;
            const serviceName = b.booking_services?.[0]?.service?.name || 'Service';
            const duration = b.booking_services?.[0]?.duration ?? 30;
            let notes = '';
            let allergies = '';
            if (b.notes && typeof b.notes === 'string') {
              try {
                const parsed = JSON.parse(b.notes);
                if (parsed?.text) notes = parsed.text;
              } catch {
                notes = b.notes;
              }
            }
            return {
              id: b.id,
              customerName,
              serviceId: b.service_id || '',
              serviceName,
              staffId: b.staff_id || '',
              date: dateStr,
              time: timeStr,
              status: (b.status || 'PENDING').toLowerCase(),
              notes,
              allergies,
              duration,
            };
          })
          .sort((a, b) => a.time.localeCompare(b.time));
        setAppointments(mapped);
        if (mapped.length > 0 && !activeAppointmentId) {
          setActiveAppointmentId(mapped[0].id);
          setTimeRemaining(mapped[0].duration ?? 30);
        }
      })
      .catch(() => {
        if (!cancelled) setAppointments([]);
      })
      .finally(() => {
        if (!cancelled) setAppointmentsLoading(false);
      });
    return () => { cancelled = true; };
  }, [salonId, staffId]);

  const activeAppointment = useMemo(() => appointments.find((a) => a.id === activeAppointmentId), [appointments, activeAppointmentId]);

  const commissionRate = currentStaff?.commissionRate ?? 0;
  const commissionPercent = commissionRate > 1 ? Math.round(commissionRate) : Math.round(commissionRate * 100);

  const stats = useMemo(() => {
    const revenue = currentStaff?.monthlyRevenue ?? 0;
    return [
      { label: "Today's tips", value: `Rs. ${Math.round(revenue / 30)}`, icon: <Coins size={18} />, color: theme.palette.success.main },
      { label: 'Commission earned', value: `${commissionPercent}%`, icon: <TrendingUp size={18} />, color: theme.palette.secondary.main },
      { label: 'Appointments today', value: `${appointments.length}`, icon: <Zap size={18} />, color: theme.palette.secondary.main },
    ];
  }, [currentStaff, appointments.length, commissionPercent, theme.palette.success.main, theme.palette.secondary.main]);

  const performanceMetrics = useMemo(() => ({
    rebookingRate: staffStats?.rebookingRate ?? null,
    onTimeRate: staffStats?.onTimeRate ?? null,
    cancelRate: staffStats?.cancelRate ?? 0,
  }), [staffStats]);

  if (!staffId) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>Select a staff member to view their portal.</Typography>
        <Button variant="contained" disableElevation startIcon={<ArrowLeft size={18} />} onClick={() => navigate(`${ROUTES.SALON_PROFILE}?tab=staff`)} sx={{ borderRadius: '100px', fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'grey.800' } }}>
          Back to Staff
        </Button>
      </Box>
    );
  }

  if (itemLoading && !currentStaff) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  if (!currentStaff) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>Staff member not found.</Typography>
        <Button variant="contained" disableElevation startIcon={<ArrowLeft size={18} />} onClick={() => navigate(`${ROUTES.SALON_PROFILE}?tab=staff`)} sx={{ borderRadius: '100px', fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'grey.800' } }}>
          Back to Staff
        </Button>
      </Box>
    );
  }

  const staffName = currentStaff.name || 'Staff';
  const firstName = staffName.split(' ')[0] || 'Staff';

  return (
    <Box sx={{ pb: 10, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }} className="animate-fadeIn">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, minWidth: 0 }}>
        <IconButton onClick={() => navigate(`${ROUTES.SALON_PROFILE}?tab=staff`)} sx={{ color: 'text.secondary', flexShrink: 0 }} aria-label="Back to Staff">
          <ArrowLeft size={24} />
        </IconButton>
        <Avatar src={currentStaff.avatar} sx={{ width: { xs: 56, md: 80 }, height: { xs: 56, md: 80 }, border: '4px solid', borderColor: 'background.paper', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Hello, {firstName}</Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              label={currentStaff.status === 'active' ? 'On duty' : (currentStaff.status || 'Inactive')}
              size="small"
              sx={{ bgcolor: currentStaff.status === 'active' ? 'success.main' : 'text.secondary', color: currentStaff.status === 'active' ? 'success.contrastText' : 'background.paper', fontWeight: 900, fontSize: '10px' }}
            />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star size={14} fill={theme.palette.secondary.main} color={theme.palette.secondary.main} />
              <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{Number(currentStaff.rating) || 0}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{currentStaff.role}</Typography>
          </Stack>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {activeAppointment && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: isDarkMode ? alpha(theme.palette.secondary.main, 0.08) : alpha(theme.palette.secondary.main, 0.05),
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'secondary.main', letterSpacing: '0.1em', mb: 1 }}>Now active</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{activeAppointment.customerName}</Typography>
                    <Typography variant="body2" color="text.secondary">{activeAppointment.serviceName}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900 }}>{timeRemaining}m</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>Remaining</Typography>
                  </Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={((activeAppointment.duration || 30) - timeRemaining) / (activeAppointment.duration || 30) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 6 },
                  }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="contained" disableElevation fullWidth sx={{ borderRadius: '100px', py: 1.5, fontWeight: 900, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'grey.800' } }}>
                    Complete appointment
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: '100px', minWidth: 120, fontWeight: 900, borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { borderColor: 'secondary.dark', color: 'secondary.dark', bgcolor: 'action.hover' } }}>
                    Add extra
                  </Button>
                </Stack>
              </Paper>
            )}

            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                <BarChart3 size={20} color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Staff scorecard</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ p: 3, borderRadius: '24px', bgcolor: 'action.hover', height: '100%' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.05em', mb: 2 }}>Client feedback</Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: '16px', textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{Number(currentStaff.rating) || 0}</Typography>
                      <Rating value={Number(currentStaff.rating) || 0} precision={0.1} readOnly size="small" sx={{ color: 'secondary.main' }} />
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>Average rating</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', borderRadius: '10px' }}><Repeat size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>Rebooking rate</Typography>
                          <Typography variant="caption" color="text.secondary">Clients who return within 8 weeks</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main' }}>{performanceMetrics.rebookingRate != null ? `${performanceMetrics.rebookingRate}%` : '—'}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', borderRadius: '10px' }}><Clock size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>On-time start</Typography>
                          <Typography variant="caption" color="text.secondary">Appointments started within 5 min</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>{performanceMetrics.onTimeRate != null ? `${performanceMetrics.onTimeRate}%` : '—'}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', borderRadius: '10px' }}><AlertCircle size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>Cancel responsibility</Typography>
                          <Typography variant="caption" color="text.secondary">Staff-initiated cancellations</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'error.main' }}>{performanceMetrics.cancelRate}%</Typography>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Upcoming appointments</Typography>
              {appointmentsLoading ? (
                <Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
              ) : appointments.filter((a) => a.id !== activeAppointmentId).length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3 }}>No more appointments today.</Typography>
              ) : (
                <Stack spacing={2}>
                  {appointments.filter((a) => a.id !== activeAppointmentId).map((apt) => (
                    <Paper
                      key={apt.id}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '20px',
                        border: '1.5px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>{formatTime(apt.time)}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{apt.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{apt.serviceName}</Typography>
                        </Box>
                      </Stack>
                      <IconButton onClick={() => { setActiveAppointmentId(apt.id); setTimeRemaining(apt.duration ?? 30); }}><ChevronRight size={20} /></IconButton>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ pt: 0 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <ClipboardList size={20} color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Client notes</Typography>
              </Stack>
              {activeAppointment ? (
                <Stack spacing={3}>
                  {activeAppointment.allergies ? (
                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: alpha(theme.palette.error.main, 0.08), border: '1.5px dashed', borderColor: alpha(theme.palette.error.main, 0.3) }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <AlertCircle size={18} color={theme.palette.error.main} />
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, color: theme.palette.error.main }}>Allergy</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{activeAppointment.allergies}</Typography>
                    </Box>
                  ) : null}
                  <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'action.hover' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', mb: 1 }}>Preferences</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontStyle: activeAppointment.notes ? 'italic' : undefined }}>{activeAppointment.notes || 'No special notes.'}</Typography>
                  </Box>
                  <Button variant="outlined" startIcon={<History size={16} />} sx={{ borderRadius: '100px', fontWeight: 800, textTransform: 'none', borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { borderColor: 'secondary.dark', color: 'secondary.dark', bgcolor: 'action.hover' } }}>
                    View appointment history
                  </Button>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Select an appointment to see client notes.</Typography>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', bgcolor: 'text.primary', color: 'background.paper' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 900, opacity: 0.7, letterSpacing: '0.05em', mb: 3 }}>Staff performance</Typography>
              <Stack spacing={3}>
                {stats.map((stat) => (
                  <Stack key={stat.label} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.1)', color: 'background.paper' }}>{stat.icon}</Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'background.paper' }}>{stat.label}</Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 900, color: stat.color }}>{stat.value}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Button fullWidth endIcon={<Sparkles size={16} />} sx={{ color: 'secondary.main', fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
                Analyze monthly performance
              </Button>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '24px',
                border: '1.5px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}><MessageSquare size={20} /></Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Team chat</Typography>
                <Typography variant="caption" color="text.secondary">Messages from the front desk</Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffPortal;
