import { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Appointment } from '../types';
import { useService } from '@/state/service';
import { useStaff } from '@/state/staff';
import type { RootState } from '@/state/store';
import { useAppointment } from '@/state/appointment/useAppointment';
import type { BookingStatus } from '@/state/appointment/types';

export interface UseAppointmentsActionProps {
  appointments?: Appointment[];
  setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>;
  isFocusMode?: boolean;
  setIsFocusMode?: (focused: boolean) => void;
  initialRescheduleApt?: Appointment | null;
  clearReschedule?: () => void;
  salonId?: string;
  /** When set (e.g. from notification), open this booking's detail once appointments are loaded */
  openBookingId?: string;
}

export function useAppointmentsAction({
  appointments: externalAppointments,
  setAppointments: externalSetAppointments,
  isFocusMode = false,
  setIsFocusMode = () => {},
  initialRescheduleApt,
  clearReschedule,
  salonId,
  openBookingId,
}: UseAppointmentsActionProps) {
  const {
    salonAppointments: salonAppointmentState,
    appointments: customerAppointmentState,
    loading: appointmentLoading,
    creating,
    updating,
    cancelling,
    error: appointmentError,
    successMessage: appointmentSuccessMessage,
    fetchAppointments,
    fetchSalonAppointments,
    fetchSalonAppointmentsList,
    bookAppointment,
    changeAppointmentStatus,
    cancelUserAppointment,
    clearError: clearAppointmentError,
    clearSuccess: clearAppointmentSuccess,
  } = useAppointment();

  const [viewType, setViewType] = useState<'list' | 'time' | 'calendar'>('calendar');
  const [viewDate, setViewDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState<'past' | 'today' | 'upcoming'>('upcoming');

  const salon = useSelector((state: RootState) => state.salon.salon);
  const currentSalonId = salonId || salon?.id || null;

  const {
    serviceList: services,
    loading: servicesLoading,
    handleGetServices,
  } = useService();

  const {
    staffList: staff,
    loading: staffLoading,
    handleGetStaff,
  } = useStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const openBookingIdHandled = useRef(false);

  const normalizeError = (err: any): string | null => {
    if (!err) return null;
    if (typeof err === 'string') return err;
    if (typeof err.errorMessage === 'string') return err.errorMessage;
    if (typeof err.message === 'string') return err.message;
    if (typeof err.statusCode !== 'undefined') {
      try {
        return JSON.stringify({ statusCode: err.statusCode, errorMessage: err.errorMessage || err.message || '' });
      } catch {
        return 'An unexpected error occurred';
      }
    }
    try {
      return JSON.stringify(err);
    } catch {
      return 'An unexpected error occurred';
    }
  };

  const isLoading = appointmentLoading;
  const isSubmitting = creating || updating || cancelling;
  const error = normalizeError(appointmentError);
  const successMessage = appointmentSuccessMessage || null;

  const mapApiAppointmentToUi = (apt: any): Appointment => {
    let bookingDate = '';
    if (apt.booking_date) {
      const d = apt.booking_date;
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) {
        bookingDate = d.slice(0, 10);
      } else {
        try {
          bookingDate = new Date(d).toISOString().split('T')[0];
        } catch {
          bookingDate = '';
        }
      }
    }

    let startTime = '';
    if (apt.start_time) {
      if (typeof apt.start_time === 'string' && apt.start_time.includes('T')) {
        const timePart = new Date(apt.start_time);
        startTime = `${String(timePart.getUTCHours()).padStart(2, '0')}:${String(timePart.getUTCMinutes()).padStart(
          2,
          '0'
        )}`;
      } else if (typeof apt.start_time === 'string' && /^\d{1,2}:\d{2}/.test(apt.start_time)) {
        startTime = apt.start_time.length >= 5 ? apt.start_time.slice(0, 5) : apt.start_time;
      } else {
        try {
          const t = new Date(apt.start_time);
          startTime = `${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
        } catch {
          startTime = '09:00';
        }
      }
    }
    if (!startTime) startTime = '09:00';

    const styleUrls = Array.isArray(apt.style_image_urls)
      ? apt.style_image_urls
      : (() => {
          try {
            const n = apt.notes;
            if (typeof n !== 'string') return [];
            const p = JSON.parse(n);
            return Array.isArray(p?.style_image_urls) ? p.style_image_urls : [];
          } catch {
            return [];
          }
        })();

    const displayName = (apt as any).customer_name
      || (apt.user ? `${apt.user.first_name || ''} ${apt.user.last_name || ''}`.trim() : '')
      || apt.salon?.name
      || 'Customer';
    return {
      id: apt.id,
      customerId: apt.user_id || '',
      customerName: displayName,
      serviceId: apt.service_id,
      serviceIds: apt.booking_services?.map((bs: any) => bs.service_id) || (apt.service_id ? [apt.service_id] : []),
      staffId: apt.staff_id || '',
      date: bookingDate,
      time: startTime,
      status: (apt.status || 'pending').toLowerCase() as any,
      styleImageUrls: styleUrls,
    };
  };

  const rawAppointments = currentSalonId ? salonAppointmentState : customerAppointmentState;

  const derivedAppointments = useMemo(() => {
    if (!rawAppointments || rawAppointments.length === 0) return [];
    return rawAppointments.map((apt: any) => mapApiAppointmentToUi(apt));
  }, [rawAppointments]);

  const appointments = externalAppointments ?? derivedAppointments;
  const setAppointments = externalSetAppointments ?? (() => {});

  const loadAppointments = () => {
    if (currentSalonId) {
      fetchSalonAppointmentsList(currentSalonId, { page: 1, limit: 100 });
    } else {
      fetchAppointments({ page: 1, limit: 100 });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFocusMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFocusMode(false);
      }
    }
  };

  const viewDateStr = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const day = String(viewDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [viewDate]);

  const navigationLabel = viewDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase();

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.date === viewDateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, viewDateStr]);

  const listFilteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        if (timeRange === 'today') return apt.date === viewDateStr;
        if (timeRange === 'past') return apt.date < viewDateStr;
        if (timeRange === 'upcoming') return apt.date > viewDateStr;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [appointments, timeRange, viewDateStr]);

  const currentRitualCount =
    viewType === 'calendar' ? appointments.length : viewType === 'time' ? dayAppointments.length : listFilteredAppointments.length;

  const handleOpenModal = (apt?: Appointment, _targetHour?: number) => {
    setEditingApt(apt || null);
    setIsModalOpen(true);
  };

  const handlePrev = () => {
    const newDate = new Date(viewDate);
    if (viewType === 'calendar') {
      newDate.setMonth(viewDate.getMonth() - 1);
      newDate.setDate(1);
    } else {
      newDate.setDate(viewDate.getDate() - 1);
    }
    setViewDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(viewDate);
    if (viewType === 'calendar') {
      newDate.setMonth(viewDate.getMonth() + 1);
      newDate.setDate(1);
    } else {
      newDate.setDate(viewDate.getDate() + 1);
    }
    setViewDate(newDate);
  };

  const handleGoToToday = () => {
    const today = new Date(2026, 1, 10);
    setTimeRange('today');
    setViewDate(today);
  };

  const handleSaveAppointment = async (formData: any) => {
    try {
      if (!currentSalonId) {
        throw new Error('Salon ID is missing');
      }

      const serviceIds = formData.serviceIds || (formData.serviceId ? [formData.serviceId] : []);
      if (serviceIds.length === 0) {
        throw new Error('Please select at least one service');
      }

      const selectedServices =
        formData.services || serviceIds.map((id: string) => services.find((s) => s.id === id)).filter(Boolean);
      const totalDuration =
        formData.totalDuration || selectedServices.reduce((sum: number, s: any) => sum + (s?.duration_minutes || 0), 0) || 60;

      const startTime = formData.time;

      const [hours, minutes] = startTime.split(':').map(Number);
      const endMinutes = minutes + totalDuration;
      const endHours = hours + Math.floor(endMinutes / 60);
      const endTime = `${String(endHours % 24).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

      const payload: any = {
        salon_id: currentSalonId,
        service_id: serviceIds[0],
        service_ids: serviceIds,
        services: selectedServices.map((s: any) => ({
          id: s.id,
          price: s.price,
          duration_minutes: s.duration_minutes,
        })),
        booking_date: formData.date,
        start_time: startTime,
        end_time: endTime,
        notes: formData.notes?.trim() || 'No special notes',
      };

      if (formData.staffId) {
        payload.staff_id = formData.staffId;
      }

      if (formData.customerId) {
        payload.user_id = formData.customerId;
      } else if (formData.customerName?.trim()) {
        payload.customer_name = formData.customerName.trim();
      }

      if (editingApt) {
        changeAppointmentStatus(editingApt.id, 'CONFIRMED' as BookingStatus);
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === editingApt.id ? { ...apt, ...formData, status: 'confirmed' } : apt))
        );
      } else {
        bookAppointment(payload as any);
        if (currentSalonId) {
          setTimeout(() => loadAppointments(), 600);
        }
      }

      setIsModalOpen(false);
      setEditingApt(null);
    } catch (err: any) {
      const errorMsg = err.errorMessage || err.message || 'Failed to save appointment';
      console.error('Save appointment error:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      cancelUserAppointment(id, 'Appointment cancelled by user');
      setDetailOpen(false);
    } catch (err: any) {
      const errorMsg = err.errorMessage || err.message || 'Failed to cancel appointment';
      console.error('Cancel appointment error:', err);
    }
  };

  const handleCompleteAppointment = async (
    id: string,
    options: { print: boolean; email: boolean; sms: boolean; whatsapp: boolean }
  ) => {
    try {
      changeAppointmentStatus(id, 'COMPLETED' as BookingStatus);

      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      setDetailOpen(false);
      setSelectedApt(null);

      const channels = [];
      if (options.print) channels.push('printed');
      if (options.email) channels.push('emailed');
      if (options.sms) channels.push('SMS sent');
      if (options.whatsapp) channels.push('WhatsApp sent');
    } catch (err: any) {
      const errorMsg = err.errorMessage || err.message || 'Failed to complete appointment';
      console.error('Complete appointment error:', err);
    }
  };

  const handleRefresh = async () => {
    await loadAppointments();
  };

  useEffect(() => {
    if (currentSalonId) {
      handleGetServices(currentSalonId);
      handleGetStaff(currentSalonId);
      loadAppointments();
    }
  }, [currentSalonId, handleGetServices, handleGetStaff]);

  useEffect(() => {
    if (initialRescheduleApt) {
      handleOpenModal(initialRescheduleApt);
      clearReschedule?.();
    }
  }, [initialRescheduleApt, clearReschedule]);

  // When navigated from a booking notification, open that booking's detail once loaded
  useEffect(() => {
    if (!openBookingId || openBookingIdHandled.current || !appointments?.length) return;
    const apt = appointments.find((a) => a.id === openBookingId);
    if (apt) {
      openBookingIdHandled.current = true;
      setSelectedApt(apt);
      setDetailOpen(true);
    }
  }, [openBookingId, appointments]);

  const setError = (value: string | null) => {
    if (value === null) {
      clearAppointmentError();
    }
  };

  const setSuccessMessage = (value: string | null) => {
    if (value === null) {
      clearAppointmentSuccess();
    }
  };

  return {
    // State
    isFocusMode,
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
    servicesLoading,
    staffLoading,

    // Dialog state
    isModalOpen,
    setIsModalOpen,
    editingApt,
    setEditingApt,
    detailOpen,
    setDetailOpen,
    summaryOpen,
    setSummaryOpen,
    selectedApt,
    setSelectedApt,

    // API state
    isLoading,
    isSubmitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,

    // Actions
    loadAppointments,
    toggleFullscreen,
    handleOpenModal,
    handlePrev,
    handleNext,
    handleGoToToday,
    handleSaveAppointment,
    handleArchive,
    handleCompleteAppointment,
    handleRefresh,
  };
}
