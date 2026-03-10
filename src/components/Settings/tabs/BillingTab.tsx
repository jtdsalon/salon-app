import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Paper, Box, Typography, Stack, Button, Divider, CircularProgress } from '@mui/material';
import { Sparkles, Monitor } from 'lucide-react';
import { ROUTES } from '@/routes/routeConfig';
import { getCurrentSubscriptionApi, getSubscriptionPaymentsApi } from '@/services/api/subscriptionService';

interface BillingTabProps {
  isDark: boolean;
}

const BillingTab: React.FC<BillingTabProps> = ({ isDark }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{
    plan?: { name: string };
    plan_price?: { billing_cycle: string; final_price: number; currency: string };
    current_period_end?: string | null;
  } | null>(null);
  const [lastPayment, setLastPayment] = useState<{ amount: number; paid_at: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCurrentSubscriptionApi(), getSubscriptionPaymentsApi({ limit: 1 })])
      .then(([subRes, payRes]) => {
        if (cancelled) return;
        const subData = subRes?.data?.data ?? subRes?.data;
        const payPayload = payRes?.data;
        const items = Array.isArray(payPayload?.data) ? payPayload.data : [];
        if (subData?.subscription) setSubscription(subData.subscription);
        if (items.length > 0) setLastPayment({ amount: (items[0] as { amount: number }).amount, paid_at: (items[0] as { paid_at: string | null }).paid_at });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const planName = subscription?.plan?.name ?? 'Pro';
  const nextBilling = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  const amount = subscription?.plan_price?.final_price ?? lastPayment?.amount ?? 0;
  const currency = subscription?.plan_price?.currency ?? 'LKR';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#EAB308' }} />
      </Box>
    );
  }

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5, borderRadius: '48px',
            bgcolor: isDark ? 'white' : '#0F172A',
            color: isDark ? '#050914' : 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -40, right: -40, opacity: 0.1 }}>
            <Sparkles size={200} />
          </Box>

          <Typography sx={{ fontSize: '11px', fontWeight: 900, opacity: 0.6, letterSpacing: '0.2em', mb: 2 }}>CURRENT PLAN</Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>{planName} <Box component="span" sx={{ color: '#EAB308' }}>Plan</Box></Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.8, mb: 6, maxWidth: '80%' }}>
            Unlimited bookings, AI demand forecasting, and advanced staff management tools are included in your plan.
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" sx={{ bgcolor: '#EAB308', color: '#050914', fontWeight: 900, py: 1.5, px: 4, borderRadius: '100px' }} onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>Upgrade Plan</Button>
            <Typography variant="caption" sx={{ fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>Manage Subscription</Typography>
          </Stack>
        </Paper>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Payment Summary</Typography>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Next Billing Date</Typography>
              <Typography sx={{ fontWeight: 900 }}>{nextBilling}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Amount</Typography>
              <Typography sx={{ fontWeight: 900, color: '#EAB308' }}>{currency} {amount.toLocaleString()}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: 44, height: 32, bgcolor: isDark ? 'white' : '#1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Monitor size={16} color={isDark ? 'black' : 'white'} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>Payment on file</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Manage in Subscription</Typography>
              </Box>
              <Button size="small" sx={{ ml: 'auto', fontWeight: 900, color: '#EAB308' }} onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>MANAGE</Button>
            </Box>
          </Stack>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default BillingTab;
