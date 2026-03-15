import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useMediaQuery,
} from '@mui/material';
import {
  Phone,
  Pencil,
  Building2,
  MapPinned,
  Trash2,
  Plus,
} from 'lucide-react';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fade } from '@mui/material';
import { Branch } from '../../types';

interface BranchesTabProps {
  branches: Branch[];
  theme: any;
  onEdit: (branch: Branch) => void;
  onAdd: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'maintenance':
      return '#f59e0b';
    case 'closed':
      return '#ef4444';
    case 'permanent-closed':
      return '#6b7280';
    default:
      return '#6b7280';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return '🟢 Active & Accepting Clients';
    case 'maintenance':
      return '🟡 Under Renovation';
    case 'closed':
      return '🔴 Temporarily Closed';
    case 'permanent-closed':
      return '⚫ Permanently Closed';
    default:
      return status;
  }
};

export const BranchesTab: React.FC<BranchesTabProps> = ({
  branches,
  theme,
  onEdit,
  onAdd,
}) => {
  const themeFromHook = useTheme();
  const isMobile = useMediaQuery(themeFromHook.breakpoints.down('sm'));
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isPrimaryError, setIsPrimaryError] = useState(false);

  const handleDeleteClick = (branch: Branch) => {
    // Prevent deleting if it's the only primary branch
    if (branch.isPrimary && branches.length === 1) {
      setIsPrimaryError(true);
      return;
    }
    setBranchToDelete(branch);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (branchToDelete) {
      // TODO: Call API to delete branch
      console.log('Deleting branch:', branchToDelete);
      setDeleteConfirmOpen(false);
      setBranchToDelete(null);
    }
  };

  const activeBranchesCount = useMemo(
    () => branches.filter((b) => b.status === 'active').length,
    [branches]
  );

  return (
    <Fade in>
      <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        {/* Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={{ xs: 2, sm: 0 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Locations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>
              Manage your {branches.length} location
              {branches.length !== 1 ? 's' : ''} ({activeBranchesCount} active)
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={16} />}
            onClick={onAdd}
            sx={{
              borderRadius: '12px',
              bgcolor: 'text.primary',
              color: 'background.paper',
              fontSize: '11px',
              fontWeight: 900,
              px: 2.5,
              py: 1.5,
              minHeight: 44,
              '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
            }}
          >
            Add branch
          </Button>
        </Stack>

        {/* Error Messages */}
        {isPrimaryError && (
          <Alert
            severity="error"
            onClose={() => setIsPrimaryError(false)}
            sx={{ mb: 3, borderRadius: '16px' }}
          >
            You must have at least one primary branch. Please designate another branch as primary before deleting this one.
          </Alert>
        )}

        {/* Empty State */}
        {branches.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              borderRadius: { xs: '20px', md: '32px' },
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Building2 size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1rem', md: 'inherit' } }}>
              No Locations Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first location to get started
            </Typography>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Plus size={16} />}
              onClick={onAdd}
              sx={{
                borderRadius: '12px',
                bgcolor: 'text.primary',
                color: 'background.paper',
                fontSize: '11px',
                fontWeight: 900,
                px: 2.5,
                py: 1.5,
                minHeight: 44,
                '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
              }}
            >
              Add first location
            </Button>
          </Paper>
        )}

        {/* Branches Grid */}
        {branches.length > 0 && (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {branches.map((branch) => (
              <Grid key={branch.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 4 },
                    borderRadius: { xs: '20px', md: '32px' },
                    border: '1.5px solid',
                    borderColor: branch.isPrimary ? 'secondary.main' : 'divider',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  {/* Primary Badge */}
                  {branch.isPrimary && (
                    <Chip
                      label="PRIMARY"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        bgcolor: 'secondary.main',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '10px',
                      }}
                    />
                  )}

                  <Stack spacing={{ xs: 2, md: 3 }}>
                    {/* Branch Name and Location Icon */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'action.hover',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MapPinned size={20} color={themeFromHook.palette.secondary.main} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          {branch.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: 'inherit' } }}>
                          {getStatusLabel(branch.status || 'active')}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Address */}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: 'inherit' }, wordBreak: 'break-word' }}>
                        {branch.address}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Phone and Actions */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={{ xs: 1.5, sm: 0 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Phone size={14} color={themeFromHook.palette.text.secondary} />
                        <Typography
                          sx={{
                            fontSize: { xs: '12px', md: '13px' },
                            fontWeight: 700,
                            color: 'text.secondary',
                          }}
                        >
                          {branch.phone}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => onEdit(branch)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'secondary.main',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Pencil size={16} />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(branch)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.lighter',
                            },
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : undefined,
              p: isMobile ? 0 : undefined,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 900, fontSize: { xs: '16px', sm: '18px' }, p: { xs: 2, sm: 2 } }}>
            Delete Location?
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to remove "{branchToDelete?.name}"? It will no longer appear in your locations list.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 2 }, gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              fullWidth={isMobile}
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
                borderColor: 'divider',
                fontSize: '11px',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disableElevation
              fullWidth={isMobile}
              onClick={handleConfirmDelete}
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '11px',
              }}
            >
              Decommission
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};
