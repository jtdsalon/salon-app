import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  IconButton,
  useTheme,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
  Fade,
  alpha,
  Grid2,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  Calendar,
  Users,
  ShoppingBag,
  Zap,
  Sparkles,
  X,
  Send,
  BrainCircuit,
  Lightbulb,
  ArrowUp,
  Receipt
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  Tooltip as RechartsTooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { useDashboardData } from './hooks/useDashboardData';
import { generatePromoCaption } from '../../services/geminiService';
import { AppView } from '@/components/types';
import { ROUTES } from '@/routes/routeConfig';

interface DashboardProps {
  setView?: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const navigate = useNavigate();
  const { stats, chartData, recentInvoices, staff: staffFromApi, staffUtilizationToday, isLoading, error, refetch } = useDashboardData();

  const handleNavigate = (view: AppView) => {
    if (setView) {
      setView(view);
    } else {
      const pathMap: Partial<Record<AppView, string>> = {
        [AppView.AUTH]: ROUTES.LOGIN,
        [AppView.DASHBOARD]: ROUTES.DASHBOARD,
        [AppView.DEMAND_FORECAST]: ROUTES.DEMAND_FORECAST,
        [AppView.BILLING]: ROUTES.BILLING,
        [AppView.SCHEDULE]: ROUTES.SCHEDULE,
        [AppView.STAFF]: ROUTES.STAFF,
        [AppView.CUSTOMERS]: ROUTES.CUSTOMERS,
        [AppView.ARCHIVE]: ROUTES.SOCIAL_HUB,
        [AppView.APOTHECARY]: ROUTES.INVENTORY,
        [AppView.CHAT]: ROUTES.CHAT,
        [AppView.SERVICES]: ROUTES.SERVICES,
        [AppView.NOTIFICATIONS]: ROUTES.NOTIFICATIONS,
        [AppView.SALON_PROFILE]: ROUTES.SALON_PROFILE,
        [AppView.CHECKOUT]: ROUTES.CHECKOUT,
        [AppView.SUBSCRIPTIONS]: ROUTES.SUBSCRIPTIONS,
        [AppView.STAFF_PORTAL]: ROUTES.STAFF_PORTAL,
        [AppView.INVENTORY]: ROUTES.INVENTORY,
        [AppView.VACANCIES]: ROUTES.VACANCIES,
        [AppView.ACCOUNT_SETTINGS]: ROUTES.ACCOUNT_SETTINGS,
      };
      const path = pathMap[view];
      if (path) navigate(path);
    }
  };

  const displayStaff = staffFromApi;
  const miniInvoices = recentInvoices.length > 0 ? recentInvoices : [
    { id: '—', date: '—', amount: 'Rs. 0', method: '—' },
  ];
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Toggle State for Chart Metrics
  const [showRevenue, setShowRevenue] = useState(true);
  const [showTarget, setShowTarget] = useState(true);

  // State for Dialogs
  const [isCampaignForgeOpen, setIsCampaignForgeOpen] = useState(false);
  
