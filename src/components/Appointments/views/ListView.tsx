import React from 'react';
import {
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Stack, IconButton, alpha, Box, useTheme, useMediaQuery
} from '@mui/material';
import { Eye } from 'lucide-react';
import { Appointment } from '../types';
import { formatTime12h } from '../utils';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
}

interface ListViewProps {
  listFilteredAppointments: Appointment[];
  setSelectedApt: (apt: Appointment) => void;
  setDetailOpen: (open: boolean) => void;
  isFocusMode: boolean;
  isDark: boolean;
  services?: Service[];
}

const ListView: React.FC<ListViewProps> = ({
  listFilteredAppointments,
  setSelectedApt,
  setDetailOpen,
  isFocusMode,
  isDark,
  services = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getServiceName = (apt: Appointment) => {
    const serviceId = apt.serviceId || apt.serviceIds?.[0];
    if (!serviceId) return 'Unknown Service';
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Service';
  };

  const containerSx = {
    borderRadius: isFocusMode ? 0 : '24px',
    border: isFocusMode ? 'none' : '1px solid',
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : alpha('#000', 0.05),
    overflow: 'auto',
    bgcolor: isDark ? '#0B1224' : 'white',
    flexGrow: 1,
    height: isFocusMode ? 'calc(100vh - 180px)' : 'auto',
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, ...containerSx, p: 2 }}>
        {listFilteredAppointments.length > 0 ? (
          listFilteredAppointments.map((apt) => (
            <Paper
              key={apt.id}
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : alpha('#000', 0.06),
                p: 2,
                '&:hover': { bgcolor: isDark ? alpha('#FFFFFF', 0.02) : alpha('#F1F5F9', 0.4) },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>{apt.customerName}</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '12px', color: '#94A3B8', mt: 0.5 }}>{getServiceName(apt)}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '12px' }}>{apt.date}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#94A3B8' }}>{formatTime12h(apt.time)}</Typography>
                  </Stack>
                </Box>
                <IconButton size="small" onClick={() => { setSelectedApt(apt); setDetailOpen(true); }} sx={{ color: '#EAB308' }} aria-label="View"><Eye size={18} /></IconButton>
              </Stack>
            </Paper>
          ))
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>No appointments found.</Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={containerSx}>
      <Table stickyHeader sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2, pl: { xs: 2, md: 4 } }}>Customer</TableCell>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2 }}>Service</TableCell>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2 }}>Schedule</TableCell>
            <TableCell align="right" sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', pr: { xs: 2, md: 4 }, py: 2 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listFilteredAppointments.length > 0 ? listFilteredAppointments.map((apt) => (
            <TableRow key={apt.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: isDark ? alpha('#FFFFFF', 0.02) : alpha('#F1F5F9', 0.4) } }}>
              <TableCell sx={{ py: 2, pl: { xs: 2, md: 4 } }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>{apt.customerName}</Typography>
                </Box>
              </TableCell>
              <TableCell><Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#94A3B8' }}>{getServiceName(apt)}</Typography></TableCell>
              <TableCell>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>{apt.date}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '10px', color: '#94A3B8' }}>{formatTime12h(apt.time)}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ pr: { xs: 2, md: 4 } }}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <IconButton size="small" onClick={() => { setSelectedApt(apt); setDetailOpen(true); }} sx={{ color: '#EAB308' }}><Eye size={18} /></IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><Typography color="text.secondary" sx={{ fontWeight: 600 }}>No appointments found.</Typography></TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;