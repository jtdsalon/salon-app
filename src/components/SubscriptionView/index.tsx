import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid2,
  Stack,
  Button,
  Divider,
  useTheme,
  alpha,
  Radio,
  RadioGroup,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Zoom,
} from '@mui/material';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Gem,
  Trophy,
  PartyPopper,
} from 'lucide-react';
import { useAuthContext } from '@/state/auth';
import { updateUserSubscription } from '@/state/auth/auth.actions';
import {
  getSubscriptionPlansApi,
  getCurrentSubscriptionApi,
  createOrUpgradeSubscriptionApi,
  type SubscriptionPlan,
  type PlanPrice,
} from '@/services/api/subscriptionService';

type BillingCycle = 'monthly' | 'quarterly' | 'six_months' | 'annual';

interface PricingOption {
  cycle: BillingCycle;
  label: string;
  price: number;
  discount?: string;
  savings?: string;
  planPriceId: string;
}

const CYCLE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  six_month: '6 Months',
  six_months: '6 Months',
  annual: 'Annual',
};

const DEFAULT_FEATURES = [
  'Unlimited Appointment Bookings',
  'AI Demand Forecasting & Analytics',
  'Premium Artisan Marketplace Access',
  'Staff Performance Tracking',
  'Automated Email & SMS Rituals',
  'Financial Vault & Yield Reports',
  'Priority 24/7 Concierge Support',
  'Multi-Salon Management',
];

function planPricesToOptions(prices: PlanPrice[]): PricingOption[] {
  return prices.map((p) => {
    const cycle = (p.billing_cycle === 'six_month' ? 'six_months' : p.billing_cycle) as BillingCycle;
    const label = CYCLE_LABELS[p.billing_cycle] || p.billing_cycle;
    const discount = p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : undefined;
    const baseTotal = p.base_price * (p.duration_months || 1);
    const savings =
      p.discount_percentage > 0
        ? `Save Rs. ${((baseTotal - p.final_price) / 1000).toFixed(0)}K`
        : undefined;
    return {
      cycle,
      label,
      price: p.final_price,
      discount,
      savings,
      planPriceId: p.id,
    };
  });
}

interface SubscriptionPlansProps {
  isPro?: boolean;
  setIsPro?: (val: boolean) => void;
  setBannerType?: (type: 'trial_ending' | 'payment_due' | 'expired') => void;
  setBannerVisible?: (visible: boolean) => void;
  setBannerDaysLeft?: (days: number) => void;
}

