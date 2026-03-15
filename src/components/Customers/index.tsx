import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Search, Mail, Phone, ExternalLink, MoreVertical, RefreshCcw, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/store';
import { getSalonCustomersApi, Customer } from '../../services/api/customerService';
import { getFullImageUrl } from '../../lib/util/imageUrl';

const Customers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get salon from Redux state
  const salon = useSelector((state: RootState) => state.salon.salon);
  const salonId = salon?.id || null;

  const loadCustomers = useCallback(async (signal?: AbortSignal) => {
    if (!salonId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSalonCustomersApi(salonId, { page: 1, limit: 100 }, signal);
      if (signal?.aborted) return;
      const customerData = response.data.data || [];
      setCustomers(customerData);
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED' || err?.errorMessage === 'canceled') return;
      const errorMsg = err.errorMessage || err.message || 'Failed to load customers';
      setError(errorMsg);
      console.error('Load customers error:', err);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [salonId]);

  // Fetch customers when salonId is available
  useEffect(() => {
    if (!salonId) return;
    const controller = new AbortController();
    loadCustomers(controller.signal);
    return () => controller.abort();
  }, [salonId, loadCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const fullName = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || (c.email || '').toLowerCase().includes(query);
    });
  }, [customers, searchQuery]);

  // Calculate customer tier based on total visits
  const getCustomerTier = (totalVisits: number): string => {
    if (totalVisits >= 20) return 'PLATINUM';
    if (totalVisits >= 10) return 'GOLD';
    if (totalVisits >= 5) return 'SILVER';
    return 'BRONZE';
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'No visits yet';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Box sx={{ pb: 8, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }} className="animate-fadeIn">
      {/* Header & Search Section */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', md: 'center' }} 
        spacing={3} 
        sx={{ mb: 6 }}
      >
        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: isDark ? 'white' : '#0F172A', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Client <span style={{ color: '#EAB308' }}>Collective</span>
            </Typography>
            <Chip 
              icon={<Users size={14} />}
              label={customers.length}
              size="small"
              sx={{ bgcolor: alpha('#EAB308', 0.1), color: '#EAB308', fontWeight: 800 }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1rem' }}>
            Understand your most loyal patrons and their aesthetic journeys.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: '100%', md: 400 },
              minWidth: { xs: 0, md: 400 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                bgcolor: isDark ? '#0B1224' : 'background.paper',
                '& fieldset': { borderColor: theme.palette.divider },
                '&.Mui-focused fieldset': { borderColor: '#EAB308' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton 
            onClick={() => loadCustomers()}
            disabled={isLoading}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              p: 1.5,
              flexShrink: 0
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <RefreshCcw size={20} />}
          </IconButton>
        </Stack>
      </Stack>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && customers.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#EAB308' }} />
        </Box>
      )}

      {/* Empty State - No Salon */}
      {!salonId && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Please select a salon to view customers.
          </Typography>
        </Box>
      )}

      {/* Main List: mobile cards / desktop table */}
      {salonId && !isLoading && customers.length > 0 && (
        isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredCustomers.map((customer) => {
              const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown';
              const tier = getCustomerTier(customer.total_visits);
              return (
                <Paper
                  key={customer.id}
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    border: '1.5px solid',
                    borderColor: 'divider',
                    p: 2,
                    bgcolor: isDark ? '#0B1224' : 'white',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                      <Avatar
                        src={getFullImageUrl(customer.avatar) || undefined}
                        sx={{ width: 48, height: 48, border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : theme.palette.divider}`, flexShrink: 0 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{fullName}</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '10px', color: '#EAB308', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tier} TIER</Typography>
                        <Typography noWrap variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '11px', mt: 0.5 }}>{customer.email || 'No email'}</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{customer.total_visits} visits</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '12px', color: '#EAB308' }}>Rs. {Number(customer.total_spent || 0).toLocaleString()}</Typography>
                          <Typography sx={{ fontWeight: 500, fontSize: '11px', color: 'text.secondary' }}>{formatDate(customer.last_visit)}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#EAB308', bgcolor: alpha('#EAB308', 0.1) } }} aria-label="View profile">
                        <ExternalLink size={18} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="More"><MoreVertical size={18} /></IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: '40px',
              border: `1.5px solid ${theme.palette.divider}`,
              overflow: 'auto',
              overflowX: 'auto',
              bgcolor: isDark ? '#0B1224' : 'white',
              boxShadow: '0 4px 24px rgba(0,0,0,0.01)'
            }}
          >
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: isDark ? alpha('#FFFFFF', 0.02) : 'rgba(15, 23, 42, 0.02)' }}>
                <TableRow>
                  <TableCell sx={{ py: 3, fontWeight: 800, color: 'text.primary', fontSize: '14px', pl: 4 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.primary', fontSize: '14px' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.primary', fontSize: '14px' }}>Visits</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.primary', fontSize: '14px' }}>Total Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.primary', fontSize: '14px' }}>Last Sanctuary Entry</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '14px', pr: 4 }}>Profile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown';
                  const tier = getCustomerTier(customer.total_visits);
                  return (
                    <TableRow key={customer.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ py: 4, pl: 4 }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar src={getFullImageUrl(customer.avatar) || undefined} sx={{ width: 56, height: 56, border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : theme.palette.divider}` }} />
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{fullName}</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '10px', color: '#EAB308', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tier} TIER</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.8}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Mail size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{customer.email || 'No email'}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Phone size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{customer.phone || 'No phone'}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell><Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>{customer.total_visits}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#EAB308' }}>Rs. {Number(customer.total_spent || 0).toLocaleString()}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{formatDate(customer.last_visit)}</Typography></TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Aesthetic Journey">
                            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: '#EAB308', bgcolor: alpha('#EAB308', 0.1) } }}><ExternalLink size={20} /></IconButton>
                          </Tooltip>
                          <IconButton sx={{ color: 'text.secondary' }}><MoreVertical size={20} /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Empty State - No Customers */}
      {salonId && !isLoading && customers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Users size={48} color={theme.palette.text.secondary} style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
            No customers yet
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontWeight: 400 }}>
            Customers will appear here once they book appointments at your salon.
          </Typography>
        </Box>
      )}

      {/* No Search Results */}
      {salonId && !isLoading && customers.length > 0 && filteredCustomers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
            No patrons found in the collective for "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Customers;
