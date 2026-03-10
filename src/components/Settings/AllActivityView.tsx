import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthContext } from '@/state/auth';
import { useSettings } from '@/state/settings/useSettings';
import { getActivityIcon, formatActivityDate } from './activityUtils';
import { ROUTES } from '@/routes/routeConfig';

const PAGE_SIZE = 20;

const AllActivityView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const {
    allActivityLog,
    allActivityTotal,
    allActivityLoading,
    allActivityLoadingMore,
    allActivityError,
    getAllActivityLog,
    clearAllActivity,
  } = useSettings();

  useEffect(() => {
    if (user?.id) {
      getAllActivityLog(user.id, PAGE_SIZE, 0, false);
    }
    return () => {
      clearAllActivity();
    };
  }, [user?.id]);

  const handleLoadMore = () => {
    if (user?.id && !allActivityLoadingMore && allActivityLog.length < allActivityTotal) {
      getAllActivityLog(user.id, PAGE_SIZE, allActivityLog.length, true);
    }
  };

  const handleRetry = () => {
    if (user?.id) {
      getAllActivityLog(user.id, PAGE_SIZE, 0, false);
    }
  };

  const hasMore = allActivityLog.length < allActivityTotal;

  return (
    <Box sx={{ pb: 10 }} className="animate-fadeIn">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ChevronLeft size={18} />}
          onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
          sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}
        >
          Back to Settings
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
          All <Box component="span" sx={{ color: '#EAB308' }}>Activity</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Your account activity and sign-in history.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '40px',
          border: '1.5px solid',
          borderColor: 'divider',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0B1224' : 'white'),
        }}
      >
        {allActivityLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : allActivityError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {allActivityError}
          </Alert>
        ) : allActivityLog.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center', fontWeight: 600 }}>
            No activity yet.
          </Typography>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              {allActivityLog.map((item, i) => (
                <ListItem
                  key={item.id}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom: i < allActivityLog.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: '#EAB308' }}>
                    {getActivityIcon(item.action || '', item.targetType || '')}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.action || 'Activity'}
                    secondary={formatActivityDate(item.createdAt)}
                    primaryTypographyProps={{ fontWeight: 800, fontSize: '13px' }}
                    secondaryTypographyProps={{ fontWeight: 600, fontSize: '11px' }}
                  />
                </ListItem>
              ))}
            </List>
            {hasMore && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleLoadMore}
                disabled={allActivityLoadingMore}
                sx={{
                  mt: 3,
                  fontWeight: 900,
                  color: '#EAB308',
                  borderColor: '#EAB308',
                  fontSize: '11px',
                  '&:hover': { borderColor: '#FACC15', bgcolor: 'rgba(234, 179, 8, 0.08)' },
                }}
              >
                {allActivityLoadingMore ? <CircularProgress size={20} /> : 'Load more'}
              </Button>
            )}
            {allActivityTotal > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontWeight: 600 }}>
                Showing {allActivityLog.length} of {allActivityTotal}
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AllActivityView;
