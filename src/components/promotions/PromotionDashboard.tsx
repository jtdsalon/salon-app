import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid2,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Skeleton,
  Fade,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Plus, Search, Filter, LayoutGrid, List, BarChart3, Tag, RefreshCw } from 'lucide-react';
import { useAuthContext } from '@/state/auth';
import { useSalonLayout } from '@/components/common/layouts';
import { PromotionCard } from './PromotionCard';
import { PromotionTable } from './PromotionTable';
import { PromotionAnalytics } from './PromotionAnalytics';
import { CreatePromotion } from './CreatePromotion';
import { usePromotionDashboard, getErrorMessage } from './hooks';

export const PromotionDashboard: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthContext();
  const { selectedSalonId } = useSalonLayout();
  const salonId = selectedSalonId ?? user?.salonId ?? (user?.roles as { salonId?: string }[] | undefined)?.[0]?.salonId;

  const {
    viewMode,
    setViewMode,
    editingId,
    duplicateFromId,
    deleteConfirmId,
    viewDetailsPromo,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    isLoading,
    promotionError,
    filteredPromotions,
    showCreateOrEdit,
    handleRefresh,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleToggleStatus,
    handleViewDetails,
    handleCloseViewDetails,
    handleDuplicate,
    handleCloseDeleteDialog,
    handleStartCreating,
    handleCancelCreateEdit,
    handleSaveComplete,
    handleClearError,
  } = usePromotionDashboard({ salonId: salonId ?? null });

  if (showCreateOrEdit && salonId) {
    return (
      <Fade in={true}>
        <Box sx={{ width: '100%', minWidth: 0, overflowX: 'hidden' }}>
          <CreatePromotion
            salonId={salonId}
            editPromotionId={editingId ?? undefined}
            duplicateFromId={duplicateFromId ?? undefined}
            onCancel={handleCancelCreateEdit}
            onSave={handleSaveComplete}
          />
        </Box>
      </Fade>
    );
  }

  if (!salonId && !isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">Select a salon to manage promotions.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 }, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={{ xs: 2, md: 3 }}
        sx={{ mb: { xs: 3, md: 6 } }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            }}
          >
            Promotion <Box component="span" sx={{ color: '#EAB308' }}>Center</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Manage your salon's special offers, campaigns, and featured ads.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
            sx={{
              borderRadius: '12px',
              fontWeight: 900,
              px: { xs: 2, sm: 3 },
              py: 1.5,
              minHeight: 44,
              border: '1.5px solid',
              borderColor: 'divider',
              fontSize: '12px',
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.primary', color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            REFRESH
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={18} />}
            onClick={handleStartCreating}
            sx={{
              borderRadius: '12px',
              fontWeight: 900,
              px: { xs: 2, sm: 4 },
              py: 1.5,
              minHeight: 44,
              bgcolor: 'text.primary',
              color: 'background.paper',
              fontSize: '12px',
              '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>CREATE PROMOTION</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>CREATE</Box>
          </Button>
        </Stack>
      </Stack>

      {promotionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearError}>
          {getErrorMessage(promotionError)}
        </Alert>
      )}

      <Box sx={{ mb: { xs: 2, md: 4 }, borderBottom: '1.5px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Tabs
          value={viewMode}
          onChange={(_, val) => setViewMode(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: 48, sm: 64 },
            '& .MuiTab-root': {
              minWidth: { xs: 72, sm: 100, md: 140 },
              fontWeight: 800,
              fontSize: { xs: '11px', sm: '12px', md: '13px' },
              color: 'text.secondary',
              '&.Mui-selected': { color: '#EAB308' },
              px: { xs: 1, sm: 2 },
            },
            '& .MuiTab-iconWrapper': { mb: 0 },
            '& .MuiTabs-indicator': { bgcolor: '#EAB308', height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTabs-scrollButtons': { color: 'text.secondary' },
          }}
        >
          <Tab icon={<LayoutGrid size={18} />} iconPosition="start" label="Grid" value="grid2" />
          <Tab icon={<List size={18} />} iconPosition="start" label="Table" value="table" />
          <Tab icon={<BarChart3 size={18} />} iconPosition="start" label="Analytics" value="analytics" />
        </Tabs>
      </Box>

      {viewMode !== 'analytics' && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: { xs: 2, md: 4 } }}>
          <TextField
            fullWidth
            placeholder="Search promotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              minWidth: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: { xs: '12px', md: '16px' },
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
              },
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
          />
          <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }} size="small">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{
                borderRadius: { xs: '12px', md: '16px' },
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
              }}
              startAdornment={<InputAdornment position="start"><Filter size={18} /></InputAdornment>}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Service Discount">Service Discount</MenuItem>
              <MenuItem value="Bundle Package">Bundle Package</MenuItem>
              <MenuItem value="First-Time Offer">First-Time Offer</MenuItem>
              <MenuItem value="Happy Hour">Happy Hour</MenuItem>
              <MenuItem value="Campaign">Campaign</MenuItem>
              <MenuItem value="Featured Promotion">Featured Promotion</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      <Box sx={{ minHeight: 400, overflow: 'hidden' }}>
        {isLoading ? (
          <Grid2 container spacing={{ xs: 2, md: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid2 size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: { xs: '16px', md: '24px' } }} />
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Fade in={!isLoading}>
            <Box>
              {viewMode === 'grid2' && (
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  {filteredPromotions.length > 0 ? (
                    filteredPromotions.map((promo) => (
                      <Grid2 size={{ xs: 12, sm: 6, lg: 4 }} key={promo.id}>
                        <PromotionCard
                          promotion={promo}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                          onToggleStatus={handleToggleStatus}
                          onViewDetails={handleViewDetails}
                        />
                      </Grid2>
                    ))
                  ) : (
                    <Grid2 size={{ xs: 12 }}>
                      <EmptyState onAction={handleStartCreating} />
                    </Grid2>
                  )}
                </Grid2>
              )}
              {viewMode === 'table' && (
                <PromotionTable promotions={filteredPromotions} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
              )}
              {viewMode === 'analytics' && salonId && <PromotionAnalytics salonId={salonId} />}
            </Box>
          </Fade>
        )}
      </Box>

      <Dialog open={!!deleteConfirmId} onClose={handleCloseDeleteDialog} fullScreen={isMobile} fullWidth>
        <DialogTitle>Delete Promotion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this promotion? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog} sx={{ borderRadius: '12px', fontWeight: 900, fontSize: '12px', py: 1.5, borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary', bgcolor: 'action.hover' } }}>Cancel</Button>
          <Button color="error" variant="contained" disableElevation onClick={handleConfirmDelete} sx={{ borderRadius: '12px', fontWeight: 900, fontSize: '12px', py: 1.5, minHeight: 44 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewDetailsPromo} onClose={handleCloseViewDetails} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>Promotion Details</DialogTitle>
        <DialogContent>
          {viewDetailsPromo && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Title</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>{viewDetailsPromo.title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>{viewDetailsPromo.type}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Offer</Typography>
                <Typography variant="body1" sx={{ fontWeight: 900 }}>{viewDetailsPromo.discount}</Typography>
              </Box>
              {viewDetailsPromo.code && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Code</Typography>
                  <Typography variant="body1" fontFamily="monospace" sx={{ fontWeight: 800 }}>{viewDetailsPromo.code}</Typography>
                </Box>
              )}
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{viewDetailsPromo.status}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Usage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{viewDetailsPromo.usageCount} bookings</Typography>
                </Box>
              </Stack>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Valid until</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{viewDetailsPromo.endDate}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseViewDetails} sx={{ borderRadius: '12px', fontWeight: 900, fontSize: '12px', py: 1.5, borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary', bgcolor: 'action.hover' } }}>Close</Button>
          {viewDetailsPromo && (
            <Button variant="contained" disableElevation onClick={() => { handleEdit(viewDetailsPromo); handleCloseViewDetails(); }} sx={{ borderRadius: '12px', fontWeight: 900, fontSize: '12px', py: 1.5, minHeight: 44, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.primary', opacity: 0.9 } }}>
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const EmptyState: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 4, md: 8 },
      textAlign: 'center',
      borderRadius: { xs: '24px', md: '40px' },
      border: '2px dashed',
      borderColor: 'divider',
      bgcolor: 'transparent',
    }}
  >
    <Box sx={{ mb: 2, display: 'inline-flex', p: { xs: 2, md: 3 }, borderRadius: '50%', bgcolor: 'action.hover' }}>
      <Tag size={40} color="#EAB308" />
    </Box>
    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '1.15rem', md: '1.5rem' } }}>No Promotions Found</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto', fontWeight: 600, px: 1 }}>
      You haven't created any promotions matching your search criteria. Start a new campaign to boost your sales.
    </Typography>
    <Button variant="contained" disableElevation onClick={onAction} sx={{ borderRadius: '12px', fontWeight: 900, px: 3, py: 1.5, minHeight: 44, bgcolor: 'text.primary', color: 'background.paper', fontSize: '12px', '&:hover': { bgcolor: 'text.primary', opacity: 0.9 } }}>
      CREATE YOUR FIRST OFFER
    </Button>
  </Paper>
);

export default PromotionDashboard;
