import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  alpha,
  useTheme,
  IconButton,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid2,
} from '@mui/material';
import {
  Star,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Eye,
  Users,
  TrendingUp,
} from 'lucide-react';
import type { PromotionCardData } from '@/services/api/promotionService';

interface PromotionCardProps {
  promotion: PromotionCardData;
  onEdit?: (promo: PromotionCardData) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (promo: PromotionCardData) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
  onViewDetails?: (promo: PromotionCardData) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewDetails,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'Scheduled':
        return '#3B82F6';
      case 'Expired':
        return '#64748B';
      default:
        return '#64748B';
    }
  };

  const getPromotionTypeLabel = (type: string) => {
    return type.replace('_', ' ');
  };

  const getDiscountLabel = () => {
    if (promotion.promotion_type === 'bundle' && promotion.bundle_price != null) {
      return `Rs.${Number(promotion.bundle_price).toLocaleString()} BUNDLE`;
    }
    if (promotion.promotion_type === 'featured') {
      return 'VISIBILITY BOOST';
    }
    const val = promotion.discountValue ?? 0;
    const isPct = promotion.discountType === 'percentage';
    return isPct ? `${val}% OFF` : `Rs.${Number(val).toLocaleString()} OFF`;
  };

  const schedule = promotion.happy_hour_schedule;
  const happyHourDays = schedule?.days?.length
    ? schedule.days.join(', ').toUpperCase()
    : '';
  const happyHourTime =
    schedule && (schedule.start || schedule.startTime) && (schedule.end || schedule.endTime)
      ? `${schedule.start || schedule.startTime} - ${schedule.end || schedule.endTime}`
      : '';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1.5px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        bgcolor: isDark ? '#0f172a' : 'white',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#EAB308',
          boxShadow: '0 12px 24px -8px rgba(234, 179, 8, 0.15)',
        },
      }}
    >
      {promotion.isFeatured && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: 20,
            bgcolor: '#EAB308',
            color: '#050914',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 1,
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
          }}
        >
          <Star size={12} fill="currentColor" />
          <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '10px', letterSpacing: '0.05em' }}>
            FEATURED
          </Typography>
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.01em' }}>
                {promotion.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={getPromotionTypeLabel(promotion.type)}
                  size="small"
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '10px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    height: '20px',
                    textTransform: 'uppercase',
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={12} /> Ends {promotion.endDate}
                </Typography>
              </Stack>
            </Box>
            <Box>
              <IconButton size="small" sx={{ mt: -0.5 }} onClick={handleMenuOpen}>
                <MoreVertical size={18} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    borderRadius: '16px',
                    mt: 1,
                    minWidth: 180,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onViewDetails?.(promotion);
                  }}
                >
                  <ListItemIcon>
                    <Eye size={16} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>View Details</Typography>} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onEdit?.(promotion);
                  }}
                >
                  <ListItemIcon>
                    <Pencil size={16} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>Edit Promotion</Typography>} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onDuplicate?.(promotion);
                  }}
                >
                  <ListItemIcon>
                    <Copy size={16} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>Duplicate</Typography>} />
                </MenuItem>
                <Box sx={{ my: 1, borderTop: '1px solid', borderColor: 'divider' }} />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onDelete?.(promotion.id);
                  }}
                  sx={{ color: '#EF4444' }}
                >
                  <ListItemIcon>
                    <Trash2 size={16} color="#EF4444" />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>Delete</Typography>} />
                </MenuItem>
              </Menu>
            </Box>
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: '16px',
              bgcolor: alpha(getStatusColor(promotion.status), 0.05),
              border: '1px solid',
              borderColor: alpha(getStatusColor(promotion.status), 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: getStatusColor(promotion.status), display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>
                OFFER
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: getStatusColor(promotion.status) }}>
                {getDiscountLabel()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={promotion.status.toUpperCase()}
                size="small"
                sx={{
                  borderRadius: '100px',
                  fontWeight: 900,
                  fontSize: '10px',
                  bgcolor: getStatusColor(promotion.status),
                  color: 'white',
                  height: '22px',
                }}
              />
            </Box>
          </Box>

          {promotion.promotion_type === 'happy_hour' && (happyHourDays || happyHourTime) && (
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha('#EAB308', 0.05), border: '1px solid', borderColor: alpha('#EAB308', 0.1) }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#EAB308', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Clock size={12} /> HAPPY HOUR SCHEDULE
              </Typography>
              {happyHourDays && (
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {happyHourDays}
                </Typography>
              )}
              {happyHourTime && (
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                  {happyHourTime}
                </Typography>
              )}
            </Box>
          )}

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6 }}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Users size={12} /> USAGE
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  {promotion.usageCount} <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px' }}>Bookings</Box>
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUp size={12} /> VIEWS
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  {promotion.views} <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px' }}>Clicks</Box>
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>

          <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={promotion.is_active}
                  color="warning"
                  onChange={(e) => onToggleStatus?.(promotion.id, e.target.checked)}
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 800 }}>Active Status</Typography>}
              sx={{ m: 0 }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
