import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Sparkles, Users, MapPin, MessageSquare, Archive } from 'lucide-react';

interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: 'Services', icon: Sparkles },
    { label: 'Staff', icon: Users },
    { label: 'Branches', icon: MapPin },
    { label: 'Reviews', icon: MessageSquare },
    { label: 'Archive', icon: Archive },
  ];

  return (
    <Box sx={{ mb: { xs: 2, md: 3 }, borderBottom: '1.5px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: { xs: 48, sm: 64 },
          '& .MuiTab-root': {
            minWidth: { xs: 72, sm: 90, md: 120 },
            fontWeight: 800,
            fontSize: { xs: '11px', sm: '12px', md: '13px' },
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
            '&.Mui-selected': { color: '#EAB308' },
            px: { xs: 1, sm: 1.5, md: 2 },
          },
          '& .MuiTab-iconWrapper': { mb: 0 },
          '& .MuiTabs-indicator': {
            backgroundColor: '#EAB308',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
          '& .MuiTabs-scrollButtons': { color: 'text.secondary' },
        }}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={index}
              icon={<Icon size={18} />}
              iconPosition="start"
              label={tab.label}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};
