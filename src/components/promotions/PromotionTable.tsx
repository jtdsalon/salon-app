import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  alpha,
  useTheme,
  useMediaQuery,
  Stack,
  Tooltip
} from '@mui/material';
import { Pencil, Trash2, Pause, Play, MoreVertical, ExternalLink } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  type: string;
  discount: string;
  code?: string | null;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  usageCount: number;
  is_active?: boolean;
}

interface PromotionTableProps {
  promotions: Promotion[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const PromotionTable: React.FC<PromotionTableProps> = ({ 
  promotions, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Scheduled': return '#3B82F6';
      case 'Expired': return '#64748B';
      default: return '#64748B';
    }
  };

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: { xs: '16px', md: '24px' },
        border: '1.5px solid',
        borderColor: 'divider',
        bgcolor: isDark ? '#0f172a' : 'white',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 600 }} size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promotion</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discount</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Usage</TableCell>
            <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow 
              key={promo.id}
              sx={{ 
                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.01) },
                '& td': { borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }
              }}
            >
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{promo.title}</Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={promo.type} 
                  size="small" 
                  sx={{ 
                    borderRadius: '6px', 
                    fontWeight: 700, 
                    fontSize: '10px',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    height: '20px'
                  }} 
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 900, color: getStatusColor(promo.status) }}>
                  {promo.discount}
                </Typography>
              </TableCell>
              <TableCell>
                {promo.code ? (
                  <Chip label={promo.code} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '11px' }} />
                ) : (
                  <Typography variant="caption" color="text.secondary">—</Typography>
                )}
              </TableCell>
              <TableCell>
                <Stack spacing={0.2}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{promo.startDate}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>to {promo.endDate}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip 
                  label={promo.status} 
                  size="small"
                  sx={{ 
                    borderRadius: '100px', 
                    fontWeight: 900, 
                    fontSize: '10px',
                    bgcolor: alpha(getStatusColor(promo.status), 0.1),
                    color: getStatusColor(promo.status),
                    border: '1px solid',
                    borderColor: alpha(getStatusColor(promo.status), 0.2),
                    height: '24px'
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" sx={{ fontWeight: 900 }}>{promo.usageCount}</Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title={promo.status === 'Active' ? 'Pause' : 'Activate'}>
                    <IconButton size="small" onClick={() => onToggleStatus(promo.id, !(promo.is_active ?? true))} sx={{ color: 'text.secondary' }}>
                      {promo.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(promo.id)} sx={{ color: 'text.secondary' }}>
                      <Pencil size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(promo.id)} sx={{ color: '#EF4444' }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
