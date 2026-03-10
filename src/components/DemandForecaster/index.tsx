
import React, { useState, useEffect } from 'react';
// Import Grid from the specific Grid2 package to fix the export error
import Grid from '@mui/material/Grid2';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  useTheme,
  Fade,
  CircularProgress,
  IconButton,
  LinearProgress,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import {
  BrainCircuit,
  CloudRain,
  Sun,
  Calendar,
  Users,
  TrendingUp,
  Zap,
  Info,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { getAIDemandForecast } from '../../services/geminiService';

const DemandForecaster: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const forecastData = [
    { hour: '9AM', demand: 30, staffing: 2 },
    { hour: '11AM', demand: 65, staffing: 3 },
    { hour: '1PM', demand: 45, staffing: 4 },
    { hour: '3PM', demand: 85, staffing: 5 },
    { hour: '5PM', demand: 95, staffing: 6 },
    { hour: '7PM', demand: 70, staffing: 4 },
    { hour: '9PM', demand: 20, staffing: 2 },
  ];

  const weeklyTrend = [
    { day: 'Mon', revenue: 85000 },
    { day: 'Tue', revenue: 72000 },
    { day: 'Wed', revenue: 94000 },
    { day: 'Thu', revenue: 110000 },
    { day: 'Fri', revenue: 165000 },
    { day: 'Sat', revenue: 210000 },
    { day: 'Sun', revenue: 145000 },
  ];

  const fetchInsights = async () => {
    setLoading(true);
    const context = "Upcoming Saturday (Gala season), Weather: Clear, Current Bookings: 85% capacity for weekend, Low traffic on Tuesday mornings.";
    const insights = await getAIDemandForecast(context);
    setAiInsights(insights);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={4} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'secondary.main' }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', mb: 0.5 }}>DEMAND SCALE</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 900 }}>{payload[0].value}% Capacity</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box className="animate-fadeIn" sx={{ pb: 8 }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 6, gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ p: 1, bgcolor: 'secondary.main', borderRadius: '12px', color: 'white' }}>
              <BrainCircuit size={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
              Predictive <Box component="span" sx={{ color: 'secondary.main' }}>Intelligence</Box>
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Harnessing Gemini AI to anticipate sanctuary flow and optimize resources.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={fetchInsights}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={18} />}
          sx={{ borderRadius: '100px', px: 4, fontWeight: 800, textTransform: 'none' }}
        >
          {loading ? 'Analyzing...' : 'Recalculate Forecast'}
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* Main Forecast Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', minHeight: 480, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Demand Trajectory</Typography>
                <Typography variant="caption" color="text.secondary">Upcoming 24-hour cycle projections</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip icon={<Sun size={14} />} label="Clear Skies" size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                <Chip icon={<Zap size={14} />} label="High Peak" size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 800 }} />
              </Stack>
            </Stack>

            <Box sx={{ height: 350, mt: 4, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: theme.palette.text.secondary }} 
                  />
                  <YAxis hide domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="demand" 
                    stroke={theme.palette.secondary.main} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorDemand)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            <Stack direction="row" spacing={4} sx={{ mt: 4, px: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>PEAK MOMENT</Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 900 }}>5:00 PM</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>PROXIMITY FACTOR</Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 900 }}>95% Load</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>AI RECOMMENDATION</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'secondary.main' }}>Deploy Backup Staff</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* AI Insight Panel */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: '40px', 
                bgcolor: isDarkMode ? 'rgba(181, 148, 16, 0.05)' : 'rgba(212, 175, 55, 0.03)', 
                border: '2px dashed', 
                borderColor: 'secondary.main',
                minHeight: 300
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Sparkles size={22} color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>Artisan Insights</Typography>
              </Stack>
              
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
              ) : (
                <Fade in>
                  <Typography 
                    sx={{ 
                      fontSize: '15px', 
                      lineHeight: 1.8, 
                      whiteSpace: 'pre-line',
                      fontStyle: 'italic',
                      color: 'text.primary'
                    }}
                  >
                    {aiInsights}
                  </Typography>
                </Fade>
              )}
              
              <Button 
                fullWidth 
                variant="contained" 
                disableElevation 
                sx={{ mt: 4, borderRadius: '100px', bgcolor: 'text.primary', color: 'white', py: 1.5, fontWeight: 900 }}
                endIcon={<ArrowRight size={18} />}
              >
                Apply Adjustments
              </Button>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Popularity Pulse</Typography>
              <Stack spacing={3}>
                {[
                  { name: 'Balayage Ritual', trend: '+18%', value: 92 },
                  { name: 'Signature Haircut', trend: '+5%', value: 85 },
                  { name: 'Hydra-Silk Facial', trend: '-2%', value: 40 }
                ].map((item) => (
                  <Box key={item.name}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 900, color: item.trend.startsWith('+') ? 'success.main' : 'error.main' }}>
                        {item.trend}
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.value} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' }
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Dynamic Pricing / Yield Table */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4, gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Dynamic Yield Suggestions</Typography>
                <Typography variant="body2" color="text.secondary">Optimizing revenue based on predicted scarcity.</Typography>
              </Box>
              <Chip label="Live Optimization Active" color="success" variant="outlined" sx={{ fontWeight: 900 }} />
            </Stack>

            <Grid container spacing={2}>
              {weeklyTrend.map((data, idx) => (
                <Grid key={data.day} size={{ xs: 6, sm: 4, md: 3, lg: 1.7 }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      borderRadius: '24px', 
                      border: '1.5px solid', 
                      borderColor: idx === 5 ? 'secondary.main' : 'divider',
                      bgcolor: idx === 5 ? 'rgba(181, 148, 16, 0.02)' : 'transparent',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', mb: 1 }}>{data.day.toUpperCase()}</Typography>
                    <Typography sx={{ fontSize: '18px', fontWeight: 900, mb: 1.5 }}>Rs. {(data.revenue / 1000).toFixed(0)}k</Typography>
                    <Chip 
                      label={idx === 5 ? '+10% P' : (idx === 1 ? '-5% D' : 'NORM')} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '9px', 
                        fontWeight: 900,
                        bgcolor: idx === 5 ? 'secondary.main' : (idx === 1 ? 'success.main' : 'action.selected'),
                        color: idx === 5 || idx === 1 ? 'white' : 'text.secondary'
                      }} 
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemandForecaster;
