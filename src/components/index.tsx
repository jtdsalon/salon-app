import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AuthView } from './Auth';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                    primary: {
                        main: mode === 'light' ? '#0F172A' : '#F8FAFC',
                    },
                    secondary: {
                        main: '#B59410',
                    },
                    error: {
                        main: '#F43F5E',
                    },
                    background: {
                        default: mode === 'light' ? '#fcfcfc' : '#020617',
                        paper: mode === 'light' ? '#ffffff' : '#0F172A',
                    },
                    text: {
                        primary: mode === 'light' ? '#0F172A' : '#F1F5F9',
                        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
                    },
                    success: {
                        main: '#10B981',
                    },
                    divider: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                    action: {
                        selected: mode === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(248, 250, 252, 0.05)',
                        hover: mode === 'light' ? 'rgba(15, 23, 42, 0.03)' : 'rgba(248, 250, 252, 0.03)',
                    }
                },
                typography: {
                    fontFamily: '"Inter", "sans-serif"',
                    h3: {
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                    },
                    h4: {
                        fontWeight: 900,
                    },
                },
                shape: {
                    borderRadius: 24,
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthView onLogin={() => {
                navigate('/dashboard', { replace: true });
            }} />
        </ThemeProvider>
    );
};

export default Main;
