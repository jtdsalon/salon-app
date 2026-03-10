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
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            fontWeight: 800,
            fontSize: '13px',
            minWidth: 120,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
            '&.Mui-selected': { color: '#EAB308' },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#EAB308',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
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
