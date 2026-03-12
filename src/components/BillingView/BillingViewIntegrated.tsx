import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Tooltip,
  alpha,
  Grid2,
  useMediaQuery,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Users,
  Sparkles,
  X,
  CalendarDays,
} from 'lucide-react';
import { useBilling } from '../../state/billing/useBilling';
import { useAppointment } from '../../state/appointment';
import { formatCurrency } from '../../services/api/billingService';

const BillingViewIntegrated: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux state
  const {
    payments,
    invoices,
    loading,
    error,
    success,
    successMessage,
    pagination,
    getPayments,
    processPayment,
    clearSuccess,
    clearError
  } = useBilling();

  const { appointments } = useAppointment();

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'Visa',
    last4: '4421',
    expiry: '12/28',
    holder: 'Elena Rodriguez'
  });
  const [tempPayment, setTempPayment] = useState({ 
    holder: paymentMethod.holder,
    cardNumber: '•••• •••• •••• 4421', 
    expiry: paymentMethod.expiry,
    cvc: '•••' 
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load payments on mount
  useEffect(() => {
    getPayments(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  // Clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => clearSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const today = new Date().toDateString();
    const todaysRevenue = payments
      .filter(p => new Date(p.created_at).toDateString() === today)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const completedBookings = appointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledBookings = appointments.filter(a => a.status === 'CANCELLED').length;

    return {
      totalRevenue,
      todaysRevenue,
      completedBookings,
      cancelledBookings,
      appointmentUsage: appointments.length,
      appointmentLimit: 50,
      aiCreditsUsage: 142,
      aiCreditsLimit: 500,
      monthlyBills: totalRevenue,
      activeStylists: 4
    };
  };

  const stats = calculateStats();
  const displayedInvoices = invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!tempPayment.holder.trim()) {
      newErrors.holder = 'Cardholder name required';
    } else if (tempPayment.holder.trim().length < 3) {
      newErrors.holder = 'Name too short';
    }

    const cleanCard = tempPayment.cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'Card number required';
    } else if (!cleanCard.includes('•') && cleanCard.length < 15) {
      newErrors.cardNumber = 'Invalid card length';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!tempPayment.expiry) {
      newErrors.expiry = 'Expiry required';
    } else if (!expiryRegex.test(tempPayment.expiry)) {
      newErrors.expiry = 'Invalid format (MM/YY)';
    } else {
      const [m, y] = tempPayment.expiry.split('/').map(n => parseInt(n));
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (y < currentYear || (y === currentYear && m < currentMonth)) {
        newErrors.expiry = 'Card expired';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePayment = () => {
    if (validate()) {
      const cleanCard = tempPayment.cardNumber.replace(/\s/g, '');
      const newLast4 = cleanCard.includes('•') ? paymentMethod.last4 : cleanCard.slice(-4);
      const cardType = cleanCard.startsWith('3') ? 'Amex' : cleanCard.startsWith('5') ? 'Master' : 'Visa';
      
      setPaymentMethod({
        type: cardType,
        last4: newLast4,
        expiry: tempPayment.expiry,
        holder: tempPayment.holder
      });
      
      if (!cleanCard.includes('•')) {
        try {
          processPayment(tempPayment.holder, {
            method: cardType,
            card_number: cleanCard,
            expiry: tempPayment.expiry,
            cvc: tempPayment.cvc,
            holder_name: tempPayment.holder
          });
        } catch (err) {
          console.error('Error processing payment:', err);
        }
      }
      
      setIsPaymentDialogOpen(false);
      setErrors({});
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setTempPayment({ ...tempPayment, cardNumber: formatted });
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setTempPayment({ ...tempPayment, expiry: value });
    if (errors.expiry) setErrors({ ...errors, expiry: '' });
  };

  const handleDownloadPDF = (invoiceId: string) => {
    console.log(`Downloading PDF for invoice: ${invoiceId}`);
  };

  return (
    <Box sx={{ pb: 10 }} className="animate-fadeIn">
      {success && (
        <Alert 
          severity="success" 
          onClose={clearSuccess}
          sx={{ mb: 3, borderRadius: '16px', fontWeight: 700 }}
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ mb: 3, borderRadius: '16px', fontWeight: 700 }}
        >
          {error?.errorMessage || 'An error occurred'}
        </Alert>
      )}

      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={3} sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.04em' }}>
            Billing & <Box component="span" sx={{ color: '#EAB308' }}>Payments</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Manage your salon's revenue, invoices, and billing settings.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Chip 
            icon={<CheckCircle2 size={14} color="#10B981" />} 
            label="ACCOUNT STATUS: ACTIVE" 
            sx={{ 
              fontWeight: 900, 
              fontSize: '11px', 
              bgcolor: alpha('#10B981', 0.1), 
              color: '#10B981',
              borderRadius: '10px',
              height: 36,
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }} 
          />
        </Stack>
      </Stack>

      {/* Statistics Row */}
      <Grid2 container spacing={3} sx={{ mb: 6 }}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha('#10B981', 0.1), borderRadius: '12px', color: '#10B981' }}>
                  <TrendingUp size={20} />
                </Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>TODAY'S REVENUE</Typography>
              </Stack>
              {loading ? (
                <Skeleton variant="text" width={120} height={40} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{formatCurrency(stats.todaysRevenue)}</Typography>
              )}
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>+15% vs. yesterday</Typography>
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha('#6366F1', 0.1), borderRadius: '12px', color: '#6366F1' }}>
                  <Calendar size={20} />
                </Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>MONTHLY CYCLE</Typography>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="flex-end">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.completedBookings}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Completed</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#F43F5E' }}>{stats.cancelledBookings}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Cancelled</Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha('#EAB308', 0.1), borderRadius: '12px', color: '#EAB308' }}>
                  <Users size={20} />
                </Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>ACTIVE STYLISTS</Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.activeStylists} <Box component="span" sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 500 }}>online</Box></Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Busy until 4 PM</Typography>
            </Stack>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Main Content */}
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {/* Usage Card */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: '48px', 
                border: '1.5px solid', 
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider',
                bgcolor: isDark ? '#0B1224' : 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <Tooltip title="Usage resets on the 1st of every month.">
                  <IconButton size="small"><Info size={18} /></IconButton>
                </Tooltip>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Service Usage Limits</Typography>
              
              <Stack spacing={6}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: alpha('#EAB308', 0.1), borderRadius: '12px', color: '#EAB308' }}>
                        <Zap size={20} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '15px' }}>Total Appointments</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Booking system capacity</Typography>
                      </Box>
                    </Stack>
                    <Typography sx={{ fontWeight: 900, fontSize: '18px' }}>{stats.appointmentUsage} <Box component="span" sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 500 }}>/ {stats.appointmentLimit}</Box></Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.appointmentUsage / stats.appointmentLimit) * 100} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6, 
                      bgcolor: isDark ? alpha('#FFFFFF', 0.05) : 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: '#EAB308', borderRadius: 6 }
                    }} 
                  />
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: alpha('#6366F1', 0.1), borderRadius: '12px', color: '#6366F1' }}>
                        <Sparkles size={20} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '15px' }}>AI Marketing Credits</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Automated campaign tokens</Typography>
                      </Box>
                    </Stack>
                    <Typography sx={{ fontWeight: 900, fontSize: '18px' }}>{stats.aiCreditsUsage} <Box component="span" sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 500 }}>/ {stats.aiCreditsLimit}</Box></Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.aiCreditsUsage / stats.aiCreditsLimit) * 100} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6, 
                      bgcolor: isDark ? alpha('#FFFFFF', 0.05) : 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: '#6366F1', borderRadius: 6 }
                    }} 
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Invoices Table */}
            <Paper elevation={0} sx={{ borderRadius: '48px', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider', overflow: 'hidden', bgcolor: isDark ? '#0B1224' : 'white' }}>
              <Box sx={{ p: 4, pb: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Receipt size={20} color="#EAB308" />
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Billing History</Typography>
                </Stack>
              </Box>
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading invoices...</Typography>
                </Box>
              ) : displayedInvoices.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Receipt size={40} color="text.secondary" opacity={0.5} />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>No invoices found</Typography>
                </Box>
              ) : (
                <>
                  {isMobile ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, pb: 1 }}>
                      {displayedInvoices.map((inv) => (
                        <Paper
                          key={inv.id}
                          elevation={0}
                          sx={{
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'divider',
                            p: 2,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '12px', color: 'text.secondary' }}>{inv.id}</Typography>
                              <Typography sx={{ fontSize: '13px', fontWeight: 700, mt: 0.5 }}>{inv.created_at}</Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <CreditCard size={12} color="#94A3B8" />
                                <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>{inv.method}</Typography>
                              </Stack>
                              <Typography sx={{ fontWeight: 900, fontSize: '16px', mt: 1 }}>{formatCurrency(inv.amount)}</Typography>
                            </Box>
                            <Button
                              size="small"
                              startIcon={<Download size={14} />}
                              onClick={() => handleDownloadPDF(inv.id)}
                              sx={{ fontWeight: 900, fontSize: '11px', color: '#EAB308', textTransform: 'none' }}
                            >
                              PDF
                            </Button>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: isDark ? alpha('#FFFFFF', 0.02) : 'rgba(0,0,0,0.02)' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', pl: 4 }}>INVOICE ID</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px' }}>DATE</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px' }}>AMOUNT</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px' }}>PAYMENT METHOD</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', pr: 4 }}>ACTION</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {displayedInvoices.map((inv) => (
                            <TableRow key={inv.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell sx={{ pl: 4, fontWeight: 800, fontSize: '13px' }}>{inv.id}</TableCell>
                              <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontWeight: 700 }}>{inv.created_at}</TableCell>
                              <TableCell sx={{ fontWeight: 900 }}>{formatCurrency(inv.amount)}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CreditCard size={12} color="#94A3B8" />
                                  <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>{inv.method}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="right" sx={{ pr: 3 }}>
                                <Button startIcon={<Download size={14} />} onClick={() => handleDownloadPDF(inv.id)} sx={{ fontWeight: 900, fontSize: '11px', color: '#EAB308', textTransform: 'none' }}>PDF</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={invoices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'divider'}`,
                      color: 'text.secondary',
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontWeight: 800,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }
                    }}
                  />
                </>
              )}
            </Paper>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4}>
            {/* Bill Preview */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: '40px', 
                bgcolor: isDark ? 'white' : '#0F172A', 
                color: isDark ? '#050914' : 'white',
                position: 'relative'
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 900, opacity: 0.6, letterSpacing: '0.15em', mb: 1 }}>ESTIMATED MONTHLY BILL</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>{formatCurrency(stats.monthlyBills)}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700 }}>Since Feb 01 • Next payment Mar 01</Typography>
              </Box>

              <Divider sx={{ borderColor: alpha(isDark ? '#000' : '#FFF', 0.1), mb: 3 }} />

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 700 }}>Salon Pro Plan</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>FREE</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 700 }}>Extra Bookings (x2)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>Rs. 20,000</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 700 }}>Premium SMS Package</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>Rs. 8,400</Typography>
                </Stack>
              </Stack>

              <Button 
                fullWidth 
                variant="contained" 
                disableElevation
                sx={{ 
                  borderRadius: '100px', 
                  bgcolor: '#EAB308', 
                  color: '#050914', 
                  py: 1.5, 
                  fontWeight: 900,
                  '&:hover': { bgcolor: '#FACC15' }
                }}
              >
                PAY NOW
              </Button>
            </Paper>

            {/* Payment Method */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '40px', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider', bgcolor: isDark ? '#0B1224' : 'white' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Payment Method</Typography>
                <Button 
                  size="small" 
                  onClick={() => setIsPaymentDialogOpen(true)}
                  sx={{ fontWeight: 900, color: '#EAB308' }}
                >
                  Edit
                </Button>
              </Stack>
              
              <Box sx={{ 
                p: 3, 
                borderRadius: '24px', 
                bgcolor: isDark ? alpha('#FFFFFF', 0.03) : alpha('#000', 0.02),
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'divider',
                mb: 3
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: isDark ? 'white' : '#0F172A', color: isDark ? '#050914' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>{paymentMethod.type} •••• {paymentMethod.last4}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Expires {paymentMethod.expiry}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
                <ShieldCheck size={18} color="#10B981" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Billing information is securely encrypted.
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Payment Dialog */}
      <Dialog 
        open={isPaymentDialogOpen} 
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setErrors({});
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '32px',
            bgcolor: isDark ? '#0B1224' : 'white',
            backgroundImage: 'none',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 900 }}>Secure <span style={{ color: '#EAB308' }}>Billing</span></Typography>
            <IconButton onClick={() => setIsPaymentDialogOpen(false)} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <X size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>CARDHOLDER NAME</Typography>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  value={tempPayment.holder}
                  error={!!errors.holder}
                  helperText={errors.holder}
                  onChange={(e) => {
                    setTempPayment({ ...tempPayment, holder: e.target.value });
                    if (errors.holder) setErrors({ ...errors, holder: '' });
                  }}
                  InputProps={{
                    sx: { borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
                    startAdornment: <InputAdornment position="start"><Users size={18} color={errors.holder ? theme.palette.error.main : "#94A3B8"} /></InputAdornment>
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>CARD NUMBER</Typography>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  value={tempPayment.cardNumber}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  onChange={handleCardChange}
                  InputProps={{
                    sx: { borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
                    startAdornment: <InputAdornment position="start"><CreditCard size={18} color={errors.cardNumber ? theme.palette.error.main : "#94A3B8"} /></InputAdornment>
                  }}
                />
              </Box>

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 7 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>EXPIRY</Typography>
                  <TextField 
                    fullWidth 
                    variant="outlined" 
                    value={tempPayment.expiry}
                    error={!!errors.expiry}
                    helperText={errors.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    InputProps={{
                      sx: { borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
                      startAdornment: <InputAdornment position="start"><CalendarDays size={18} color={errors.expiry ? theme.palette.error.main : "#94A3B8"} /></InputAdornment>
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block' }}>CVC</Typography>
                  <TextField 
                    fullWidth 
                    variant="outlined" 
                    value={tempPayment.cvc}
                    error={!!errors.cvc}
                    helperText={errors.cvc}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setTempPayment({ ...tempPayment, cvc: val });
                      if (errors.cvc) setErrors({ ...errors, cvc: '' });
                    }}
                    placeholder="•••"
                    InputProps={{
                      sx: { borderRadius: '14px', fontWeight: 700, fontSize: '14px' },
                      startAdornment: <InputAdornment position="start"><ShieldCheck size={18} color={errors.cvc ? theme.palette.error.main : "#94A3B8"} /></InputAdornment>
                    }}
                  />
                </Grid2>
              </Grid2>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            fullWidth 
            variant="contained" 
            disableElevation 
            onClick={handleSavePayment}
            sx={{ 
              borderRadius: '16px', 
              py: 1.8, 
              bgcolor: isDark ? 'white' : '#0F172A', 
              color: isDark ? '#050914' : 'white', 
              fontWeight: 900,
              '&:hover': { bgcolor: isDark ? '#F1F5F9' : '#1E293B' }
            }}
          >
            SAVE CARD
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingViewIntegrated;
