
import React, { useState, useEffect } from 'react';
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
  Fade,
  Tooltip,
  Rating
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Play,
  ClipboardList,
  Coins,
  TrendingUp,
  History,
  Star,
  ChevronRight,
  Zap,
  Flame,
  MessageSquare,
  Sparkles,
  Repeat,
  Target,
  BarChart3,
  ThumbsUp
} from 'lucide-react';
import { MOCK_APPOINTMENTS, SERVICES, STAFF } from './constants';
import { Appointment } from './types';

const StaffPortal: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Simulation: Logged in as Elena (st1)
  const currentArtisan = STAFF[0];
  const [appointments, setAppointments] = useState<Appointment[]>(
    MOCK_APPOINTMENTS.map(a => ({
      ...a,
      notes: a.id === 'a1' ? 'Prefers low-volume music. Uses specific organic balm.' : 'First time visit. Wants bold change.',
      allergies: a.id === 'a1' ? 'Allergic to synthetic Lavender extract.' : 'None reported.'
    })).filter(a => a.staffId === 'st1')
  );

  const [activeRitualId, setActiveRitualId] = useState<string | null>('a1');
  const [timeLeft, setTimeLeft] = useState(24); // mins remaining

  const activeRitual = appointments.find(a => a.id === activeRitualId);
  const activeService = SERVICES.find(s => s.id === activeRitual?.serviceId);

  const stats = [
    { label: 'Today Tips', value: 'LKR 4,200', icon: <Coins size={18} />, color: '#10B981' },
    { label: 'Comm. Earned', value: 'LKR 8,450', icon: <TrendingUp size={18} />, color: '#6366F1' },
    { label: 'Ritual Goal', value: '4/6', icon: <Zap size={18} />, color: '#B59410' },
  ];

  // Performance Transparency Metrics
  const performanceMetrics = {
    rebookingRate: 78,
    onTimeRate: 94,
    cancelResponsibility: 2, // percentage of cancels due to staff
    ratingBreakdown: [
      { stars: 5, count: 124 },
      { stars: 4, count: 12 },
      { stars: 3, count: 2 },
    ]
  };

  return (
    <Box sx={{ pb: 10 }} className="animate-fadeIn">
      {/* Header Profile Section */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 6 }}>
        <Avatar src={currentArtisan.avatar} sx={{ width: 80, height: 80, border: '4px solid', borderColor: 'background.paper', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>Hello, {currentArtisan.name.split(' ')[0]} ✨</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label="ON DUTY" size="small" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 900, fontSize: '10px' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Shift Ends: 6:00 PM</Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star size={14} fill={theme.palette.secondary.main} color={theme.palette.secondary.main} />
              <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{currentArtisan.rating}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Column: Active Ritual & Schedule */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {/* NOW ACTIVE Ritual Card */}
            {activeRitual && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: '40px', 
                  bgcolor: isDarkMode ? 'rgba(181, 148, 16, 0.05)' : 'rgba(15, 23, 42, 0.02)', 
                  border: '2px solid', 
                  borderColor: 'secondary.main',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
                  <Flame size={120} />
                </Box>
                
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'secondary.main', letterSpacing: '0.15em', mb: 1 }}>NOW ACTIVE</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{activeRitual.customerName}</Typography>
                    <Typography variant="body2" color="text.secondary">{activeService?.name}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary' }}>{timeLeft}m</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>REMAINING</Typography>
                  </Box>
                </Stack>

                <Box sx={{ mb: 4 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={((activeService?.duration || 45) - timeLeft) / (activeService?.duration || 45) * 100} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6, 
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 6 }
                    }} 
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" disableElevation fullWidth sx={{ borderRadius: '100px', py: 1.5, bgcolor: 'text.primary', fontWeight: 900 }}>
                    Complete Ritual
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: '100px', minWidth: 140, fontWeight: 900, border: '2.5px solid' }}>
                    Add Extra
                  </Button>
                </Stack>
              </Paper>
            )}

            {/* Performance Transparency Scorecard */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                <BarChart3 size={20} color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Artisan Scorecard</Typography>
              </Stack>
              
              <Grid container spacing={3}>
                {/* Rating Breakdown */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ p: 3, borderRadius: '24px', bgcolor: 'action.hover', height: '100%' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', mb: 2 }}>CLIENT FEEDBACK</Typography>
                    <Stack spacing={1.5}>
                      {performanceMetrics.ratingBreakdown.map((r) => (
                        <Stack key={r.stars} direction="row" spacing={2} alignItems="center">
                          <Typography sx={{ minWidth: 50, fontSize: '12px', fontWeight: 800 }}>{r.stars} Stars</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(r.count / 138) * 100} 
                            sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { bgcolor: r.stars === 5 ? 'secondary.main' : 'text.secondary' } }} 
                          />
                          <Typography sx={{ minWidth: 30, fontSize: '11px', fontWeight: 800, color: 'text.secondary' }}>{r.count}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: '16px', textAlign: 'center' }}>
                       <Typography variant="h4" sx={{ fontWeight: 900 }}>4.9</Typography>
                       <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ color: 'secondary.main' }} />
                       <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>Lifetime Artisan Rating</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Core KPI Metrics */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '10px' }}><Repeat size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>Rebooking Rate</Typography>
                          <Typography variant="caption" color="text.secondary">Clients who return within 8 weeks</Typography>
                        </Box>
                      </Stack>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{performanceMetrics.rebookingRate}%</Typography>
                        <Chip label="ELITE" size="small" sx={{ height: 16, fontSize: '8px', fontWeight: 900, bgcolor: 'success.main', color: 'white' }} />
                      </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', borderRadius: '100px' }}><Clock size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>On-Time Start</Typography>
                          <Typography variant="caption" color="text.secondary">Rituals commenced within 5 min</Typography>
                        </Box>
                      </Stack>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{performanceMetrics.onTimeRate}%</Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>+2% vs last mo</Typography>
                      </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E', borderRadius: '10px' }}><AlertCircle size={18} /></Box>
                        <Box>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>Cancel Responsibility</Typography>
                          <Typography variant="caption" color="text.secondary">Staff-initiated cancellations</Typography>
                        </Box>
                      </Stack>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: performanceMetrics.cancelResponsibility > 5 ? 'error.main' : 'text.primary' }}>{performanceMetrics.cancelResponsibility}%</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Well below limit</Typography>
                      </Box>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, p: 3, borderRadius: '24px', bgcolor: isDarkMode ? 'rgba(181, 148, 16, 0.05)' : 'rgba(212, 175, 55, 0.03)', border: '1px dashed', borderColor: 'secondary.main' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Sparkles size={20} color={theme.palette.secondary.main} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    <Box component="span" sx={{ fontWeight: 900, color: 'secondary.main' }}>AI Growth Path:</Box> Your rebooking rate is 15% above the collective average. Focus on "Luxury Manicure" upselling to reach Sovereign level.
                  </Typography>
                </Stack>
              </Box>
            </Paper>

            {/* Schedule Timeline */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Upcoming Rituals</Typography>
              <Stack spacing={2}>
                {appointments.filter(a => a.id !== activeRitualId).map((apt) => {
                  const srv = SERVICES.find(s => s.id === apt.serviceId);
                  return (
                    <Paper 
                      key={apt.id} 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        borderRadius: '24px', 
                        border: '1.5px solid', 
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>{apt.time.split(' ')[0]}</Typography>
                          <Typography sx={{ fontSize: '10px', fontWeight: 800, opacity: 0.6 }}>{apt.time.split(' ')[1]}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{apt.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{srv?.name}</Typography>
                        </Box>
                      </Stack>
                      <IconButton><ChevronRight size={20} /></IconButton>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Right Column: Intelligence & Earnings */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4}>
            {/* Client Intelligence (Allergies/Notes) */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <ClipboardList size={20} color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Intelligence Cache</Typography>
              </Stack>
              
              {activeRitual && (
                <Stack spacing={3}>
                  <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: alpha(theme.palette.error.main, 0.05), border: '1.5px dashed', borderColor: alpha(theme.palette.error.main, 0.2) }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <AlertCircle size={18} color={theme.palette.error.main} />
                      <Typography sx={{ fontSize: '11px', fontWeight: 900, color: theme.palette.error.main, letterSpacing: '0.1em' }}>CRITICAL ALLERGY</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{activeRitual.allergies}</Typography>
                  </Box>

                  <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'action.hover' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', mb: 1 }}>PREFERENCES</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontStyle: 'italic' }}>"{activeRitual.notes}"</Typography>
                  </Box>

                  <Button variant="outlined" startIcon={<History size={16} />} sx={{ borderRadius: '100px', fontWeight: 800, textTransform: 'none' }}>
                    View Ritual History
                  </Button>
                </Stack>
              )}
            </Paper>

            {/* Artisan Performance/Earnings */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', bgcolor: 'text.primary', color: 'background.paper' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 900, opacity: 0.6, letterSpacing: '0.1em', mb: 3 }}>ARTISAN PERFORMANCE</Typography>
              <Stack spacing={3}>
                {stats.map((stat) => (
                  <Stack key={stat.label} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>{stat.icon}</Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{stat.label}</Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 900, color: stat.color === '#10B981' ? '#10B981' : 'inherit' }}>{stat.value}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Button fullWidth endIcon={<Sparkles size={16} />} sx={{ color: 'secondary.main', fontWeight: 900, textTransform: 'none' }}>
                Analyze Monthly Yield
              </Button>
            </Paper>

            {/* Quick Messages */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '32px', 
                border: '1.5px solid', 
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}><MessageSquare size={20} /></Avatar>
                <Box sx={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, bgcolor: 'error.main', borderRadius: '50%', border: '2px solid white' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Collective Chat</Typography>
                <Typography variant="caption" color="text.secondary">2 unread from the Front Desk</Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffPortal;
