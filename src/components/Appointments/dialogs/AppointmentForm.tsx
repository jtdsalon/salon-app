import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog, Box, Stack, Typography, IconButton, DialogContent, Grid2,
  InputBase, Select, MenuItem, Paper, alpha, DialogActions, Button,
  Avatar, Checkbox, ListItemText, Chip, CircularProgress, FormHelperText,
  Autocomplete, TextField,
} from '@mui/material';
import { Sparkles, X, VolumeX, Coffee, Zap, User, Scissors, Check, Clock, CreditCard } from 'lucide-react';
import { Appointment } from '../types';
import { getSalonCustomersApi, type Customer } from '../../../services/api/customerService';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
  category: string;
}

interface Staff {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface AppointmentFormInitialData {
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceIds?: string[];
  staffId: string;
  date: string;
  time: string;
  notes?: string;
}

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  editingApt: Appointment | null;
  onSave: (data: any) => void;
  isDark: boolean;
  isMobile: boolean;
  isSubmitting?: boolean;
  services?: Service[];
  staff?: Staff[];
  salonId?: string;
  initialData: AppointmentFormInitialData;
}

// Generate the next 14 days for the Date Ribbon
const generateDateRibbon = () => {
  const dates = [];
  const start = new Date(); // Use current date
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push({
      full: d.toISOString().split('T')[0],
      day: d.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
      num: d.getDate()
    });
  }
  return dates;
};

// Available Time Slots grouped by period
const TIME_SLOTS = {
  MORNING: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  AFTERNOON: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  EVENING: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
};

