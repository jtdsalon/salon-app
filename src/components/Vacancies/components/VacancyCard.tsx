import React from 'react';
import { 
  Paper, Box, Stack, Typography, Grid2, IconButton, Chip, Collapse, Button, alpha, useTheme, Tooltip, Divider 
} from '@mui/material';
import { PenLine, Trash, Mail, Phone, MapPin } from 'lucide-react';
import { Vacancy } from '../types';

interface VacancyCardProps {
  vacancy: Vacancy;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleStatus: (vacancy: Vacancy) => void;
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
  isDeleting?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({ 
  vacancy, index, isExpanded, onToggleExpand, onToggleStatus, onEdit, onDelete, isDark, isDeleting 
}) => {
  const theme = useTheme();
  const isOpen = vacancy.status === 'Open';

  // Helper to check if string contains HTML
  const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: { xs: '12px', md: '16px' },
        overflow: 'hidden',
        bgcolor: isDark ? '#0B1224' : 'white',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'divider',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isOpen ? 1 : 0.85,
        maxWidth: '100%',
        minWidth: 0,
        '&:hover': {
          borderColor: '#EAB308',
          boxShadow: isDark ? '0 12px 24px -12px rgba(0,0,0,0.4)' : '0 8px 16px -8px rgba(0,0,0,0.05)',
          '& .vacancy-floating-actions': { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Floating Actions */}
      <Stack 
        className="vacancy-floating-actions"
        direction="row" 
        spacing={0.5} 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 10,
          opacity: { xs: 1, md: 0 },
          transform: { xs: 'none', md: 'translateY(-2px)' },
          transition: 'all 0.2s ease'
        }}
      >
        <Tooltip title="Delete Job Posting">
          <IconButton 
            onClick={() => onDelete(vacancy.id)}
            disabled={isDeleting}
            size="small"
            sx={{ 
              width: 24, height: 24, borderRadius: '6px', 
              bgcolor: isDark ? alpha('#F43F5E', 0.08) : alpha('#F43F5E', 0.05),
              color: '#F43F5E',
              '&:hover': { bgcolor: '#F43F5E', color: 'white' },
              '&:disabled': { opacity: 0.5, cursor: 'not-allowed' }
            }}
          >
            <Trash size={10} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Index Column */}
        <Box sx={{ 
          width: { xs: '100%', lg: 60 }, 
          bgcolor: isDark ? alpha('#FFFFFF', 0.01) : alpha('#000', 0.01),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: { lg: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'divider'}` },
          py: { xs: 1, lg: 0 }
        }}>
          <Typography sx={{ fontWeight: 900, fontSize: '18px', opacity: 0.1 }}>
            {String(index + 1).padStart(2, '0')}
          </Typography>
        </Box>

        {/* Content Column */}
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, flex: 1, pr: { md: 4 }, minWidth: 0 }}>
          <Grid2 container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 7.5 }}>
              <Stack spacing={0.2} sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.15rem' }, color: isDark ? 'white' : '#0F172A', wordBreak: 'break-word' }}>
                    {vacancy.title}
                  </Typography>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isOpen ? '#10B981' : '#F43F5E', boxShadow: `0 0 8px ${isOpen ? '#10B981' : '#F43F5E'}` }} />
                </Stack>
                
                <Box sx={{ position: 'relative' }}>
                  <Collapse in={isExpanded} collapsedSize={35}>
                    {isHtml(vacancy.description) ? (
                      <Typography 
                        variant="body2" 
                        component="div"
                        sx={{ 
                          color: 'text.secondary', 
                          lineHeight: 1.5, 
                          fontWeight: 500,
                          fontSize: '12.5px',
                          '& p': { mb: 0.5 },
                          maskImage: !isExpanded ? 'linear-gradient(to bottom, black 40%, transparent 100%)' : 'none'
                        }}
                        dangerouslySetInnerHTML={{ __html: vacancy.description }}
                      />
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                          lineHeight: 1.5, 
                          fontWeight: 500,
                          fontSize: '12.5px',
                          whiteSpace: 'pre-wrap',
                          maskImage: !isExpanded ? 'linear-gradient(to bottom, black 40%, transparent 100%)' : 'none'
                        }}
                      >
                        {vacancy.description}
                      </Typography>
                    )}
                  </Collapse>
                  
                  <Button 
                    size="small"
                    onClick={() => onToggleExpand(vacancy.id)}
                    sx={{ 
                      mt: 0.5, 
                      color: '#EAB308', 
                      fontWeight: 800, 
                      fontSize: '10px',
                      px: 0,
                      minWidth: 'auto',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                  >
                    {isExpanded ? 'Hide Details' : 'View Description'}
                  </Button>
                </Box>
              </Stack>

              <Stack direction="row" spacing={0.8} flexWrap="wrap" gap={0.8} sx={{ mb: 2, minWidth: 0 }}>
                {vacancy.requirements.map((req, i) => (
                  <Chip
                    key={i}
                    label={req}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: '6px',
                      fontSize: { xs: '8px', md: '9px' },
                      fontWeight: 700,
                      height: { xs: 18, md: 20 },
                      maxWidth: '100%',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider'
                    }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={2.5} flexWrap="wrap" gap={1} sx={{ minWidth: 0 }}>
                {vacancy.contactEmail && (
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0, maxWidth: '100%' }}>
                    <Mail size={12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: { xs: '10px', md: '11px' }, wordBreak: 'break-all' }}>{vacancy.contactEmail}</Typography>
                  </Stack>
                )}
                {vacancy.contactPhone && (
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                    <Phone size={12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: { xs: '10px', md: '11px' }, wordBreak: 'break-all' }}>{vacancy.contactPhone}</Typography>
                  </Stack>
                )}
                {vacancy.address && (
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0, maxWidth: '100%' }}>
                    <MapPin size={12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: { xs: '10px', md: '11px' }, wordBreak: 'break-word' }}>{vacancy.address}</Typography>
                  </Stack>
                )}
              </Stack>
            </Grid2>

            {/* Sidebar Column */}
            <Grid2 size={{ xs: 12, md: 4.5 }}>
              <Stack spacing={2} sx={{ borderLeft: { md: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'divider'}` }, pl: { md: 3 }, pt: { xs: 1, md: 0 }, borderTop: { xs: `1px dashed ${isDark ? 'rgba(255,255,255,0.06)' : 'divider'}`, md: 'none' } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={{ xs: 1.5, sm: 1 }}
                  sx={{ minWidth: 0 }}
                >
                  <Typography sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Status: <Box component="span" sx={{ color: isOpen ? '#10B981' : '#F43F5E' }}>{isOpen ? 'Active' : 'Closed'}</Box>
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexShrink: 0, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Tooltip title="Edit Job">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(vacancy)}
                        sx={{
                          width: { xs: 36, md: 32 },
                          height: { xs: 36, md: 32 },
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider',
                          color: isDark ? 'white' : '#0F172A',
                          '&:hover': { bgcolor: alpha('#EAB308', 0.1), color: '#EAB308', borderColor: '#EAB308' }
                        }}
                      >
                        <PenLine size={14} />
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      variant="contained"
                      disableElevation
                      onClick={() => onToggleStatus(vacancy)}
                      sx={{
                        fontSize: { xs: '11px', md: '10px' },
                        fontWeight: 900,
                        borderRadius: '8px',
                        height: { xs: 36, md: 32 },
                        px: { xs: 2, md: 1.5 },
                        bgcolor: isOpen ? '#F43F5E' : '#10B981',
                        color: 'white',
                        flex: { xs: 1, sm: '0 0 auto' },
                        minWidth: 0,
                        '&:hover': {
                          bgcolor: isOpen ? '#E11D48' : '#059669',
                        }
                      }}
                    >
                      {isOpen ? 'Close job' : 'Open job'}
                    </Button>
                  </Stack>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed', opacity: 0.5 }} />

                {/* Details Grid2 */}
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Experience</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{vacancy.experience || 'Flexible'}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Salary Range</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{vacancy.salaryRange || 'NDA'}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Job Type</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{vacancy.type}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Posted On</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{vacancy.postedDate}</Typography>
                  </Grid2>
                </Grid2>
              </Stack>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Paper>
  );
};

export default VacancyCard;