  // Campaign Forge State
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDiscount, setCampaignDiscount] = useState('20% OFF');
  const [aiCaption, setAiCaption] = useState('');

  const statsCards = stats
    ? [
        { label: 'Daily Revenue', value: stats.dailyRevenueFormatted, icon: <TrendingUp size={20} />, color: '#10B981', trend: 'Live' },
        { label: 'Total Appointments', value: stats.totalAppointments.toString(), icon: <Calendar size={20} />, color: '#6366F1', trend: 'Healthy' },
        { label: 'Active Staff', value: stats.staffActiveFormatted, icon: <Users size={20} />, color: '#F59E0B', trend: 'Online' },
        { label: 'Retail Sales', value: stats.retailSalesFormatted, icon: <ShoppingBag size={20} />, color: '#EC4899', trend: '30d' },
      ]
    : [
        { label: 'Daily Revenue', value: '—', icon: <TrendingUp size={20} />, color: '#10B981', trend: '—' },
        { label: 'Total Appointments', value: '—', icon: <Calendar size={20} />, color: '#6366F1', trend: '—' },
        { label: 'Active Staff', value: '—', icon: <Users size={20} />, color: '#F59E0B', trend: '—' },
        { label: 'Retail Sales', value: '—', icon: <ShoppingBag size={20} />, color: '#EC4899', trend: '—' },
      ];

  const AI_RECOMMENDATIONS = [
    {
      id: 'rec1',
      type: 'Optimization',
      title: 'Demand Surge Alert',
      description: 'Bookings for Saturday are at 94%. We recommend a 15% weekend premium for walk-ins.',
      action: 'Apply Surge',
      icon: <ArrowUp size={18} />,
      color: theme.palette.primary.main
    },
    {
      id: 'rec2',
      type: 'Planning',
      title: 'Peak Prediction',
      description: 'High-volume flow predicted for tomorrow. Consider 1 extra stylist for afternoon help.',
      action: 'Adjust Roster',
      icon: <Users size={18} />,
      color: '#6366F1'
    }
  ];

  const handleForgeCampaign = async () => {
    if (!campaignTitle) return;
    setIsGenerating(true);
    const caption = await generatePromoCaption(campaignTitle, campaignDiscount);
    setAiCaption(caption || '');
    setIsGenerating(false);
  };

  /* -------------------------------- Revenue Chart -------------------------------- */
  const RevenueChart = () => {
    const data = chartData.length > 0 ? chartData : [
      { day: 'MON', revenue: 0, target: 100000 },
      { day: 'TUE', revenue: 0, target: 100000 },
      { day: 'WED', revenue: 0, target: 100000 },
      { day: 'THU', revenue: 0, target: 120000 },
      { day: 'FRI', revenue: 0, target: 120000 },
      { day: 'SAT', revenue: 0, target: 150000 },
      { day: 'SUN', revenue: 0, target: 150000 },
    ];

    return (
      <Box sx={{ height: 320, width: '100%', mt: 4, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: theme.palette.text.secondary }} dy={15} />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 800 }}
              cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15, 23, 42, 0.02)' }} 
            />
            {showRevenue && (
              <Bar name="revenue" dataKey="revenue" radius={[12, 12, 4, 4]} barSize={32}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 6 ? '#EAB308' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.08)')} />)}
              </Bar>
            )}
            {showTarget && <Line name="target" type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={3} strokeDasharray="8 5" dot={{ r: 4, fill: '#EAB308' }} />}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  /* -------------------------------- Staff Utilization Heatmap (today's bookings per staff per hour) -------------------------------- */
  const StaffHeatmap = () => {
    const HOURS = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
    const HOUR_INDICES = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', width: '100%', bgcolor: isDarkMode ? '#0B1224' : 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Stylist Utilization</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Visualizing daily activity cycles (today).</Typography>
          </Box>
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600 }}>
            <Stack direction="row" sx={{ mb: 2, pl: '150px' }}>
              {HOURS.map(h => <Typography key={h} sx={{ flex: 1, textAlign: 'center', fontSize: '9px', fontWeight: 900, color: 'text.secondary' }}>{h}</Typography>)}
            </Stack>
            <Stack spacing={2}>
              {displayStaff.map((s) => {
                const busyHours = staffUtilizationToday[s.id] ?? [];
                return (
                  <Stack key={s.id} direction="row" alignItems="center">
                    <Box sx={{ width: 150, pr: 2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={s.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography noWrap sx={{ fontSize: '12px', fontWeight: 800 }}>{s.name.split(' ')[0]}</Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" sx={{ flex: 1, height: 28, bgcolor: 'action.hover', borderRadius: '6px', overflow: 'hidden' }}>
                      {HOUR_INDICES.map((hour, i) => (
                        <Box
                          key={i}
                          sx={{
                            flex: 1,
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            bgcolor: busyHours.includes(hour) ? '#EAB308' : 'transparent',
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                );
              })}
              {((staffUtilizationToday['__unassigned__'] ?? []).length > 0) && (
                <Stack direction="row" alignItems="center">
                  <Box sx={{ width: 150, pr: 2 }}>
                    <Typography noWrap sx={{ fontSize: '12px', fontWeight: 800 }}>Unassigned</Typography>
                  </Box>
                  <Stack direction="row" sx={{ flex: 1, height: 28, bgcolor: 'action.hover', borderRadius: '6px', overflow: 'hidden' }}>
                    {HOUR_INDICES.map((hour, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          borderRight: '1px solid',
                          borderColor: 'divider',
                          bgcolor: (staffUtilizationToday['__unassigned__'] ?? []).includes(hour) ? '#EAB308' : 'transparent',
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>
      </Paper>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320, pb: 10 }}>
        <CircularProgress sx={{ color: '#EAB308' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }} className="animate-fadeIn">
      {error && (
        <Alert severity="error" onClose={() => refetch()} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3} sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
            Salon <Box component="span" sx={{ color: '#EAB308' }}>Dashboard</Box>
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 8, height: 8, bgcolor: stats ? '#10B981' : '#94A3B8', borderRadius: '50%', boxShadow: stats ? '0 0 8px #10B981' : 'none' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {stats ? 'System online. Live data from backend.' : 'Connect your salon to see live stats.'}
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => handleNavigate(AppView.DEMAND_FORECAST)} startIcon={<BrainCircuit size={18} />} sx={{ borderRadius: '100px', px: 3, fontWeight: 800 }}>Demand Forecast</Button>
          <Button variant="contained" onClick={() => setIsCampaignForgeOpen(true)} startIcon={<Sparkles size={18} />} sx={{ borderRadius: '100px', px: 3, bgcolor: '#EAB308', color: '#050914', fontWeight: 800, '&:hover': { bgcolor: '#FACC15' } }}>Campaign Forge</Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid2 container spacing={3} sx={{ mb: 6 }}>
        {statsCards.map((stat) => (
          <Grid2 key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDarkMode ? '#0B1224' : 'white' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: alpha(stat.color, 0.1), color: stat.color }}>{stat.icon}</Box>
                <Chip label={stat.trend} size="small" sx={{ fontWeight: 900, fontSize: '10px', bgcolor: alpha(stat.color, 0.05), color: stat.color }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>{stat.value}</Typography>
              <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* Main Content Grid2 */}
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {/* Revenue Momentum */}
            <Paper elevation={0} sx={{ p: 5, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDarkMode ? '#0B1224' : 'white' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Financial Momentum</Typography>
                  <Typography variant="body2" color="text.secondary">Daily income vs. performance targets.</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant={showRevenue ? "contained" : "outlined"} onClick={() => setShowRevenue(!showRevenue)} sx={{ fontSize: '10px', borderRadius: '100px' }}>Revenue</Button>
                  <Button size="small" variant={showTarget ? "contained" : "outlined"} onClick={() => setShowTarget(!showTarget)} sx={{ fontSize: '10px', borderRadius: '100px' }}>Target</Button>
                </Stack>
              </Stack>
              <RevenueChart />
            </Paper>

            {/* Staff Heatmap */}
            <StaffHeatmap />
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4}>
            {/* Account & Usage Summary (from FinancialVault) */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDarkMode ? '#0B1224' : 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Cycle Utilization</Typography>
              <Stack spacing={4}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '12px' }}>Appointments today</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '12px' }}>{stats ? `${stats.appointmentsToday} / 50` : '— / —'}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={stats ? Math.min(100, (stats.appointmentsToday / 50) * 100) : 0} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#EAB308' } }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '12px' }}>AI Credits</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '12px' }}>142 / 500</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={28} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#6366F1' } }} />
                </Box>
              </Stack>
              <Button fullWidth variant="outlined" onClick={() => handleNavigate(AppView.BILLING)} sx={{ mt: 4, borderRadius: '12px', py: 1.5, fontSize: '12px' }}>Manage Plan</Button>
            </Paper>

            {/* AI Suggestions */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '2px solid', borderColor: alpha('#EAB308', 0.3), bgcolor: alpha('#EAB308', 0.02) }}>
               <Stack spacing={3}>
                 <Stack direction="row" spacing={1.5} alignItems="center">
                   <Box sx={{ p: 1, bgcolor: '#EAB308', borderRadius: '8px', color: '#050914' }}><Lightbulb size={18} /></Box>
                   <Typography sx={{ fontWeight: 900 }}>AI Strategic Insights</Typography>
                 </Stack>
                 {AI_RECOMMENDATIONS.map(rec => (
                   <Box key={rec.id} sx={{ p: 2, borderRadius: '20px', bgcolor: isDarkMode ? alpha('#FFFFFF', 0.05) : 'white', border: '1px solid divider' }}>
                     <Typography sx={{ fontWeight: 900, fontSize: '13px', mb: 0.5 }}>{rec.title}</Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 2 }}>{rec.description}</Typography>
                     <Button size="small" fullWidth variant="contained" sx={{ bgcolor: isDarkMode ? 'white' : '#0F172A', color: isDarkMode ? '#050914' : 'white', borderRadius: '10px' }}>{rec.action}</Button>
                   </Box>
                 ))}
               </Stack>
            </Paper>

            {/* Mini Billing History (from FinancialVault) */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDarkMode ? '#0B1224' : 'white', overflow: 'hidden' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Receipt size={20} color="#EAB308" />
                <Typography sx={{ fontWeight: 900 }}>Recent Invoices</Typography>
              </Stack>
              <Stack spacing={2}>
                {miniInvoices.map(inv => (
                  <Box key={inv.id} sx={{ p: 2, borderRadius: '16px', border: '1px solid divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '12px' }}>{inv.id}</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{inv.date}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>{inv.amount}</Typography>
                  </Box>
                ))}
              </Stack>
              <Button fullWidth onClick={() => handleNavigate(AppView.BILLING)} sx={{ mt: 2, fontSize: '11px', fontWeight: 800, color: '#EAB308' }}>View All History</Button>
            </Paper>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Campaign Forge Dialog */}
      <Dialog 
        open={isCampaignForgeOpen} 
        onClose={() => setIsCampaignForgeOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '32px', bgcolor: isDarkMode ? '#0B1224' : 'white', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 900 }}>Campaign <span style={{ color: '#EAB308' }}>Forge</span></Typography>
            <IconButton onClick={() => setIsCampaignForgeOpen(false)}><X size={20} /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Use our proprietary intelligence to craft elite marketing content for your patrons.
            </Typography>
            <TextField fullWidth label="Campaign Theme" placeholder="e.g. Lavender Spring Renewal" value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} />
            <TextField fullWidth select label="Offer Value" value={campaignDiscount} onChange={(e) => setCampaignDiscount(e.target.value)}>
              {['10% OFF', '20% OFF', 'Free Ritual Upgrade', 'Complimentary Mist'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
            <Button 
              fullWidth variant="contained" 
              onClick={handleForgeCampaign} 
              disabled={isGenerating || !campaignTitle}
              startIcon={isGenerating ? <CircularProgress size={16} /> : <Zap size={18} />}
              sx={{ py: 2, borderRadius: '16px', bgcolor: isDarkMode ? 'white' : '#0F172A', color: isDarkMode ? '#050914' : 'white', fontWeight: 900 }}
            >
              {isGenerating ? 'Synthesizing...' : 'Forge Campaign Content'}
            </Button>
            {aiCaption && (
              <Fade in>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: isDarkMode ? alpha('#EAB308', 0.05) : alpha('#EAB308', 0.03), border: '1px solid', borderColor: alpha('#EAB308', 0.2) }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '10px', color: '#EAB308', mb: 1, letterSpacing: '0.1em' }}>AI GENERATED CONTENT</Typography>
                  <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.6, fontStyle: 'italic' }}>"{aiCaption}"</Typography>
                  <Button size="small" startIcon={<Send size={14} />} sx={{ mt: 2, fontWeight: 800, color: '#EAB308' }}>Send to All Obsidian Patrons</Button>
                </Paper>
              </Fade>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
