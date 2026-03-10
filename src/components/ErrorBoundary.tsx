import React, { ReactNode } from 'react';
import { Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const theme = createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#0F172A' },
          background: { default: '#fcfcfc', paper: '#ffffff' },
        },
      });

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              {this.state.error?.message}
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxWidth: 600 }}>
              {this.state.error?.stack}
            </Typography>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                backgroundColor: '#0F172A',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Reload Page
            </button>
          </Box>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
