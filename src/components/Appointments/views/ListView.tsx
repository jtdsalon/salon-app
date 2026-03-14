import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  IconButton,
  alpha,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Eye, CalendarClock, Sun, CalendarDays } from 'lucide-react';
import { Appointment } from '../types';
import { formatTime12h } from '../utils';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
}

interface ListViewProps {
  listPast: Appointment[];
  listToday: Appointment[];
  listUpcoming: Appointment[];
  setSelectedApt: (apt: Appointment) => void;
  setDetailOpen: (open: boolean) => void;
  isFocusMode: boolean;
  isDark: boolean;
  services?: Service[];
}

const sectionConfig = [
  { key: 'past' as const, label: 'Past', icon: CalendarClock, emptyMessage: 'No past appointments.' },
  { key: 'today' as const, label: 'Today', icon: Sun, emptyMessage: 'No appointments today.' },
  { key: 'upcoming' as const, label: 'Upcoming', icon: CalendarDays, emptyMessage: 'No upcoming appointments.' },
];

const ListView: React.FC<ListViewProps> = ({
  listPast,
  listToday,
  listUpcoming,
  setSelectedApt,
  setDetailOpen,
  isFocusMode,
  isDark,
  services = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getServiceName = (apt: Appointment) => {
    const serviceId = apt.serviceId || apt.serviceIds?.[0];
    if (!serviceId) return 'Unknown Service';
    const service = services.find((s) => s.id === serviceId);
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

  const cardSx = {
    borderRadius: '16px',
    border: '1px solid',
    borderColor: isDark ? 'rgba(255,255,255,0.06)' : alpha('#000', 0.06),
    p: 2,
    '&:hover': { bgcolor: isDark ? alpha('#FFFFFF', 0.02) : alpha('#F1F5F9', 0.4) },
  };

  const renderAppointmentCard = (apt: Appointment) => (
    <Paper key={apt.id} elevation={0} sx={cardSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: '14px' }}>{apt.customerName}</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '12px', color: '#94A3B8', mt: 0.5 }}>
            {getServiceName(apt)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '12px' }}>{apt.date}</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#94A3B8' }}>
              {formatTime12h(apt.time)}
            </Typography>
          </Stack>
        </Box>
        <IconButton
          size="small"
          onClick={() => {
            setSelectedApt(apt);
            setDetailOpen(true);
          }}
          sx={{ color: '#EAB308' }}
          aria-label="View"
        >
          <Eye size={18} />
        </IconButton>
      </Stack>
    </Paper>
  );

  const sections: { list: Appointment[]; label: string; icon: typeof CalendarClock; emptyMessage: string }[] = [
    { list: listPast, ...sectionConfig[0] },
    { list: listToday, ...sectionConfig[1] },
    { list: listUpcoming, ...sectionConfig[2] },
  ];

  const totalCount = listPast.length + listToday.length + listUpcoming.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, ...containerSx, p: 2 }}>
      {totalCount === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            No appointments found.
          </Typography>
        </Box>
      ) : (
        sections.map(({ list, label, icon: Icon, emptyMessage }) => (
          <Box key={label}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Icon size={18} style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'text.secondary',
                }}
              >
                {label} {list.length > 0 && `(${list.length})`}
              </Typography>
            </Stack>
            {list.length > 0 ? (
              <Stack direction="column" spacing={1.5}>
                {list.map((apt) => renderAppointmentCard(apt))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, py: 1 }}>
                {emptyMessage}
              </Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ListView;
