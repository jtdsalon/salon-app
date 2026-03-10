import React, { useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Fade,
  useTheme,
} from '@mui/material';
import { Plus, Pencil, Trash2, Clock, Sparkles } from 'lucide-react';
import { ServiceMenuCategories } from './constants';
import type { ServiceMenuItem } from './types';

export interface ServiceMenuViewProps {
  services: ServiceMenuItem[];
  theme?: { palette?: { text?: { primary?: string; secondary?: string }; secondary?: { main?: string } } };
  onEdit: (service: ServiceMenuItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ServiceMenuView: React.FC<ServiceMenuViewProps> = ({
  services,
  theme: _themeProp,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const theme = useTheme();
  const groupedServices = useMemo(() => {
    if (!services?.length) return {} as Record<string, ServiceMenuItem[]>;
    return services.reduce((acc: Record<string, ServiceMenuItem[]>, service) => {
      const category = service.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {});
  }, [services]);

  return (
    <Fade in>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
              Service Menu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define the services offered at this salon.
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={18} />}
            onClick={onAdd}
            sx={{
              borderRadius: '100px',
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 900,
              px: 3,
              '&:hover': { bgcolor: 'secondary.dark' },
            }}
          >
            Add Service
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {ServiceMenuCategories.map(
            (cat) =>
              groupedServices[cat]?.length > 0 && (
                <Grid item xs={12} md={6} key={cat}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: '32px',
                      border: '1.5px solid',
                      borderColor: 'divider',
                      height: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: 'text.secondary',
                        letterSpacing: '0.2em',
                        mb: 3,
                      }}
                    >
                      {cat.toUpperCase()}
                    </Typography>

                    <Stack spacing={4}>
                      {groupedServices[cat].map((service) => (
                        <Stack
                          key={service.id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '15px', mb: 0.5 }}>
                              {service.name}
                            </Typography>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Clock size={12} color={theme?.palette?.text?.secondary ?? '#64748B'} />
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                                >
                                  {(service.duration_minutes ?? service.duration ?? 0)} MINS
                                </Typography>
                              </Stack>

                              {(service.popularity ?? 0) > 0 && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <Sparkles size={12} color={theme?.palette?.secondary?.main ?? '#B59410'} />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                                  >
                                    {service.popularity}% Popular
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ fontWeight: 900, fontSize: '16px' }}>
                              Rs.{' '}
                              {typeof service.price === 'string'
                                ? Number(service.price).toLocaleString()
                                : (service.price ?? 0).toLocaleString()}
                            </Typography>

                            <Divider orientation="vertical" flexItem sx={{ height: 20 }} />

                            <Stack direction="row">
                              <Tooltip title="Edit Service">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(service)}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: 'text.primary' },
                                  }}
                                >
                                  <Pencil size={16} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Service">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(service.id)}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: '#ef4444' },
                                  }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Fade>
  );
};