const customerDisplayName = (c: Customer) =>
  [c.first_name, c.last_name].filter(Boolean).join(' ').trim() || c.email || 'Customer';

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open, onClose, editingApt, onSave, isDark, isMobile, isSubmitting = false,
  services = [], staff = [], salonId, initialData
}) => {
  const [formData, setFormData] = useState({
    ...initialData,
    serviceIds: initialData.serviceIds || (initialData.serviceId ? [initialData.serviceId] : []),
  });
  const [vibe, setVibe] = useState<'zen' | 'social' | 'consult'>('zen');
  const [dateTimeError, setDateTimeError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const dateRibbon = useMemo(() => generateDateRibbon(), []);

  const loadCustomers = useCallback(async () => {
    if (!salonId) return;
    setCustomersLoading(true);
    try {
      const res = await getSalonCustomersApi(salonId, { page: 1, limit: 200 });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setCustomers(Array.isArray(list) ? list : []);
    } catch {
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (open && salonId) loadCustomers();
  }, [open, salonId, loadCustomers]);

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialData,
        serviceIds: initialData.serviceIds || (initialData.serviceId ? [initialData.serviceId] : []),
      });
      setDateTimeError(null);
    }
  }, [open, initialData]);

  // Calculate total price for selected services
  const totalYield = useMemo(() => {
    if (!services || services.length === 0 || !formData.serviceIds) return 0;
    return formData.serviceIds.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (Number(service?.price) || 0);
    }, 0);
  }, [formData.serviceIds, services]);

  // Calculate total duration for selected services
  const totalDuration = useMemo(() => {
    if (!services || services.length === 0 || !formData.serviceIds) return 0;
    return formData.serviceIds.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.duration_minutes || 0);
    }, 0);
  }, [formData.serviceIds, services]);

  // Get selected services for saving
  const selectedServices = useMemo(() => {
    if (!services || services.length === 0 || !formData.serviceIds) return [];
    return services.filter(s => formData.serviceIds.includes(s.id));
  }, [formData.serviceIds, services]);

  // Validate date/time is not in the past
  const validateDateTime = (date: string, time: string): boolean => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const bookingDateTime = new Date(date);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    if (bookingDateTime < now) {
      setDateTimeError('Cannot book appointments in the past');
      return false;
    }
    setDateTimeError(null);
    return true;
  };

  const handleDateChange = (newDate: string) => {
    setFormData({ ...formData, date: newDate });
    validateDateTime(newDate, formData.time);
  };

  const handleTimeChange = (newTime: string) => {
    setFormData({ ...formData, time: newTime });
    validateDateTime(formData.date, newTime);
  };

  const handleSave = () => {
    if (!validateDateTime(formData.date, formData.time)) {
      return;
    }
    onSave({
      ...formData,
      serviceId: formData.serviceIds[0] || '',
      services: selectedServices,
      totalDuration,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? '0' : '40px',
          overflow: 'auto',
          bgcolor: isDark ? '#0B1224' : 'white',
          backgroundImage: 'none'
        }
      }}
    >
      <Box sx={{ bgcolor: isDark ? '#050914' : '#0F172A', pt: 4, pb: 6, px: 4, position: 'relative' }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box sx={{ width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles color="#EAB308" size={28} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              {editingApt ? 'Edit' : 'Book'} <span style={{ color: '#EAB308' }}>appointment</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Booking Details
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} disabled={isSubmitting} sx={{ position: 'absolute', top: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, color: 'rgba(255,255,255,0.4)' }}><X size={28} /></IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack spacing={4}>
              {/* Patron & Services Section */}
              <Box>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.15em' }}>Client & services</Typography>
                <Stack spacing={2.5}>
                  <Box sx={{ border: '1px solid transparent', borderRadius: '16px', '&:focus-within': { borderColor: '#EAB308' }, bgcolor: isDark ? '#161F33' : '#F8FAFC' }}>
                    <Autocomplete
                      freeSolo
                      options={customers}
                      getOptionLabel={(option) => typeof option === 'string' ? option : customerDisplayName(option)}
                      value={formData.customerId ? customers.find((c) => c.id === formData.customerId) ?? formData.customerName : formData.customerName}
                      onInputChange={(_, value) => {
                        setFormData((prev) => ({
                          ...prev,
                          customerId: '',
                          customerName: typeof value === 'string' ? value : (value ? customerDisplayName(value as Customer) : ''),
                        }));
                      }}
                      onChange={(_, value) => {
                        if (value && typeof value !== 'string') {
                          setFormData((prev) => ({
                            ...prev,
                            customerId: value.id,
                            customerName: customerDisplayName(value),
                          }));
                        } else if (typeof value === 'string') {
                          setFormData((prev) => ({ ...prev, customerId: '', customerName: value }));
                        }
                      }}
                      loading={customersLoading}
                      disabled={isSubmitting}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search customer or enter new name..."
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'transparent',
                              fontWeight: 700,
                              fontSize: '14px',
                              color: isDark ? 'white' : 'inherit',
                              fieldset: { border: 'none' },
                            },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                  <User size={18} color="#EAB308" />
                                </Box>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#EAB308', color: '#050914', fontSize: '12px' }}>
                              {customerDisplayName(option).charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 700 }}>{customerDisplayName(option)}</Typography>
                              {option.email && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{option.email}</Typography>
                              )}
                            </Box>
                          </Stack>
                        </li>
                      )}
                    />
                  </Box>

                  <Box sx={{ bgcolor: isDark ? '#161F33' : '#F8FAFC', borderRadius: '16px', px: 2, py: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1, py: 0.5 }}>
                      <Scissors size={18} color="#EAB308" />
                      <Select
                        multiple
                        fullWidth
                        variant="standard"
                        disableUnderline
                        disabled={isSubmitting || services.length === 0}
                        value={formData.serviceIds || []}
                        onChange={(e) => setFormData({ ...formData, serviceIds: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => {
                              const service = services.find(s => s.id === value);
                              return service ? (
                                <Chip
                                  key={value}
                                  label={service.name}
                                  size="small"
                                  sx={{ bgcolor: '#EAB308', color: '#050914', fontWeight: 900, fontSize: '10px', borderRadius: '6px' }}
                                />
                              ) : null;
                            })}
                          </Box>
                        )}
                        sx={{ fontWeight: 800, fontSize: '14px', color: isDark ? 'white' : 'inherit' }}
                      >
                        {services.length === 0 ? (
                          <MenuItem disabled>No services available</MenuItem>
                        ) : (
                          services.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              <Checkbox checked={(formData.serviceIds || []).indexOf(s.id) > -1} sx={{ color: '#EAB308', '&.Mui-checked': { color: '#EAB308' } }} />
                              <ListItemText primary={s.name} secondary={`Rs. ${s.price} • ${s.duration_minutes}m`} />
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Custom Date Ribbon */}
              <Box>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.15em' }}>Date</Typography>
                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                  {dateRibbon.map((date) => {
                    const isSelected = formData.date === date.full;
                    return (
                      <Paper
                        key={date.full}
                        onClick={() => !isSubmitting && handleDateChange(date.full)}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          minWidth: 70,
                          textAlign: 'center',
                          borderRadius: '16px',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          border: '2px solid',
                          borderColor: isSelected ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                          bgcolor: isSelected ? alpha('#EAB308', 0.1) : (isDark ? '#161F33' : 'white'),
                          transition: 'all 0.2s ease',
                          opacity: isSubmitting ? 0.5 : 1,
                          '&:hover': { borderColor: isSelected ? '#EAB308' : alpha('#EAB308', 0.3) }
                        }}
                      >
                        <Typography sx={{ fontSize: '10px', fontWeight: 900, color: isSelected ? '#EAB308' : '#94A3B8', mb: 0.5 }}>{date.day}</Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 900, color: isSelected ? '#EAB308' : (isDark ? 'white' : 'inherit') }}>{date.num}</Typography>
                      </Paper>
                    );
                  })}
                </Stack>
                {dateTimeError && (
                  <FormHelperText error sx={{ fontWeight: 700, fontSize: '12px', mt: 1 }}>{dateTimeError}</FormHelperText>
                )}
              </Box>

              {/* Custom Time Grid */}
              <Box>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.15em' }}>Time</Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                  {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                    <Box key={period} sx={{ mb: 3 }}>
                      <Typography sx={{ fontSize: '9px', fontWeight: 900, color: '#64748B', mb: 1.5, letterSpacing: '0.1em' }}>{period === 'MORNING' ? 'Morning' : period === 'AFTERNOON' ? 'Afternoon' : 'Evening'}</Typography>
                      <Grid2 container spacing={1}>
                        {slots.map((slot) => {
                          const isSelected = formData.time === slot;
                          return (
                            <Grid2 size={{ xs: 3, sm: 2.4 }} key={slot}>
                              <Paper
                                onClick={() => !isSubmitting && handleTimeChange(slot)}
                                elevation={0}
                                sx={{
                                  py: 1.2,
                                  textAlign: 'center',
                                  borderRadius: '12px',
                                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                  border: '1px solid',
                                  borderColor: isSelected ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                                  bgcolor: isSelected ? '#EAB308' : (isDark ? '#161F33' : 'white'),
                                  color: isSelected ? '#050914' : (isDark ? 'white' : 'inherit'),
                                  transition: 'all 0.2s ease',
                                  opacity: isSubmitting ? 0.5 : 1,
                                  '&:hover': { bgcolor: isSelected ? '#EAB308' : alpha('#EAB308', 0.1) }
                                }}
                              >
                                <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>{slot}</Typography>
                              </Paper>
                            </Grid2>
                          );
                        })}
                      </Grid2>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Select Artisan Gallery */}
              <Box>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2, letterSpacing: '0.15em' }}>Select staff ({staff.length} available)</Typography>
                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
                  {/* Anyone option */}
                  <Paper
                    onClick={() => !isSubmitting && setFormData({ ...formData, staffId: '' })}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      minWidth: 140,
                      borderRadius: '16px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      border: '2px solid',
                      borderColor: formData.staffId === '' ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                      bgcolor: formData.staffId === '' ? alpha('#EAB308', 0.05) : (isDark ? '#161F33' : 'white'),
                      transition: 'all 0.2s ease',
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    <Stack alignItems="center" spacing={1}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: '#64748B', border: `2px solid ${formData.staffId === '' ? '#EAB308' : 'transparent'}` }}>
                          <User size={24} />
                        </Avatar>
                        {formData.staffId === '' && (
                          <Box sx={{ position: 'absolute', bottom: -4, right: -4, bgcolor: '#EAB308', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                            <Check size={10} color="#050914" strokeWidth={4} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>Anyone</Typography>
                        <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>Auto assign</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  {staff.map((member) => {
                    const isSelected = formData.staffId === member.id;
                    return (
                      <Paper
                        key={member.id}
                        onClick={() => !isSubmitting && setFormData({ ...formData, staffId: member.id })}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          minWidth: 140,
                          borderRadius: '16px',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          border: '2px solid',
                          borderColor: isSelected ? '#EAB308' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                          bgcolor: isSelected ? alpha('#EAB308', 0.05) : (isDark ? '#161F33' : 'white'),
                          transition: 'all 0.2s ease',
                          opacity: isSubmitting ? 0.5 : 1,
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar src={member.avatar} sx={{ width: 48, height: 48, border: `2px solid ${isSelected ? '#EAB308' : 'transparent'}` }}>
                              {member.name?.charAt(0)}
                            </Avatar>
                            {isSelected && (
                              <Box sx={{ position: 'absolute', bottom: -4, right: -4, bgcolor: '#EAB308', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                                <Check size={10} color="#050914" strokeWidth={4} />
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>{member.name?.split(' ')[0]}</Typography>
                            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>{member.role || 'Staff'}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </Grid2>

          {/* Right Sidebar: Summary & Vibing */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Stack spacing={3} sx={{ position: 'sticky', top: 0 }}>
              {/* Preferences (Quiet / Chat / Consultation) - hidden for now */}
              <Box sx={{ display: 'none', p: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`, borderRadius: '24px', bgcolor: isDark ? '#050914' : alpha('#F8FAFC', 0.5) }}>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 3, letterSpacing: '0.15em' }}>Preferences</Typography>
                <Stack spacing={1.5}>
                  {[
                    { id: 'zen', icon: <VolumeX size={18} />, label: 'Quiet' },
                    { id: 'social', icon: <Coffee size={18} />, label: 'Chat' },
                    { id: 'consult', icon: <Zap size={18} />, label: 'Consultation' },
                  ].map((v) => (
                    <Paper
                      key={v.id}
                      onClick={() => !isSubmitting && setVibe(v.id as any)}
                      elevation={0}
                      sx={{
                        p: 1.5, cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '14px', border: '2px solid',
                        borderColor: vibe === v.id ? '#EAB308' : 'transparent',
                        bgcolor: vibe === v.id ? alpha('#EAB308', 0.05) : (isDark ? '#161F33' : 'white'),
                        opacity: isSubmitting ? 0.5 : 1,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ color: vibe === v.id ? '#EAB308' : '#64748B' }}>{v.icon}</Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '13px' }}>{v.label}</Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ p: 3, border: '1px solid #EAB308', borderRadius: '24px', bgcolor: isDark ? alpha('#EAB308', 0.02) : '#FEFDF0' }}>
                <Typography sx={{ color: '#EAB308', fontWeight: 900, fontSize: '10px', mb: 2.5, letterSpacing: '0.15em' }}>Summary</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Clock size={14} color="#94A3B8" />
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8' }}>Total Duration</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>{totalDuration} mins</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CreditCard size={14} color="#94A3B8" />
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8' }}>Total Price</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#EAB308' }}>Rs. {totalYield}</Typography>
                  </Stack>

                  <Box sx={{ pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)', mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B' }}>
                      Selected: {formData.date} at {formData.time}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 5, pt: 1, gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <Button fullWidth variant="outlined" disabled={isSubmitting} onClick={onClose} sx={{ borderRadius: '16px', py: 2, fontWeight: 900, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider' }}>Cancel</Button>
        <Button
          fullWidth variant="contained" disableElevation
          onClick={handleSave}
          disabled={isSubmitting || (formData.serviceIds || []).length === 0 || !!dateTimeError}
          sx={{ borderRadius: '16px', py: 2, bgcolor: isDark ? 'white' : '#0F172A', color: isDark ? '#050914' : 'white', fontWeight: 900, '&:disabled': { opacity: 0.5 } }}
        >
          {isSubmitting && <CircularProgress size={20} sx={{ mr: 1 }} />}
          {editingApt ? 'Update booking' : 'Book appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentForm;
