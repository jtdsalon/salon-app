import React from 'react';
import { Stack, Typography, Box, TextField, InputAdornment, Button, alpha, useTheme } from '@mui/material';
import { Search, Plus } from 'lucide-react';

interface VacanciesHeaderProps {
  count: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
  isDark: boolean;
}

const VacanciesHeader: React.FC<VacanciesHeaderProps> = ({ count, searchQuery, onSearchChange, onAddNew, isDark }) => {
  const theme = useTheme();

  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      justifyContent="space-between" 
      alignItems={{ xs: 'flex-start', md: 'center' }} 
      spacing={2} 
      sx={{ mb: 6 }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="h1" sx={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' } }}>
          Job <span className="gold-gradient-text">Openings</span>
        </Typography>
        <Box sx={{ 
          bgcolor: alpha('#EAB308', 0.15), 
          color: '#EAB308', 
          px: 1, 
          py: 0.2, 
          borderRadius: '6px', 
          fontWeight: 900, 
          fontSize: '12px',
          border: '1px solid',
          borderColor: alpha('#EAB308', 0.3)
        }}>
          {count}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: { xs: '100%', md: 180 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: isDark ? alpha('#FFFFFF', 0.03) : alpha('#000', 0.02),
              border: 'none',
              height: 38,
              '& fieldset': { border: 'none' }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={14} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<Plus size={14} />}
          onClick={onAddNew}
          sx={{ 
            borderRadius: '10px', 
            bgcolor: isDark ? 'white' : '#050914', 
            color: isDark ? '#050914' : 'white', 
            fontWeight: 800,
            px: 2,
            height: 38,
            fontSize: '12px',
            '&:hover': { bgcolor: isDark ? '#F1F5F9' : '#1e293b' }
          }}
        >
          New Job
        </Button>
      </Stack>
    </Stack>
  );
};

export default VacanciesHeader;
