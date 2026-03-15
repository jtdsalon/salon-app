import React, { useMemo, useState } from 'react';
import { 
  Dialog, DialogTitle, Stack, Avatar, Box, Typography, IconButton, 
  DialogContent, Grid2, DialogActions, Button, Chip, alpha, Collapse, CircularProgress
} from '@mui/material';
import { 
  X, Scissors, Calendar as CalendarIcon, Briefcase, Clock, 
  CreditCard, ArrowLeft, CheckCircle2, Printer, Mail, 
  MessageSquare, PhoneCall, Sparkles
} from 'lucide-react';
import { Appointment } from '../types';
import { formatTime12h } from '../utils';
import { getFullImageUrl } from '@/lib/util/imageUrl';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
  category: string;
  images?: string[];
}

interface Staff {
  id: string;
  name: string;
  role?: string;
}

export interface CompletionOptions {
  print: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

interface AppointmentDetailProps {
  open: boolean;
  onClose: () => void;
  selectedApt: Appointment | null;
  onEdit: (apt: Appointment) => void;
  onArchive: (id: string) => void;
  onComplete?: (id: string, options: CompletionOptions) => void;
  onBackToList: () => void;
  isDark: boolean;
  isMobile: boolean;
  isSubmitting?: boolean;
  services?: Service[];
  staff?: Staff[];
}

// Simple print invoice function
const printInvoice = (apt: Appointment, services: Service[], staffMember?: Staff) => {
  const serviceIds = apt.serviceIds || (apt.serviceId ? [apt.serviceId] : []);
  const selectedServices = serviceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[];
  const total = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  
  const invoiceWindow = window.open('', '_blank');
  if (invoiceWindow) {
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${apt.customerName}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { color: #EAB308; margin-bottom: 8px; }
            .header { border-bottom: 2px solid #EAB308; padding-bottom: 20px; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            .info p { margin: 4px 0; color: #64748B; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
            th { background: #F8FAFC; font-weight: 800; }
            .total { font-size: 1.5em; font-weight: 900; color: #EAB308; text-align: right; margin-top: 20px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Appointment invoice</h1>
            <p style="color: #94A3B8; font-weight: 600;">Receipt</p>
          </div>
          <div class="info">
            <p><strong>Customer:</strong> ${apt.customerName}</p>
            <p><strong>Date:</strong> ${apt.date}</p>
            <p><strong>Time:</strong> ${apt.time}</p>
            <p><strong>Staff:</strong> ${staffMember?.name || 'Any staff'}</p>
          </div>
          <table>
            <thead>
              <tr><th>Service</th><th style="text-align: right;">Price</th></tr>
            </thead>
            <tbody>
              ${selectedServices.map(s => `<tr><td>${s.name}</td><td style="text-align: right;">Rs. ${Number(s.price).toLocaleString()}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="total">Total: Rs. ${total.toLocaleString()}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  }
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ 
  open, onClose, selectedApt, onEdit, onArchive, onComplete, onBackToList, isDark, isMobile, isSubmitting = false,
  services = [], staff = []
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<CompletionOptions>({
    print: true,
    email: true,
    sms: false,
    whatsapp: true
  });

  // Get service IDs - support both single serviceId and multiple serviceIds
  const serviceIds = useMemo(() => {
    if (!selectedApt) return [];
    if (selectedApt.serviceIds && selectedApt.serviceIds.length > 0) {
      return selectedApt.serviceIds;
    }
    return selectedApt.serviceId ? [selectedApt.serviceId] : [];
  }, [selectedApt]);

  // Calculate total yield from all services
  const totalYield = useMemo(() => {
    if (!services || services.length === 0) return 0;
    return serviceIds.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (Number(service?.price) || 0);
    }, 0);
  }, [serviceIds, services]);

  // Get list of rituals/services
  const ritualList = useMemo(() => {
    if (!services || services.length === 0) return [];
    return serviceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[];
  }, [serviceIds, services]);

  const getStaffName = (staffId: string) => {
    if (!staffId || staffId === 'anyone') return 'Any staff';
    return staff.find(s => s.id === staffId)?.name || 'Any staff';
  };

  const handleToggleOption = (key: keyof CompletionOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalize = () => {
    if (selectedApt && onComplete) {
      // Trigger side-effects based on options
      if (options.print) {
        const staffMember = staff.find(s => s.id === selectedApt.staffId);
        printInvoice(selectedApt, services, staffMember);
      }
      
      onComplete(selectedApt.id, options);
      setIsCompleting(false);
      onClose();
    }
  };

  const handleManualPrint = () => {
    if (selectedApt) {
      const staffMember = staff.find(s => s.id === selectedApt.staffId);
      printInvoice(selectedApt, services, staffMember);
    }
  };

  const isAlreadyCompleted = selectedApt?.status === 'completed';
  const styleImageUrls = selectedApt?.styleImageUrls?.filter(Boolean) ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: isMobile ? '0' : '32px', bgcolor: isDark ? '#0B1224' : 'white', backgroundImage: 'none' } }} fullScreen={isMobile}>
      <DialogTitle sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 60, height: 60, bgcolor: isDark ? '#050914' : '#0F172A', fontWeight: 900, color: '#EAB308', fontSize: '24px' }}>{selectedApt?.customerName?.[0] || '?'}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>{selectedApt?.customerName}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 700, color: '#94A3B8', fontSize: '12px' }}>Customer</Typography>
                {isAlreadyCompleted && (
                  <Chip 
                    label="Completed" 
                    size="small" 
                    sx={{ height: 18, fontSize: '8px', fontWeight: 900, bgcolor: alpha('#10B981', 0.1), color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }} 
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          <IconButton onClick={onClose} disabled={isSubmitting} sx={{ color: '#CBD5E1' }}><X size={24} /></IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ bgcolor: isDark ? '#050914' : '#F8FAFC', p: 2, borderRadius: '20px' }}>
            <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.1em' }}>Scheduled services</Typography>
            <Stack spacing={1}>
              {ritualList.length > 0 ? (
                ritualList.map((ritual) => {
                  const serviceImg = (ritual as Service).images?.[0];
                  const imgUrl = serviceImg ? getFullImageUrl(serviceImg) : undefined;
                  return (
                    <Stack key={ritual.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, bgcolor: isDark ? '#161F33' : 'white', borderRadius: '12px' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {imgUrl ? (
                          <Box
                            component="img"
                            src={imgUrl}
                            alt={ritual.name}
                            sx={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }}
                          />
                        ) : (
                          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: isDark ? '#0B1224' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Scissors size={16} color="#EAB308" />
                          </Box>
                        )}
                        <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>{ritual.name}</Typography>
                      </Stack>
                      <Typography sx={{ fontWeight: 900, fontSize: '12px', color: '#EAB308' }}>Rs. {Number(ritual.price).toLocaleString()}</Typography>
                    </Stack>
                  );
                })
              ) : (
                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#94A3B8', textAlign: 'center', py: 2 }}>No services found</Typography>
              )}
            </Stack>
          </Box>

          {styleImageUrls.length > 0 && (
            <Box sx={{ bgcolor: isDark ? '#050914' : '#F8FAFC', p: 2, borderRadius: '20px' }}>
              <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.1em' }}>Customer&apos;s style references</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {styleImageUrls.map((url, idx) => {
                  const fullUrl = getFullImageUrl(url) || url;
                  return (
                    <Box
                      key={idx}
                      component="img"
                      src={fullUrl}
                      alt={`Style reference ${idx + 1}`}
                      onClick={() => setPreviewImageUrl(fullUrl)}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                        '&:hover': { borderColor: '#EAB308', opacity: 0.95 },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          <Grid2 container spacing={2}>
            {[ 
              { label: 'Date', value: selectedApt?.date, icon: <CalendarIcon size={18} /> }, 
              { label: 'Staff', value: selectedApt ? getStaffName(selectedApt.staffId) : '', icon: <Briefcase size={18} /> }, 
              { label: 'Time', value: selectedApt ? formatTime12h(selectedApt.time) : '', icon: <Clock size={18} /> }, 
              { label: 'Total', value: `Rs. ${totalYield.toLocaleString()}`, icon: <CreditCard size={18} />, highlight: true }, 
            ].map((item, i) => ( 
              <Grid2 size={{ xs: 6 }} key={i}> 
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}> 
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: isDark ? '#161F33' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.highlight ? '#EAB308' : '#94A3B8' }}>{item.icon}</Box> 
                  <Box> 
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', fontSize: '9px' }}>{item.label}</Typography> 
                    <Typography sx={{ fontWeight: 800, fontSize: '13px', color: item.highlight ? '#EAB308' : 'inherit' }}>{item.value}</Typography> 
                  </Box> 
                </Stack> 
              </Grid2> 
            ))}
          </Grid2>

          <Collapse in={isCompleting}>
            <Box sx={{ mt: 2, p: 3, borderRadius: '24px', bgcolor: isDark ? '#050914' : alpha('#EAB308', 0.05), border: '1px solid', borderColor: alpha('#EAB308', 0.2) }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Sparkles size={20} color="#EAB308" />
                <Typography sx={{ fontWeight: 900, fontSize: '14px', letterSpacing: '0.05em' }}>Completion options</Typography>
              </Stack>
              
              <Grid2 container spacing={1.5}>
                {[
                  { key: 'print', label: 'Print Invoice', icon: <Printer size={18} /> },
                  { key: 'email', label: 'Send Email', icon: <Mail size={18} /> },
                  { key: 'sms', label: 'Send SMS', icon: <MessageSquare size={18} /> },
                  { key: 'whatsapp', label: 'WhatsApp', icon: <PhoneCall size={18} /> }
                ].map((item) => (
                  <Grid2 size={{ xs: 6 }} key={item.key}>
                    <Box 
                      onClick={() => !isSubmitting && handleToggleOption(item.key as keyof CompletionOptions)}
                      sx={{ 
                        p: 2, borderRadius: '14px', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 1.5,
                        border: '2.5px solid',
                        borderColor: options[item.key as keyof CompletionOptions] ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                        bgcolor: options[item.key as keyof CompletionOptions] ? alpha('#EAB308', 0.1) : (isDark ? '#161F33' : 'white'),
                        transition: 'all 0.2s ease',
                        opacity: isSubmitting ? 0.5 : 1,
                      }}
                    >
                      <Box sx={{ color: options[item.key as keyof CompletionOptions] ? '#EAB308' : '#94A3B8' }}>{item.icon}</Box>
                      <Typography sx={{ fontSize: '11px', fontWeight: 900 }}>{item.label}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
              
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleFinalize}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} /> : <CheckCircle2 size={18} />}
                sx={{ mt: 3, height: 50, bgcolor: '#EAB308', color: '#050914', fontWeight: 900, borderRadius: '12px', '&:hover': { bgcolor: '#D4A307' } }}
              >
                Complete appointment
              </Button>
            </Box>
          </Collapse>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 4, pt: 1, gap: 1.5, flexDirection: 'column' }}>
         {!isAlreadyCompleted && !isCompleting && onComplete && (
           <Button 
              fullWidth 
              variant="contained" 
              disabled={isSubmitting}
              onClick={() => setIsCompleting(true)}
              startIcon={<CheckCircle2 size={20} />}
              sx={{ borderRadius: '12px', fontWeight: 900, py: 1.8, bgcolor: isDark ? 'white' : '#0F172A', color: isDark ? '#050914' : 'white' }}
           >
             Complete Appointment
           </Button>
         )}
         
         {isAlreadyCompleted && (
           <Button 
             fullWidth 
             variant="contained" 
             disabled={isSubmitting}
             onClick={handleManualPrint}
             startIcon={<Printer size={20} />}
             sx={{ borderRadius: '12px', fontWeight: 900, py: 1.8, bgcolor: '#EAB308', color: '#050914', '&:hover': { bgcolor: '#D4A307' } }}
           >
             Print receipt
           </Button>
         )}
         
         {!isCompleting && (
           <>
             {!isAlreadyCompleted && (
               <Button fullWidth variant="outlined" disabled={isSubmitting} onClick={() => onEdit(selectedApt!)} sx={{ borderRadius: '12px', fontWeight: 900, py: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider' }}>Edit appointment</Button>
             )}
             <Button fullWidth variant="text" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18} /> : <ArrowLeft size={18} />} onClick={onBackToList} sx={{ borderRadius: '12px', fontWeight: 900, color: '#94A3B8' }}>Back to list</Button>
             <Button fullWidth variant="text" disabled={isSubmitting} color="error" onClick={() => onArchive(selectedApt!.id)} sx={{ borderRadius: '12px', fontWeight: 900 }}>Cancel appointment</Button>
           </>
         )}
         
         {isCompleting && (
           <Button fullWidth variant="text" disabled={isSubmitting} onClick={() => setIsCompleting(false)} sx={{ fontWeight: 900, color: '#94A3B8' }}>Cancel</Button>
         )}
      </DialogActions>

      <Dialog
        open={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            maxWidth: '95vw',
            maxHeight: '95vh',
          },
        }}
        sx={{ '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.85)' } }}
      >
        {previewImageUrl && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setPreviewImageUrl(null)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <X size={24} />
            </IconButton>
            <Box
              component="img"
              src={previewImageUrl}
              alt="Style reference full size"
              sx={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }}
            />
          </Box>
        )}
      </Dialog>
    </Dialog>
  );
};

export default AppointmentDetail;
