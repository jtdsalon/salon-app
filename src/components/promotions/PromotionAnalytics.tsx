import React, { useEffect, useState } from 'react';
import {
  Grid2,
  Paper,
  Typography,
  Box,
  Stack,
  alpha,
  useTheme,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Eye,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { getSalonPromotionAnalyticsDashboardApi, type PromotionAnalyticsDashboard } from '@/services/api/promotionService';

function formatRevenue(n: number): string {
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}K`;
  return `Rs.${Math.round(n).toLocaleString()}`;
}

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  isUp?: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isUp = true, icon, color }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '24px',
        border: '1.5px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        bgcolor: isDark ? '#0f172a' : 'white',
        height: '100%',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha(color, 0.1), color: color }}>
            {icon}
          </Box>
          {trend != null && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isUp ? '#10B981' : '#EF4444',
                bgcolor: alpha(isUp ? '#10B981' : '#EF4444', 0.1),
                px: 1,
                py: 0.5,
                borderRadius: '8px',
              }}
            >
              {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <Typography variant="caption" sx={{ fontWeight: 900 }}>{trend}</Typography>
            </Box>
          )}
        </Stack>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

interface PromotionAnalyticsProps {
  salonId: string;
}

export const PromotionAnalytics: React.FC<PromotionAnalyticsProps> = ({ salonId }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [data, setData] = useState<PromotionAnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!salonId) return;
    setLoading(true);
    setError(null);
    getSalonPromotionAnalyticsDashboardApi(salonId)
      .then((res) => {
        const payload = (res as { data?: { data?: PromotionAnalyticsDashboard; summary?: unknown } }).data;
        const dashboard = payload?.data ?? payload;
        setData(dashboard as PromotionAnalyticsDashboard);
      })
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [salonId]);

  if (loading) {
    return (
      <Box>
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '24px' }} />
            </Grid2>
          ))}
        </Grid2>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '32px', mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '32px' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  const summary = data?.summary ?? {
    totalViews: 0,
    totalBookings: 0,
    revenueGenerated: 0,
    conversionRate: 0,
  };
  const dailyData = data?.dailyData ?? [];
  const topPromotions = data?.topPromotions ?? [];

  return (
    <Box>
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Promotion Views"
            value={summary.totalViews.toLocaleString()}
            icon={<Eye size={20} />}
            color="#3B82F6"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Bookings"
            value={summary.totalBookings.toLocaleString()}
            icon={<CalendarCheck size={20} />}
            color="#10B981"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Revenue Generated"
            value={formatRevenue(summary.revenueGenerated)}
            icon={<DollarSign size={20} />}
            color="#EAB308"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Conversion Rate"
            value={`${summary.conversionRate}%`}
            icon={<TrendingUp size={20} />}
            color="#8B5CF6"
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: '32px', 
              border: '1.5px solid', 
              borderColor: 'divider',
              bgcolor: isDark ? '#0f172a' : 'white',
              height: '400px'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Usage Performance</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Daily views vs bookings from promotions</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EAB308' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Views</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Bookings</Typography>
                </Stack>
              </Box>
            </Stack>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData.length ? dailyData : [{ name: '—', usage: 0, bookings: 0 }]}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: theme.palette.text.secondary }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: theme.palette.text.secondary }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      backgroundColor: isDark ? '#1e293b' : 'white',
                    }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" name="Views" />
                  <Area type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '32px',
              border: '1.5px solid',
              borderColor: 'divider',
              bgcolor: isDark ? '#0f172a' : 'white',
              height: '400px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Top Promotions</Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPromotions.length ? topPromotions : [{ name: 'No data', value: 0, color: '#64748B' }]} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: theme.palette.text.primary }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      backgroundColor: isDark ? '#1e293b' : 'white',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24} name="Bookings">
                    {(topPromotions.length ? topPromotions : [{ color: '#64748B' }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};
