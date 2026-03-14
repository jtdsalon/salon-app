import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BookOpen } from 'lucide-react';
import {
  getSalonSettingsApi,
  updateSalonSettingsApi,
  type SalonSettings,
} from '@/services/api/salonService';

interface SettingsTabProps {
  salonId: string | null | undefined;
  theme: any;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  salonId,
  theme,
}) => {
  const isDark = theme.palette.mode === 'dark';

  const [settings, setSettings] = useState<Partial<SalonSettings>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    if (!salonId) {
      setLoadingSettings(false);
      return;
    }
    setLoadingSettings(true);
    getSalonSettingsApi(salonId)
      .then((res) => {
        const data = (res.data as any)?.data ?? res.data;
        setSettings({
          min_notice_minutes: data.min_notice_minutes ?? 60,
          max_advance_days: data.max_advance_days ?? 30,
          max_bookings_per_slot: data.max_bookings_per_slot ?? 1,
          free_cancellation_hours: data.free_cancellation_hours ?? 24,
          late_cancellation_fee: data.late_cancellation_fee ?? null,
          late_cancel_fee_type: data.late_cancel_fee_type ?? null,
          advance_payment_rule: data.advance_payment_rule ?? null,
          advance_payment_type: data.advance_payment_type ?? null,
          advance_payment_value: data.advance_payment_value ?? null,
          reschedule_hours: data.reschedule_hours ?? 2,
          late_arrival_action: data.late_arrival_action ?? null,
          late_arrival_grace_minutes: data.late_arrival_grace_minutes ?? 10,
          noshow_block_count: data.noshow_block_count ?? 3,
          noshow_action: data.noshow_action ?? null,
        });
      })
      .catch(() =>
        setSettings({
          min_notice_minutes: 60,
          max_advance_days: 30,
          max_bookings_per_slot: 1,
          free_cancellation_hours: 24,
          late_cancellation_fee: null,
          late_cancel_fee_type: null,
          advance_payment_rule: null,
          advance_payment_type: null,
          advance_payment_value: null,
          reschedule_hours: 2,
          late_arrival_action: null,
          late_arrival_grace_minutes: 10,
          noshow_block_count: 3,
          noshow_action: null,
        })
      )
      .finally(() => setLoadingSettings(false));
  }, [salonId]);

  const handleSettingsChange = (field: keyof SalonSettings, value: number | string | null) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    if (!salonId) return;
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await updateSalonSettingsApi(salonId, settings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <Box sx={{ py: 3, maxWidth: 640 }}>
      {/* Booking rules */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <BookOpen size={20} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Booking rules
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Advance payment, minimum notice, max advance booking, cancellation, reschedule, late arrival, and no-show policy.
        </Typography>
        {loadingSettings ? (
          <Stack direction="row" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Stack spacing={3}>
            {/* 1. Advance Payment */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Advance payment</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 160, borderRadius: '16px' }}>
                  <InputLabel>Rule</InputLabel>
                  <Select
                    value={settings.advance_payment_rule ?? 'NONE'}
                    label="Rule"
                    onChange={(e) => handleSettingsChange('advance_payment_rule', e.target.value as SalonSettings['advance_payment_rule'])}
                  >
                    <MenuItem value="NONE">No need</MenuItem>
                    <MenuItem value="OPTIONAL">Optional</MenuItem>
                    <MenuItem value="MUST">Must pay</MenuItem>
                  </Select>
                </FormControl>
                {(settings.advance_payment_rule === 'MUST' || settings.advance_payment_rule === 'OPTIONAL') && (
                  <>
                    <FormControl size="small" sx={{ minWidth: 120, borderRadius: '16px' }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={settings.advance_payment_type ?? 'PERCENTAGE'}
                        label="Type"
                        onChange={(e) => handleSettingsChange('advance_payment_type', e.target.value as SalonSettings['advance_payment_type'])}
                      >
                        <MenuItem value="FIXED">Fixed amount</MenuItem>
                        <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      type="number"
                      label={settings.advance_payment_type === 'PERCENTAGE' ? 'Value (%)' : 'Value'}
                      value={settings.advance_payment_value ?? ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        handleSettingsChange('advance_payment_value', v === '' ? null : parseFloat(v) || 0);
                      }}
                      inputProps={{ min: 0, max: settings.advance_payment_type === 'PERCENTAGE' ? 100 : undefined }}
                      sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                    />
                  </>
                )}
              </Stack>
            </Box>

            {/* 2. Advance booking time */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Minimum advance booking</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {[30, 60, 120].map((m) => (
                  <Button
                    key={m}
                    size="small"
                    variant={(settings.min_notice_minutes ?? 0) === m ? 'contained' : 'outlined'}
                    onClick={() => handleSettingsChange('min_notice_minutes', m)}
                  >
                    {m === 30 ? '30 min' : m === 60 ? '1 hour' : '2 hours'}
                  </Button>
                ))}
                <TextField
                  size="small"
                  type="number"
                  placeholder="Custom minutes"
                  value={[30, 60, 120].includes(settings.min_notice_minutes ?? 0) ? '' : (settings.min_notice_minutes ?? '')}
                  onChange={(e) => handleSettingsChange('min_notice_minutes', parseInt(e.target.value, 10) || 0)}
                  inputProps={{ min: 0, step: 15 }}
                  sx={{ width: 130, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </Stack>
            </Box>

            {/* 3. Maximum future booking */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Maximum future booking</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {[7, 30, 90].map((d) => (
                  <Button
                    key={d}
                    size="small"
                    variant={(settings.max_advance_days ?? 0) === d ? 'contained' : 'outlined'}
                    onClick={() => handleSettingsChange('max_advance_days', d)}
                  >
                    {d} days
                  </Button>
                ))}
                <TextField
                  size="small"
                  type="number"
                  placeholder="Custom days"
                  value={[7, 30, 90].includes(settings.max_advance_days ?? 0) ? '' : (settings.max_advance_days ?? '')}
                  onChange={(e) => handleSettingsChange('max_advance_days', parseInt(e.target.value, 10) || 0)}
                  inputProps={{ min: 1, max: 365 }}
                  sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </Stack>
            </Box>

            {/* 5. Same slot booking limit (max bookings per slot) */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Bookings per time slot</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                How many people can book the same time? When full, that time is no longer shown.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {[1, 2, 3, 5].map((n) => (
                  <Button
                    key={n}
                    size="small"
                    variant={(settings.max_bookings_per_slot ?? 1) === n ? 'contained' : 'outlined'}
                    onClick={() => handleSettingsChange('max_bookings_per_slot', n)}
                  >
                    {n} {n === 1 ? 'booking' : 'bookings'}
                  </Button>
                ))}
                <TextField
                  size="small"
                  type="number"
                  placeholder="Custom"
                  value={[1, 2, 3, 5].includes(settings.max_bookings_per_slot ?? 1) ? '' : (settings.max_bookings_per_slot ?? '')}
                  onChange={(e) => handleSettingsChange('max_bookings_per_slot', Math.max(1, parseInt(e.target.value, 10) || 1))}
                  inputProps={{ min: 1, max: 20 }}
                  sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </Stack>
            </Box>

            {/* 6. Cancellation policy */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cancellation policy</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                {[1, 3, 24].map((h) => (
                  <Button
                    key={h}
                    size="small"
                    variant={(settings.free_cancellation_hours ?? 0) === h ? 'contained' : 'outlined'}
                    onClick={() => handleSettingsChange('free_cancellation_hours', h)}
                  >
                    {h} {h === 1 ? 'hour' : 'hours'} before
                  </Button>
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 140, borderRadius: '16px' }}>
                  <InputLabel>Late cancel fee</InputLabel>
                  <Select
                    value={settings.late_cancel_fee_type ?? 'NONE'}
                    label="Late cancel fee"
                    onChange={(e) => handleSettingsChange('late_cancel_fee_type', e.target.value as SalonSettings['late_cancel_fee_type'])}
                  >
                    <MenuItem value="NONE">No fee</MenuItem>
                    <MenuItem value="FIXED">Fixed amount</MenuItem>
                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                  </Select>
                </FormControl>
                {(settings.late_cancel_fee_type === 'FIXED' || settings.late_cancel_fee_type === 'PERCENTAGE') && (
                  <TextField
                    size="small"
                    type="number"
                    label={settings.late_cancel_fee_type === 'PERCENTAGE' ? 'Fee %' : 'Fee amount'}
                    value={settings.late_cancellation_fee ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      handleSettingsChange('late_cancellation_fee', v === '' ? null : parseFloat(v) || 0);
                    }}
                    inputProps={{ min: 0 }}
                    sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                  />
                )}
              </Stack>
            </Box>

            {/* 7. Reschedule */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Reschedule allowed until</Typography>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Hours before appointment"
                value={settings.reschedule_hours ?? ''}
                onChange={(e) => handleSettingsChange('reschedule_hours', parseInt(e.target.value, 10) || 0)}
                helperText="Customers can change booking time until this many hours before"
                inputProps={{ min: 0 }}
                sx={{ maxWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
              />
            </Box>

            {/* 8. Late arrival */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Late arrival</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 180, borderRadius: '16px' }}>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={settings.late_arrival_action ?? 'GRACE'}
                    label="Action"
                    onChange={(e) => handleSettingsChange('late_arrival_action', e.target.value as SalonSettings['late_arrival_action'])}
                  >
                    <MenuItem value="GRACE">Grace period</MenuItem>
                    <MenuItem value="AUTO_CANCEL">Auto-cancel if late</MenuItem>
                    <MenuItem value="SHORTEN">Shorten service</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  label="Grace (minutes)"
                  value={settings.late_arrival_grace_minutes ?? ''}
                  onChange={(e) => handleSettingsChange('late_arrival_grace_minutes', parseInt(e.target.value, 10) || 0)}
                  inputProps={{ min: 0 }}
                  sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </Stack>
            </Box>

            {/* 9. No-show */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>No-show policy</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 160, borderRadius: '16px' }}>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={settings.noshow_action ?? 'BLOCK'}
                    label="Action"
                    onChange={(e) => handleSettingsChange('noshow_action', e.target.value as SalonSettings['noshow_action'])}
                  >
                    <MenuItem value="BLOCK">Block after X no-shows</MenuItem>
                    <MenuItem value="CHARGE">Charge advance payment</MenuItem>
                    <MenuItem value="RESTRICT">Restrict future bookings</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  label="No-shows before action"
                  value={settings.noshow_block_count ?? ''}
                  onChange={(e) => handleSettingsChange('noshow_block_count', parseInt(e.target.value, 10) || 0)}
                  inputProps={{ min: 1 }}
                  sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              onClick={handleSaveSettings}
              disabled={savingSettings}
              sx={{ alignSelf: 'flex-start', borderRadius: '12px', fontWeight: 700 }}
            >
              {savingSettings ? <CircularProgress size={20} /> : 'Save booking rules'}
            </Button>
            {settingsSuccess && (
              <Alert severity="success" sx={{ borderRadius: '12px' }}>
                Booking rules updated.
              </Alert>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