const SubscriptionView: React.FC<SubscriptionPlansProps> = ({
  isPro: isProProp,
  setIsPro: setIsProProp,
  setBannerType,
  setBannerVisible,
  setBannerDaysLeft,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const isProFromAuth = user?.subscription?.isPro ?? false;
  const isPro = isProProp ?? isProFromAuth;

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanPriceId, setSelectedPlanPriceId] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pricingOptions = useMemo(() => {
    const pro = plans.find((p) => p.code === 'PRO');
    if (!pro?.prices?.length) return [];
    return planPricesToOptions(pro.prices);
  }, [plans]);

  const defaultPriceId = useMemo(() => {
    const pro = plans.find((p) => p.code === 'PRO');
    const mostPopularPrice = pro?.prices?.find((p) => p.is_most_popular);
    if (mostPopularPrice) {
      const opt = pricingOptions.find((o) => o.planPriceId === mostPopularPrice.id);
      if (opt) return opt.planPriceId;
    }
    const annual = pricingOptions.find((o) => o.cycle === 'annual');
    return annual?.planPriceId ?? pricingOptions[0]?.planPriceId ?? null;
  }, [pricingOptions, plans]);

  useEffect(() => {
    if (defaultPriceId && !selectedPlanPriceId) setSelectedPlanPriceId(defaultPriceId);
  }, [defaultPriceId, selectedPlanPriceId]);

  useEffect(() => {
    let cancelled = false;
    getSubscriptionPlansApi()
      .then((res) => {
        const data = res?.data?.data ?? res?.data;
        if (Array.isArray(data) && !cancelled) setPlans(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingPlans(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCycle = useMemo(() => {
    const opt = pricingOptions.find((o) => o.planPriceId === selectedPlanPriceId);
    return opt?.cycle ?? 'annual';
  }, [pricingOptions, selectedPlanPriceId]);

  const currentOption = pricingOptions.find((o) => o.planPriceId === selectedPlanPriceId) ?? pricingOptions[0];
  const features = useMemo(() => {
    const pro = plans.find((p) => p.code === 'PRO');
    if (!pro?.features?.length) return DEFAULT_FEATURES;
    return pro.features
      .filter((f) => f.feature_value === 'true' || f.feature_key.startsWith('max_'))
      .map((f) =>
        f.feature_key === 'unlimited_bookings'
          ? 'Unlimited Appointment Bookings'
          : f.feature_key === 'ai_forecasting'
            ? 'AI Demand Forecasting & Analytics'
            : f.feature_key === 'priority_support'
              ? 'Priority 24/7 Concierge Support'
              : f.feature_key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      );
  }, [plans]);

  const handleCycleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cycle = (event.target as HTMLInputElement).value as BillingCycle;
    const opt = pricingOptions.find((o) => o.cycle === cycle);
    if (opt) setSelectedPlanPriceId(opt.planPriceId);
  };

  const handleUpgrade = async () => {
    if (!selectedPlanPriceId) return;
    setIsUpgrading(true);
    try {
      await createOrUpgradeSubscriptionApi({ plan_price_id: selectedPlanPriceId });
      const currentRes = await getCurrentSubscriptionApi();
      const summary = currentRes?.data?.data ?? currentRes?.data;
      if (summary?.isPro != null) {
        dispatch(updateUserSubscription({ isPro: summary.isPro, banner: summary.banner ?? null }) as never);
      }
      setShowSuccess(true);
      setIsProProp?.(true);
    } catch {
      // Error could be shown via snackbar
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isPro && !showSuccess) {
    return (
      <Stack spacing={4}>
        <Paper sx={{
          p: 6,
          borderRadius: '40px',
          bgcolor: alpha('#EAB308', 0.05),
          border: '2px solid #EAB308',
          textAlign: 'center',
        }}>
          <Box sx={{
            width: 80, height: 80,
            bgcolor: '#EAB308',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 20px 40px rgba(234, 179, 8, 0.3)',
          }}>
            <Trophy size={40} color="#050914" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>You are a <span className="gold-gradient-text">Pro Member</span></Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontWeight: 600 }}>
            Your subscription is active. Enjoy all premium features!
          </Typography>
          <Button
            variant="outlined"
            sx={{ borderRadius: '12px', fontWeight: 900, borderColor: '#EAB308', color: '#EAB308' }}
            onClick={() => setIsProProp?.(false)}
          >
            Manage Subscription
          </Button>
        </Paper>

        {/* Demo Controls for Banners */}
        <Paper sx={{ p: 3, borderRadius: '24px', border: `1px dashed ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}>DEMO: TEST NOTIFICATION BANNERS</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => {
                setBannerType?.('trial_ending');
                setBannerDaysLeft?.(5);
                setBannerVisible?.(true);
              }}
            >
              Trial Ending (5d)
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => {
                setBannerType?.('payment_due');
                setBannerDaysLeft?.(3);
                setBannerVisible?.(true);
              }}
            >
              Payment Due (3d)
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={() => {
                setBannerType?.('expired');
                setBannerVisible?.(true);
              }}
            >
              Membership Expired
            </Button>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  if (loadingPlans && pricingOptions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: '#EAB308' }} />
      </Box>
    );
  }

  const options = pricingOptions.length > 0 ? pricingOptions : [
    { cycle: 'annual' as BillingCycle, label: 'Annual', price: 140000, discount: '22% OFF', savings: 'Save Rs. 40,000', planPriceId: '' },
  ];
  const currentOptionResolved = currentOption ?? options[0];

  return (
    <Box className="animate-fadeIn" sx={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, minWidth: 0 }}>
        <Box sx={{ p: 1.5, bgcolor: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px' }}>
          <Gem color="#EAB308" size={24} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Premium <span className="gold-gradient-text">Membership</span></Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Elevate your salon management with Glow Mgmt Pro</Typography>
        </Box>
      </Stack>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, lg: 7 }}>
          <Paper sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '40px',
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', top: -40, right: -40, opacity: 0.03, transform: 'rotate(15deg)' }}>
              <Sparkles size={240} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Select your <span className="gold-gradient-text">Billing Cycle</span></Typography>

            <RadioGroup value={selectedCycle} onChange={handleCycleChange}>
              <Stack spacing={2}>
                {options.map((option) => (
                    <Paper
                      key={option.planPriceId || option.cycle}
                      onClick={() => {
                        setSelectedPlanPriceId(option.planPriceId || null);
                      }}
                      sx={{
                        p: 3,
                        borderRadius: '24px',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: selectedPlanPriceId === option.planPriceId ? '#EAB308' : theme.palette.divider,
                        bgcolor: selectedPlanPriceId === option.planPriceId ? alpha('#EAB308', 0.03) : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: selectedPlanPriceId === option.planPriceId ? '#EAB308' : alpha(theme.palette.text.primary, 0.2),
                          bgcolor: selectedPlanPriceId === option.planPriceId ? alpha('#EAB308', 0.05) : alpha(theme.palette.text.primary, 0.01),
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Radio
                            value={option.cycle}
                            sx={{ color: theme.palette.divider, '&.Mui-checked': { color: '#EAB308' } }}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>{option.label}</Typography>
                            {option.savings && (
                              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 800 }}>{option.savings}</Typography>
                            )}
                          </Box>
                        </Stack>
                        <Stack alignItems="flex-end">
                          <Stack direction="row" spacing={1} alignItems="center">
                            {option.cycle === 'annual' && (
                              <Typography variant="caption" sx={{ color: '#EAB308', fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                MOST POPULAR
                              </Typography>
                            )}
                            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }}>
                              Rs. {option.price.toLocaleString()}
                            </Typography>
                          </Stack>
                          {option.discount && (
                            <Chip
                              label={option.discount}
                              size="small"
                              sx={{
                                bgcolor: '#EAB308',
                                color: '#050914',
                                fontWeight: 900,
                                fontSize: '10px',
                                height: 20,
                              }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
              </Stack>
            </RadioGroup>

            <Box sx={{ mt: 5, p: 3, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: '24px', border: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha('#EAB308', 0.1), borderRadius: '10px' }}>
                  <ShieldCheck size={20} color="#EAB308" />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Secure payment processing. Cancel your subscription anytime from the dashboard.
                </Typography>
              </Stack>
            </Box>

            {/* Demo Controls for Banners (Non-Pro) */}
            <Box sx={{ mt: 4, p: 3, borderRadius: '24px', border: `1px dashed ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}>DEMO: TEST NOTIFICATION BANNERS</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => {
                    setBannerType?.('trial_ending');
                    setBannerDaysLeft?.(5);
                    setBannerVisible?.(true);
                  }}
                >
                  Trial Ending (5d)
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="error"
                  onClick={() => {
                    setBannerType?.('expired');
                    setBannerVisible?.(true);
                  }}
                >
                  Membership Expired
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid2>

        {/* Right Side: Summary & Features */}
        <Grid2 size={{ xs: 12, lg: 5 }}>
          <Stack spacing={4}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '40px', 
              bgcolor: '#0B1224', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Zap size={20} color="#EAB308" /> Order Summary
              </Typography>
              
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>Plan</Typography>
                  <Typography sx={{ fontWeight: 800 }}>Glow Mgmt Pro</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>Billing</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{currentOptionResolved?.label ?? '—'}</Typography>
                </Stack>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Total Due</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#EAB308' }}>
                    Rs. {(currentOptionResolved?.price ?? 0).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={isUpgrading || !selectedPlanPriceId}
                onClick={handleUpgrade}
                endIcon={isUpgrading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                sx={{ 
                  mt: 4, 
                  py: 2, 
                  borderRadius: '16px', 
                  bgcolor: '#EAB308', 
                  color: '#050914', 
                  fontWeight: 900,
                  '&:hover': { bgcolor: '#FACC15' },
                  '&.Mui-disabled': { bgcolor: alpha('#EAB308', 0.5), color: alpha('#050914', 0.5) }
                }}
              >
                {isUpgrading ? 'Processing...' : 'Complete Upgrade'}
              </Button>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <CreditCard size={14} color="#94A3B8" />
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>Visa, Mastercard, Amex accepted</Typography>
              </Stack>
            </Paper>

            <Paper sx={{ 
              p: 4, 
              borderRadius: '40px', 
              bgcolor: 'background.paper', 
              border: `1px solid ${theme.palette.divider}` 
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>What's included:</Typography>
              <Stack spacing={2}>
                {features.map((feature, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle2 size={18} color="#EAB308" />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>{feature}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccess} 
        onClose={() => setShowSuccess(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: '40px',
            p: 4,
            textAlign: 'center',
            bgcolor: '#0B1224',
            color: 'white',
            maxWidth: 400
          }
        }}
      >
        <DialogContent>
          <Box sx={{ 
            width: 80, height: 80, 
            bgcolor: '#EAB308', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 20px 40px rgba(234, 179, 8, 0.3)'
          }}>
            <PartyPopper size={40} color="#050914" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Welcome to <span className="gold-gradient-text">Pro</span></Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4, fontWeight: 600 }}>
            Your upgrade was successful! You now have full access to all premium features of GLOW MGMT.
          </Typography>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => setShowSuccess(false)}
            sx={{ 
              py: 2, 
              borderRadius: '16px', 
              bgcolor: '#EAB308', 
              color: '#050914', 
              fontWeight: 900,
              '&:hover': { bgcolor: '#FACC15' }
            }}
          >
            Start Exploring
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SubscriptionView;
