import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TrendingUp, Users, Sparkles, MessageCircle, ArrowUpRight, Award, Zap } from 'lucide-react';
import { getFeedStrings } from './properties';
import { useInsights } from './hooks/useInsights';

interface InsightsViewProps {
  onViewSalon: (id: string) => void;
}

const InsightsView: React.FC<InsightsViewProps> = ({ onViewSalon }) => {
  const theme = useTheme();
  const s = getFeedStrings().insights;
  const { data, loading, error, refetch } = useInsights();

  if (loading) {
    return (
      <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={40} sx={{ color: 'secondary.main' }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary' }}>
          {s.loading}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
          {s.errorLoading}
        </Typography>
        <Button variant="outlined" onClick={refetch} size="small">
          {s.retry}
        </Button>
      </Box>
    );
  }

  const analyticsData = data ?? {
    followers: 0,
    followerGrowth: '0%',
    engagementRate: '0%',
    dailyReach: [35, 45, 30, 60, 85, 55, 95],
    topPosts: [],
  };

  const chartValues = analyticsData.dailyReach.length >= 7
    ? analyticsData.dailyReach.slice(0, 7)
    : [35, 45, 30, 60, 85, 55, 95];

  return (
    <Box sx={{ pb: 8 }}>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Users size={18} />
              </Box>
              <Typography sx={{ color: '#10B981', fontWeight: 900, fontSize: '12px' }}>{analyticsData.followerGrowth}</Typography>
            </Stack>
            <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 900 }}>{analyticsData.followers.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>{s.totalAudience}</Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                <Zap size={18} />
              </Box>
              <Typography sx={{ color: '#6366F1', fontWeight: 900, fontSize: '12px' }}>{s.engagementStatus}</Typography>
            </Stack>
            <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 900 }}>{analyticsData.engagementRate}</Typography>
            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>{s.avgEngagement}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '16px' }}>{s.growthTrajectory}</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 500 }}>{s.dailyReachImpressions}</Typography>
          </Box>
          <Tooltip title={s.yieldIncreasingTooltip}>
            <IconButton size="small">
              <TrendingUp size={20} color={theme.palette.secondary.main} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Box sx={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 1.5, px: 1 }}>
          {chartValues.map((val, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${Math.min(100, Math.max(5, val))}%`,
                bgcolor: i === chartValues.length - 1 ? 'secondary.main' : 'action.selected',
                borderRadius: '8px 8px 4px 4px',
                transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'secondary.light' },
              }}
            />
          ))}
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 1 }}>
          {s.chartDays.map((d) => (
            <Typography key={d} sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary' }}>
              {d}
            </Typography>
          ))}
        </Stack>
      </Paper>

      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.2em', color: 'text.secondary', mb: 3, textTransform: 'uppercase' }}>
          {s.topMasterpieces}
        </Typography>

        <Stack spacing={3}>
          {analyticsData.topPosts.map((post) => (
            <Paper
              key={post.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '32px',
                border: '1.5px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={post.image || 'https://via.placeholder.com/80?text=✨'}
                    alt=""
                    sx={{ width: 80, height: 80, borderRadius: '20px', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      width: 32,
                      height: 32,
                      bgcolor: 'secondary.main',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '4px solid',
                      borderColor: 'background.paper',
                      color: 'white',
                    }}
                  >
                    <Award size={14} strokeWidth={3} />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography noWrap sx={{ fontWeight: 800, fontSize: '15px', mb: 1 }}>
                    {post.caption ? `${post.caption.substring(0, 30)}...` : s.untitled}
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Sparkles size={14} color={theme.palette.secondary.main} fill={theme.palette.secondary.main} />
                      <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>{post.likes}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <MessageCircle size={14} color="text.secondary" />
                      <Typography sx={{ fontSize: '12px', fontWeight: 900, color: 'text.secondary' }}>
                        {post.comments?.length ?? 0}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <IconButton onClick={() => onViewSalon(post.userId)} sx={{ color: 'text.secondary' }}>
                  <ArrowUpRight size={20} />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
        {analyticsData.topPosts.length === 0 && (
          <Typography sx={{ py: 6, textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}>
            {s.noMasterpiecesYet}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InsightsView;
