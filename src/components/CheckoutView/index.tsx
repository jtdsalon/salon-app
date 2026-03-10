
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  useTheme,
  Avatar,
  Fade,
  InputAdornment,
  Collapse,
} from '@mui/material';
// Import Grid from the specific Grid2 package to fix the export error
import Grid from '@mui/material/Grid2';
import {
  ArrowLeft,
  Lock,
  CreditCard,
  User,
  Truck,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onBack, onComplete }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ritualFee = Math.round(subtotal * 0.05);
  const total = subtotal + ritualFee;

  const steps = ['Curating Ritual', 'Patron Details', 'Secure Exchange'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setIsSuccess(true);
      setTimeout(() => onComplete(), 4000);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) onBack();
    else setActiveStep((prev) => prev - 1);
  };

  if (isSuccess) {
    return (
      <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', maxWidth: 450 }}>
            <Box sx={{ mb: 4, display: 'inline-flex', p: 3, bgcolor: 'secondary.main', borderRadius: '50%', color: 'white', boxShadow: '0 20px 40px rgba(181, 148, 16, 0.2)' }}>
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Ritual Confirmed</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Your curated aesthetic selection is being prepared by our artisans. A digital manifesto has been sent to your inbox.
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', mb: 1 }}>ORDER HASH</Typography>
              <Typography sx={{ fontWeight: 900, letterSpacing: '0.1em' }}>#GLOW-882-ART-99</Typography>
            </Paper>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }} className="animate-fadeIn">
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
        <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Checkout <Box component="span" sx={{ color: 'secondary.main' }}>Sanctuary</Box></Typography>
          <Typography variant="body2" color="text.secondary">Secure exchange for your aesthetic rituals.</Typography>
        </Box>
      </Stack>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '48px', border: '1.5px solid', borderColor: 'divider' }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8, '& .MuiStepIcon-root.Mui-active': { color: 'secondary.main' }, '& .MuiStepIcon-root.Mui-completed': { color: 'secondary.main' } }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 800, fontSize: '12px' } }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 300 }}>
              {activeStep === 0 && (
                <Fade in>
                  <Stack spacing={4}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Review Selection</Typography>
                    {items.map((item) => (
                      <Stack key={item.id} direction="row" spacing={3} alignItems="center">
                        <Avatar src={item.image} variant="rounded" sx={{ width: 80, height: 80, borderRadius: '20px' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 900 }}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.brand} • Qty: {item.quantity}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 900 }}>Rs. {(item.price * item.quantity).toLocaleString()}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Fade>
              )}

              {activeStep === 1 && (
                <Fade in>
                  <Stack spacing={4}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Patron Dossier</Typography>
                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <TextField fullWidth label="Full Name" placeholder="Aesthetic Seeker" variant="outlined" InputProps={{ sx: { borderRadius: '20px' }, startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Email Sanctuary" placeholder="sanctuary@glow.com" variant="outlined" InputProps={{ sx: { borderRadius: '20px' } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Contact Line" placeholder="+91 9988 7766" variant="outlined" InputProps={{ sx: { borderRadius: '20px' } }} />
                      </Grid>
                      <Grid size={12}>
                        <TextField fullWidth label="Sanctuary Address" multiline rows={3} placeholder="Street, City, Postal Identity" variant="outlined" InputProps={{ sx: { borderRadius: '20px' }, startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Truck size={18} /></InputAdornment> }} />
                      </Grid>
                    </Grid>
                  </Stack>
                </Fade>
              )}

              {activeStep === 2 && (
                <Fade in>
                  <Stack spacing={4}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>Secure Exchange</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                        <Lock size={14} />
                        <Typography sx={{ fontSize: '10px', fontWeight: 900 }}>ENCRYPTED</Typography>
                      </Box>
                    </Stack>
                    
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: 'text.primary', color: 'background.paper', position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                      <Stack spacing={4}>
                        <Stack direction="row" justifyContent="space-between">
                          <CreditCard size={32} strokeWidth={1.5} />
                          <Typography sx={{ fontWeight: 900, opacity: 0.5 }}>RITUAL CARD</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '22px', letterSpacing: '0.2em', fontWeight: 500 }}>**** **** **** 4421</Typography>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography sx={{ fontSize: '10px', opacity: 0.5 }}>HOLDER</Typography>
                            <Typography sx={{ fontWeight: 800 }}>ELENA GILBERT</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '10px', opacity: 0.5 }}>EXP</Typography>
                            <Typography sx={{ fontWeight: 800 }}>12/28</Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <TextField fullWidth label="Card Identity Number" variant="outlined" InputProps={{ sx: { borderRadius: '20px' } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Expiry" placeholder="MM / YY" variant="outlined" InputProps={{ sx: { borderRadius: '20px' } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Security Code" placeholder="CVV" variant="outlined" InputProps={{ sx: { borderRadius: '20px' }, endAdornment: <ShieldCheck size={18} /> }} />
                      </Grid>
                    </Grid>
                  </Stack>
                </Fade>
              )}
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 10 }}>
              <Button onClick={handleBack} sx={{ borderRadius: '100px', px: 4, fontWeight: 800, textTransform: 'none', color: 'text.secondary' }}>
                {activeStep === 0 ? 'Abort' : 'Revisit'}
              </Button>
              <Button 
                variant="contained" 
                disableElevation 
                fullWidth 
                onClick={handleNext}
                endIcon={activeStep === steps.length - 1 ? <Sparkles size={18} /> : <ChevronRight size={18} />}
                sx={{ borderRadius: '100px', py: 2, bgcolor: 'text.primary', color: 'background.paper', fontWeight: 900, textTransform: 'none' }}
              >
                {activeStep === steps.length - 1 ? 'Finalize Ritual' : 'Next Cycle'}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4} sx={{ position: 'sticky', top: 100 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Aesthetic Summary</Typography>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Curated Subtotal</Typography>
                  <Typography sx={{ fontWeight: 800 }}>Rs. {subtotal.toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Ritual Fee (5%)</Typography>
                  <Typography sx={{ fontWeight: 800 }}>Rs. {ritualFee.toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Glow Shipping</Typography>
                  <Typography sx={{ fontWeight: 900, color: 'success.main' }}>COMPLIMENTARY</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Total</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main' }}>Rs. {total.toLocaleString()}</Typography>
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1px dashed', borderColor: 'secondary.main', bgcolor: 'rgba(181, 148, 16, 0.02)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: 'secondary.main', color: 'white', borderRadius: '10px' }}>
                  <ShieldCheck size={20} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 900 }}>Purchase Protection</Typography>
                  <Typography variant="caption" color="text.secondary">Glow certified authentic rituals only.</Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutView;
