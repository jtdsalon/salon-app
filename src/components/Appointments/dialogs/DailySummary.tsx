import React from 'react';
import { 
  Dialog, Box, IconButton, Typography, DialogContent, Stack, Paper, Avatar 
} from '@mui/material';
import { X, ArrowRight } from 'lucide-react';
import { Appointment } from '../types';
import { formatTime12h } from '../utils';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
  category: string;
}

interface DailySummaryProps {
  open: boolean;
  onClose: () => void;
  viewDate: Date;
  dayAppointments: Appointment[];
  onAptClick: (apt: Appointment) => void;
  isDark: boolean;
  isMobile: boolean;
  services?: Service[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ 
  open, onClose, viewDate, dayAppointments, onAptClick, isDark, isMobile, services = []
}) => {
  const monthName = viewDate.toLocaleString('default', { month: 'short' }).toUpperCase();

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || 'Service';
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: isMobile ? '0' : '32px', bgcolor: isDark ? '#0B1224' : 'white' } }} fullScreen={isMobile}>
      <Box sx={{ bgcolor: isDark ? '#050914' : '#0F172A', p: 3, position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,0.4)' }}><X size={24} /></IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, mb: 0.2 }}>{monthName} {viewDate.getDate()}</Typography>
        <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}>Daily Summary • {dayAppointments.length} Rituals</Typography>
      </Box>
      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {dayAppointments.length > 0 ? dayAppointments.map(apt => (
            <Paper key={apt.id} onClick={() => onAptClick(apt)} elevation={0} sx={{ p: 2, borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`, bgcolor: isDark ? '#161F33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 36, height: 36, bgcolor: isDark ? '#050914' : '#F1F5F9', color: isDark ? '#EAB308' : '#94A3B8', fontWeight: 900 }}>{apt.customerName[0]}</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{apt.customerName}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8' }}>{formatTime12h(apt.time)} • <span style={{ color: '#EAB308' }}>{getServiceName(apt.serviceId)}</span></Typography>
                </Box>
              </Stack>
              <ArrowRight size={18} color="#CBD5E1" />
            </Paper>
          )) : <Typography align="center" sx={{ py: 4, fontWeight: 700, color: 'text.secondary' }}>Empty Vault.</Typography>}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DailySummary;
