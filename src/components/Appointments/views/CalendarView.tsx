
import React from 'react';
import { Box, Typography, Stack, alpha } from '@mui/material';
import { Appointment } from '../types';
import { WEEKDAYS } from '../utils';

interface CalendarViewProps {
  viewDate: Date;
  appointments: Appointment[];
  handleDayClick: (day: number) => void;
  isFocusMode: boolean;
  isDark: boolean;
  isMobile: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  viewDate, 
  appointments, 
  handleDayClick, 
  isFocusMode, 
  isDark, 
  isMobile 
}) => {
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const totalCells = startDay + daysInMonth > 35 ? 42 : 35;

  return (
    <Box sx={{ width: '100%', px: isFocusMode ? 2 : (isMobile ? 0 : 1), flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: isMobile ? 1.5 : 3 }}>
        {WEEKDAYS.map((day, i) => (
          <Typography key={i} align="center" sx={{ fontSize: { xs: '10px', md: '11px' }, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em' }}>
            {day}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? 0.5 : 2.5, flexGrow: 1, minHeight: 0 }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i + 1 - startDay;
          const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
          const dayStr = isCurrentMonth ? dayNum.toString().padStart(2, '0') : '';
          
          const targetDateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const ritualsForThisDay = appointments.filter(a => a.date === targetDateStr);
          const isToday = isCurrentMonth && dayNum === new Date().getDate() && viewDate.getMonth() === new Date().getMonth(); 
          const isFocused = isCurrentMonth && dayNum === viewDate.getDate();

          return (
            <Box 
              key={i} 
              onClick={() => isCurrentMonth && handleDayClick(dayNum)}
              sx={{ 
                height: isFocusMode ? 'auto' : { xs: 60, sm: 100, lg: 160 }, 
                bgcolor: isCurrentMonth ? (isDark ? '#0B1224' : 'white') : 'transparent', 
                borderRadius: isMobile ? '8px' : '32px',
                p: isMobile ? 0.8 : 2.5,
                position: 'relative',
                border: isCurrentMonth ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isCurrentMonth ? 'pointer' : 'default',
                ...(isToday && {
                  boxShadow: isMobile ? 'none' : '0 20px 40px -12px rgba(181, 148, 16, 0.1)',
                  border: '1px solid #EAB308',
                  bgcolor: isDark ? alpha('#EAB308', 0.1) : '#FEFDF0'
                }),
                ...(isFocused && !isToday && {
                  border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0',
                }),
                '&:hover': {
                  bgcolor: isCurrentMonth ? (isDark ? '#161F33' : alpha('#FFFFFF', 0.8)) : 'transparent',
                  zIndex: 2
                }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography sx={{ 
                  fontSize: { xs: '11px', md: '14px' }, 
                  fontWeight: 900, 
                  color: isCurrentMonth ? (isDark ? '#64748B' : '#94A3B8') : 'transparent',
                  ...(isToday && { color: '#B59410' })
                }}>
                  {dayStr}
                </Typography>
                
                {isCurrentMonth && ritualsForThisDay.length > 0 && (
                  <Box sx={{ 
                    width: { xs: 5, md: 6 }, 
                    height: { xs: 5, md: 6 }, 
                    borderRadius: '50%', 
                    bgcolor: ritualsForThisDay.length > 1 ? '#EAB308' : (isDark ? 'white' : '#0F172A') 
                  }} />
                )}
              </Stack>

              {isCurrentMonth && ritualsForThisDay.length > 0 && !isMobile && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.2,
                    py: 0.5,
                    borderRadius: '8px',
                    bgcolor: ritualsForThisDay.length > 1 ? (isDark ? '#EAB308' : '#0F172A') : (isDark ? alpha('#FFFFFF', 0.05) : '#F1F5F9'),
                    color: ritualsForThisDay.length > 1 ? (isDark ? '#050914' : 'white') : (isDark ? '#94A3B8' : '#64748B'),
                  }}>
                    <Typography sx={{ 
                      fontSize: '9px', 
                      fontWeight: 900, 
                      textTransform: 'uppercase'
                    }}>
                      {ritualsForThisDay.length} {ritualsForThisDay.length === 1 ? 'appointment' : 'appointments'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarView;
