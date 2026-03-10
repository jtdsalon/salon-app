import React from 'react';
import { Box, Typography, Paper, alpha } from '@mui/material';
import { Appointment } from '../types';
import { ALL_HOURS, SALON_OPEN_HOUR, SALON_CLOSE_HOUR } from '../utils';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
}

interface Staff {
  id: string;
  name: string;
  role?: string;
}

interface DayTimelineProps {
  viewDate: Date;
  dayAppointments: Appointment[];
  handleOpenModal: (apt?: Appointment, targetHour?: number) => void;
  setSelectedApt: (apt: Appointment) => void;
  setDetailOpen: (open: boolean) => void;
  isFocusMode: boolean;
  isMobile: boolean;
  isDark: boolean;
  services?: Service[];
  staff?: Staff[];
}

const DayTimeline: React.FC<DayTimelineProps> = ({
  viewDate,
  dayAppointments,
  handleOpenModal,
  setSelectedApt,
  setDetailOpen,
  isFocusMode,
  isMobile,
  isDark,
  services = [],
  staff = []
}) => {
  const now = new Date();
  const isToday = viewDate.toDateString() === now.toDateString();
  const dailyApptHours = dayAppointments
    .map((a) => (a.time ? parseInt(a.time.split(':')[0], 10) : NaN))
    .filter((h) => Number.isFinite(h) && h >= 0 && h <= 23);
  const startHour =
    dailyApptHours.length > 0 ? Math.min(SALON_OPEN_HOUR, ...dailyApptHours) : SALON_OPEN_HOUR;
  const endHour =
    dailyApptHours.length > 0 ? Math.max(SALON_CLOSE_HOUR, ...dailyApptHours) : SALON_CLOSE_HOUR;
  const safeStart = Number.isFinite(startHour) ? Math.max(0, Math.min(23, startHour)) : SALON_OPEN_HOUR;
  const safeEnd = Number.isFinite(endHour) ? Math.max(0, Math.min(23, endHour)) : SALON_CLOSE_HOUR;
  const visibleHourIndices = Array.from(
    { length: Math.max(0, safeEnd - safeStart + 1) },
    (_, i) => safeStart + i
  );

  const getServiceName = (apt: Appointment) => {
    const serviceId = apt.serviceId || apt.serviceIds?.[0];
    if (!serviceId) return 'Service';
    return services.find(s => s.id === serviceId)?.name || 'Service';
  };

  const getStaffName = (staffId: string) => {
    if (!staffId || staffId === 'anyone') return 'Any Artisan';
    return staff.find(s => s.id === staffId)?.name || 'Artisan';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isFocusMode ? 0 : '16px',
        border: isFocusMode ? 'none' : '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'divider',
        overflow: 'hidden',
        bgcolor: isDark ? '#0B1224' : 'white',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ height: isFocusMode ? 'calc(100vh - 180px)' : (isMobile ? 'calc(100vh - 250px)' : 'calc(100vh - 280px)'), overflowY: 'auto' }}>
        {visibleHourIndices.map((hourIdx) => {
          const hourApts = dayAppointments.filter(apt => parseInt(apt.time.split(':')[0]) === hourIdx);
          const isCurrentHour = isToday && hourIdx === now.getHours();
          return (
            <Box
              key={hourIdx}
              sx={{
                display: 'flex',
                minHeight: isFocusMode ? 140 : (isMobile ? 80 : 100),
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`,
                bgcolor: isCurrentHour ? (isDark ? alpha('#EAB308', 0.05) : alpha('#B59410', 0.03)) : 'transparent'
              }}
            >
              <Box
                sx={{
                  width: { xs: 60, md: 80 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pt: 2,
                  borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`,
                  bgcolor: isCurrentHour ? (isDark ? alpha('#EAB308', 0.08) : alpha('#B59410', 0.05)) : (isDark ? '#050914' : '#F8FAFC')
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '9px', md: '10px' },
                    color: isCurrentHour ? '#EAB308' : (isDark ? '#64748B' : '#94A3B8')
                  }}
                >
                  {ALL_HOURS[hourIdx]}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 1,
                  display: 'flex',
                  flexDirection: isFocusMode ? 'row' : 'column',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                {hourApts.map(apt => (
                  <Box
                    key={apt.id}
                    onClick={() => { setSelectedApt(apt); setDetailOpen(true); }}
                    sx={{
                      bgcolor: isDark ? '#161F33' : '#0F172A',
                      borderRadius: '12px',
                      p: isMobile ? 1.5 : 2,
                      px: 2,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${apt.status === 'pending' ? '#F59E0B' : '#EAB308'}`,
                      minWidth: isFocusMode ? 320 : (isMobile ? '100%' : 'auto'),
                      boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.4)' : '0 4px 15px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: isDark ? '#1E293B' : '#1E293B'
                      }
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '8px', fontWeight: 900, color: '#EAB308', textTransform: 'uppercase', mb: 0.2 }}>
                        {getServiceName(apt).toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: isMobile ? '12px' : '14px' }}>
                        {apt.customerName}
                      </Typography>
                    </Box>
                    {!isMobile && (
                      <Typography sx={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
                        {getStaffName(apt.staffId)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default DayTimeline;
