import React from 'react';
import { Box, Paper, Avatar, Stack, Typography, Button, IconButton, useTheme, alpha } from '@mui/material';
import { 
  Pencil, 
  Star, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Crown, 
  Instagram, 
  Facebook, 
  Globe 
} from 'lucide-react';
import { Salon } from '../../../state/salon/types';
import { getFullImageUrl } from '../../../lib/util/imageUrl';
import { ACCENT_COLOR, ACCENT_COLOR_HOVER, CARD_BG_DARK, ON_ACCENT } from '@/lib/constants/theme';

interface SalonHeaderProps {
  salon: Salon;
  currentOpenStatus: string;
  onEditClick: () => void;
}

export const SalonHeader: React.FC<SalonHeaderProps> = ({ salon, currentOpenStatus, onEditClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Logic from Old UI: Image URL construction and loading states
  const [coverImageLoaded, setCoverImageLoaded] = React.useState(false);
  const fullAvatarUrl = getFullImageUrl(salon.avatar);
  const fullCoverUrl = getFullImageUrl(salon.cover);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: { xs: '24px', md: '48px' }, 
        overflow: 'hidden', 
        bgcolor: isDark ? CARD_BG_DARK : 'background.paper', 
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'divider', 
        mb: 6, 
        position: 'relative' 
      }}
    >
      {/* Cover Section */}
      <Box sx={{ height: 200, width: '100%', position: 'relative', bgcolor: isDark ? ON_ACCENT : alpha(theme.palette.primary.main, 0.05) }}>
        {fullCoverUrl && (
          <img 
            src={fullCoverUrl} 
            alt="Cover" 
            onLoad={() => setCoverImageLoaded(true)}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              opacity: coverImageLoaded ? (isDark ? 0.6 : 0.8) : 0,
              transition: 'opacity 0.3s ease-in-out'
            }} 
          />
        )}
        <Box 
          sx={{ 
            position: 'absolute', 
            inset: 0, 
            background: isDark 
              ? `linear-gradient(to bottom, transparent 30%, ${CARD_BG_DARK} 100%)`
              : `linear-gradient(to bottom, transparent 30%, ${theme.palette.background.paper} 100%)`
          }} 
        />
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          onClick={onEditClick}
          startIcon={<Pencil size={16} />}
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            borderRadius: '12px',
            bgcolor: ACCENT_COLOR,
            color: ON_ACCENT,
            fontSize: '12px',
            fontWeight: 900,
            height: 44,
            px: 3,
            textTransform: 'none',
            boxShadow: isDark ? '0 4px 12px rgba(234, 179, 8, 0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: ACCENT_COLOR_HOVER,
              color: ON_ACCENT,
              boxShadow: isDark ? '0 6px 16px rgba(234, 179, 8, 0.4)' : '0 6px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Profile Section */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: 6, mt: -8, position: 'relative' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-end' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={fullAvatarUrl || undefined} 
              sx={{ 
                width: 120, 
                height: 120, 
                border: '6px solid',
                borderColor: isDark ? CARD_BG_DARK : 'background.paper', 
                boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.6)' : '0 10px 20px rgba(0,0,0,0.1)',
                bgcolor: isDark ? '#1a2233' : '#f0f0f0'
              }} 
            />
            {/* New UI Crown Badge - explicit square dimensions for perfect circle */}
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                right: 8, 
                width: 36,
                height: 36,
                minWidth: 36,
                minHeight: 36,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: ACCENT_COLOR, 
                borderRadius: '50%', 
                border: '3px solid',
                borderColor: isDark ? CARD_BG_DARK : 'background.paper',
                boxSizing: 'border-box'
              }}
            >
              <Crown size={16} color={ON_ACCENT} />
            </Box>
          </Box>

          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, pb: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 0.5 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {salon.name}
              </Typography>
              <CheckCircle2 size={24} color={ACCENT_COLOR} fill={ACCENT_COLOR} />
            </Stack>
            
            <Stack direction="row" spacing={2.5} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 2 }}>
              <Typography sx={{ color: ACCENT_COLOR, fontWeight: 900, letterSpacing: '0.15em', fontSize: '11px' }}>
                @{salon.handle?.toUpperCase()}
              </Typography>
              
              {/* Social Icons */}
              <Stack direction="row" spacing={1}>
                {(salon.socials?.instagram ?? salon.instagram) && (
                  <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: ACCENT_COLOR } }} 
                    component="a" 
                    href={(() => {
                      const v = (salon.socials?.instagram ?? salon.instagram) as string;
                      return v.startsWith('http') ? v : `https://instagram.com/${v.replace(/^@/, '')}`;
                    })()} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={16} />
                  </IconButton>
                )}
                {(salon.socials?.facebook ?? salon.facebook) && (
                  <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: ACCENT_COLOR } }} 
                    component="a" 
                    href={(() => {
                      const v = (salon.socials?.facebook ?? salon.facebook) as string;
                      return v.startsWith('http') ? v : `https://facebook.com/${v.replace(/^\//, '')}`;
                    })()} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={16} />
                  </IconButton>
                )}
                {(salon.socials?.website ?? salon.website) && (
                  <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: ACCENT_COLOR } }} 
                    component="a" 
                    href={(salon.socials?.website ?? salon.website) as string} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe size={16} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
            
            {/* Stats / Info Row */}
            <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Star size={14} fill={ACCENT_COLOR} color={ACCENT_COLOR} />
                <Typography sx={{ fontWeight: 900, color: 'text.primary', fontSize: '13px' }}>{salon.rating}</Typography>
                <Typography sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '12px', fontWeight: 700 }}>({salon.reviewsCount})</Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Clock size={14} color={ACCENT_COLOR} />
                <Typography sx={{ fontWeight: 800, fontSize: '12px', color: 'text.primary' }}>{currentOpenStatus}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <MapPin size={14} color="#94A3B8" />
                <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '12px' }}>
                  {salon.address?.split(',')[0]}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};