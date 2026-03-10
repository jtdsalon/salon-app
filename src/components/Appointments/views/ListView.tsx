import React from 'react';
import { 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, 
  Typography, Stack, IconButton, alpha, Box 
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
  const getServiceName = (apt: Appointment) => {
    // Support both single serviceId and multiple serviceIds
    const serviceId = apt.serviceId || apt.serviceIds?.[0];
    if (!serviceId) return 'Unknown Service';
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: isFocusMode ? 0 : '24px', border: isFocusMode ? 'none' : '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : alpha('#000', 0.05), overflow: 'auto', bgcolor: isDark ? '#0B1224' : 'white', flexGrow: 1, height: isFocusMode ? 'calc(100vh - 180px)' : 'auto' }}>
      <Table stickyHeader sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2, pl: { xs: 2, md: 4 } }}>PATRON</TableCell>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2, display: { xs: 'none', md: 'table-cell' } }}>RITUAL</TableCell>
            <TableCell sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', py: 2 }}>SCHEDULE</TableCell>
            <TableCell align="right" sx={{ bgcolor: isDark ? '#0B1224' : 'white', fontWeight: 900, color: '#94A3B8', fontSize: '10px', pr: { xs: 2, md: 4 }, py: 2 }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listFilteredAppointments.length > 0 ? listFilteredAppointments.map((apt) => (
            <TableRow key={apt.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: isDark ? alpha('#FFFFFF', 0.02) : alpha('#F1F5F9', 0.4) } }}>
              <TableCell sx={{ py: 2, pl: { xs: 2, md: 4 } }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>{apt.customerName}</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '11px', color: '#94A3B8', display: { xs: 'block', md: 'none' } }}>{getServiceName(apt)}</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#94A3B8' }}>{getServiceName(apt)}</Typography></TableCell>
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
            <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><Typography color="text.secondary" sx={{ fontWeight: 600 }}>No rituals found.</Typography></TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;