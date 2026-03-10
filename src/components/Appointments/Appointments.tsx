import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Maximize2,
  Minimize2,
  Plus,
  LayoutGrid,
  LayoutList,
  Calendar as CalendarIcon,
  Hash,
  Clock,
} from 'lucide-react';

import CalendarView from './views/CalendarView';
import DayTimeline from './views/DayTimeline';
import ListView from './views/ListView';
import AppointmentForm from './dialogs/AppointmentForm';
import AppointmentDetail from './dialogs/AppointmentDetail';
import DailySummary from './dialogs/DailySummary';
import { useAppointmentsAction } from './hooks/useAppointmentsAction';

interface AppointmentsProps {
  appointments?: import('./types').Appointment[];
  setAppointments?: React.Dispatch<React.SetStateAction<import('./types').Appointment[]>>;
  isFocusMode?: boolean;
  setIsFocusMode?: (focused: boolean) => void;
  initialRescheduleApt?: import('./types').Appointment | null;
  clearReschedule?: () => void;
  salonId?: string;
  /** When set (e.g. from notification click), open this booking's detail once loaded */
  openBookingId?: string | null;
}

const Appointments: React.FC<AppointmentsProps> = (props) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const action = useAppointmentsAction({ ...props, openBookingId: props.openBookingId ?? undefined });

  const {
    appointments,
    viewType,
    setViewType,
    viewDate,
    setViewDate,
    timeRange,
    setTimeRange,
    viewDateStr,
    dayAppointments,
    listFilteredAppointments,
    currentRitualCount,
    currentSalonId,
    services,
    staff,
    isModalOpen,
    setIsModalOpen,
    editingApt,
    detailOpen,
    setDetailOpen,
    summaryOpen,
    setSummaryOpen,
    selectedApt,
    setSelectedApt,
    isLoading,
    isSubmitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    toggleFullscreen,
    handleOpenModal,
    handlePrev,
    handleNext,
    handleRefresh,
    handleSaveAppointment,
    handleArchive,
    handleCompleteAppointment,
  } = action;

  return (
    <Box
      sx={{
        pb: action.isFocusMode ? 0 : { xs: 4, md: 6 },
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: action.isFocusMode ? 'background.default' : 'transparent',
        height: action.isFocusMode ? '100vh' : 'auto',
        p: action.isFocusMode ? { xs: 2, md: 4 } : 0,
        overflow: action.isFocusMode ? 'hidden' : 'visible',
      }}
    >
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {!action.isFocusMode && (
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.5rem' }, color: isDark ? 'white' : '#0F172A' }}
            >
              Appointment <span style={{ color: '#EAB308' }}>Center</span>
            </Typography>
            <Chip
              icon={<Hash size={14} />}
              label={appointments.length}
              variant="outlined"
              sx={{ fontWeight: 800, borderRadius: '12px', borderColor: alpha('#EAB308', 0.3), color: '#EAB308' }}
            />
          </Stack>
        </Box>
      )}

      {action.isFocusMode && (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, px: 2 }}>
          <Box sx={{ p: 1, bgcolor: '#0F172A', borderRadius: '10px' }}>
            <CalendarIcon size={18} color="#EAB308" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, display: { xs: 'none', sm: 'block' } }}>
            Immersion Mode
          </Typography>
          <Chip
            label={`${currentRitualCount} In View`}
            size="small"
            sx={{ bgcolor: alpha('#EAB308', 0.1), color: '#EAB308', fontWeight: 900, fontSize: '10px' }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            color="error"
            onClick={toggleFullscreen}
            startIcon={<Minimize2 size={16} />}
            sx={{ borderRadius: '10px', height: 40, px: 2 }}
          >
            Exit immersion
          </Button>
        </Stack>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
        sx={{
          mb: action.isFocusMode ? 3 : 4,
          p: action.isFocusMode ? 2 : isMobile ? 1.5 : 0,
          bgcolor:
            action.isFocusMode || isMobile ? (isDark ? alpha('#FFFFFF', 0.03) : alpha('#000000', 0.02)) : 'transparent',
          borderRadius: '20px',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                borderRadius: '12px',
                height: 44,
                px: 1,
                bgcolor: isDark ? '#0B1224' : 'white',
                flexGrow: 1,
              }}
            >
              <IconButton size="small" onClick={handlePrev} sx={{ color: isDark ? '#94A3B8' : '#0F172A' }}>
                <ChevronLeft size={16} />
              </IconButton>
              <Typography
                sx={{
                  px: 1,
                  fontWeight: 900,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  minWidth: { xs: 100, sm: 140 },
                  textAlign: 'center',
                }}
              >
                {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
              </Typography>
              <IconButton size="small" onClick={handleNext} sx={{ color: isDark ? '#94A3B8' : '#0F172A' }}>
                <ChevronRight size={16} />
              </IconButton>
            </Paper>
            <Button
              variant="outlined"
              startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshCcw size={16} />}
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{
                borderRadius: '12px',
                height: 44,
                px: 2,
                fontWeight: 900,
                fontSize: '11px',
                color: isDark ? 'white' : '#0F172A',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              }}
            >
              Today
            </Button>
          </Stack>

          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, v) => v && setTimeRange(v)}
            sx={{
              height: 44,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              borderRadius: '12px',
              p: '4px',
              bgcolor: isDark ? '#050914' : '#F8FAFC',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                flexGrow: 1,
                fontWeight: 900,
                fontSize: '9px',
                color: '#94A3B8',
                '&.Mui-selected': {
                  bgcolor: '#EAB308',
                  color: isDark ? '#050914' : 'white',
                  '&:hover': { bgcolor: '#EAB308' },
                },
              },
            }}
          >
            <ToggleButton value="past">PAST</ToggleButton>
            <ToggleButton value="today">TODAY</ToggleButton>
            <ToggleButton value="upcoming">UPCOMING</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(_, v) => v && setViewType(v)}
            sx={{
              height: 44,
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              borderRadius: '12px',
              p: '4px',
              bgcolor: isDark ? '#050914' : '#F8FAFC',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                width: 44,
                height: 36,
                p: 0,
                color: '#94A3B8',
                '&.Mui-selected': {
                  bgcolor: isDark ? '#161F33' : 'white',
                  color: isDark ? 'white' : '#0F172A',
                  '&:hover': { bgcolor: isDark ? '#1E293B' : '#FFFFFF' },
                },
              },
            }}
          >
            <ToggleButton value="list">
              <LayoutList size={16} />
            </ToggleButton>
            <ToggleButton value="time">
              <Clock size={16} />
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarIcon size={16} />
            </ToggleButton>
          </ToggleButtonGroup>

          <IconButton
            onClick={toggleFullscreen}
            sx={{
              width: 44,
              height: 44,
              border: `1px solid ${action.isFocusMode ? '#EAB308' : isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9'}`,
              borderRadius: '12px',
              color: action.isFocusMode ? '#EAB308' : 'text.secondary',
              bgcolor: action.isFocusMode ? alpha('#EAB308', 0.1) : 'transparent',
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            {action.isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </IconButton>

          <Button
            variant="contained"
            disableElevation
            onClick={() => handleOpenModal()}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} /> : <Plus size={18} />}
            sx={{
              borderRadius: '12px',
              bgcolor: isDark ? 'white' : '#0F172A',
              color: isDark ? '#050914' : 'white',
              px: 2,
              height: 44,
              fontWeight: 900,
              fontSize: '11px',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Book
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isLoading && <CircularProgress sx={{ m: 'auto' }} />}
        {!isLoading && (
          <>
            {viewType === 'time' && (
              <DayTimeline
                viewDate={viewDate}
                dayAppointments={dayAppointments}
                handleOpenModal={handleOpenModal}
                setSelectedApt={setSelectedApt}
                setDetailOpen={setDetailOpen}
                isFocusMode={action.isFocusMode}
                isMobile={isMobile}
                isDark={isDark}
                services={services}
                staff={staff}
              />
            )}
            {viewType === 'calendar' && (
              <CalendarView
                viewDate={viewDate}
                appointments={appointments}
                handleDayClick={(day) => {
                  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                  setSummaryOpen(true);
                }}
                isFocusMode={action.isFocusMode}
                isDark={isDark}
                isMobile={isMobile}
              />
            )}
            {viewType === 'list' && (
              <ListView
                listFilteredAppointments={listFilteredAppointments}
                setSelectedApt={setSelectedApt}
                setDetailOpen={setDetailOpen}
                isFocusMode={action.isFocusMode}
                isDark={isDark}
                services={services}
              />
            )}
          </>
        )}
      </Box>

      <AppointmentForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingApt={editingApt}
        onSave={handleSaveAppointment}
        isDark={isDark}
        isMobile={isMobile}
        isSubmitting={isSubmitting}
        services={services}
        staff={staff}
        initialData={
          editingApt
            ? {
                customerName: editingApt.customerName,
                serviceId: editingApt.serviceId ?? editingApt.serviceIds?.[0] ?? services[0]?.id ?? '',
                staffId: editingApt.staffId,
                date: editingApt.date,
                time: editingApt.time,
                notes: '',
              }
            : {
                customerName: '',
                serviceId: services[0]?.id ?? '',
                staffId: '',
                date: viewDateStr,
                time: '10:00',
                notes: '',
              }
        }
      />
      <AppointmentDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        selectedApt={selectedApt}
        onEdit={(apt) => {
          setSelectedApt(apt);
          setDetailOpen(false);
          setIsModalOpen(true);
        }}
        onArchive={handleArchive}
        onComplete={handleCompleteAppointment}
        onBackToList={() => {
          setDetailOpen(false);
          setSummaryOpen(true);
        }}
        isDark={isDark}
        isMobile={isMobile}
        isSubmitting={isSubmitting}
        services={services}
        staff={staff}
      />
      <DailySummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        viewDate={viewDate}
        dayAppointments={dayAppointments}
        onAptClick={(apt) => {
          setSelectedApt(apt);
          setSummaryOpen(false);
          setDetailOpen(true);
        }}
        isDark={isDark}
        isMobile={isMobile}
        services={services}
      />
    </Box>
  );
};

export default Appointments;
