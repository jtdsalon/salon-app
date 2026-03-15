import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { ACCENT_COLOR } from '@/lib/constants/theme';

export const HeroSection: React.FC = () => {
    return (
        <Box sx={{
            flex: 1.2,
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            bgcolor: '#0F172A'
        }}>
            <Box
                component="img"
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1400&auto=format&fit=crop"
                alt="Salon interior"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
            />
            <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.8), transparent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: 10
            }}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                            width: 48,
                            height: 48,
                            bgcolor: ACCENT_COLOR,
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles color="white" size={24} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'white' }}>
                            GlowSalon Pro
                        </Typography>
                    </Stack>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', maxWidth: 500, letterSpacing: '-0.04em' }}>
                        The Modern <Box component="span" sx={{ color: ACCENT_COLOR }}>Salon</Box> Management Platform
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)', maxWidth: 400 }}>
                        Manage bookings, staff, and grow your salon business with smart tools.
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
};