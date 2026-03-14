import React from 'react';
import { Box, Fade } from '@mui/material';
import { Service, Staff, Branch, FeedPost } from '../types';
import { RitualMenuTab } from './Tabs/RitualMenuTab';
import { ArtisansTab } from './Tabs/ArtisansTab';
import { BranchesTab } from './Tabs/BranchesTab';
import { ReviewsTab } from './Tabs/ReviewsTab';
import { SettingsTab } from './Tabs/SettingsTab';

interface TabContentProps {
  activeTab: number;
  salonId: string | null | undefined;
  salonRating: number;
  salonReviewsCount: number;
  services: Service[];
  staffList: Staff[];
  branches: Branch[];
  posts: FeedPost[];
  theme: any;
  modalState: any;
  setEditingService: (service: Service | null) => void;
  setServiceFormData: (data: any) => void;
  setServiceToDelete: (id: string | null) => void;
  setEditingStaff: (staff: Staff | null) => void;
  setStaffFormData: (data: any) => void;
  setStaffToDelete: (id: string | null) => void;
  setEditingBranch: (branch: Branch | null) => void;
  setBranchFormData: (data: any) => void;
  handleUpdatePost: (posts: FeedPost[]) => void;
  handleDeletePost: (posts: FeedPost[]) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  salonId,
  salonRating,
  salonReviewsCount,
  services,
  staffList,
  branches,
  posts,
  theme,
  modalState,
  setEditingService,
  setServiceFormData,
  setServiceToDelete,
  setEditingStaff,
  setStaffFormData,
  setStaffToDelete,
  setEditingBranch,
  setBranchFormData,
  handleUpdatePost,
  handleDeletePost,
}) => {
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Fade in={true}>
        <Box sx={{ minWidth: 0 }}>
          {activeTab === 0 && (
            <RitualMenuTab
              services={services}
              theme={theme}
              onEdit={(service) => {
                setEditingService(service);
                setServiceFormData(service);
                modalState.setIsServiceModalOpen(true);
              }}
              onDelete={(id) => {
                setServiceToDelete(id);
                modalState.setIsDeleteConfirmOpen(true);
              }}
              onAdd={() => {
                setEditingService(null);
                setServiceFormData({});
                modalState.setIsServiceModalOpen(true);
              }}
            />
          )}

          {activeTab === 1 && (
            <ArtisansTab
              staffList={staffList}
              theme={theme}
              onEdit={(staff) => {
                setEditingStaff(staff);
                setStaffFormData(staff);
                modalState.setIsStaffModalOpen(true);
              }}
              onDelete={(id) => {
                setStaffToDelete(id);
                modalState.setIsStaffDeleteOpen(true);
              }}
              onAdd={() => {
                setEditingStaff(null);
                setStaffFormData({});
                modalState.setIsStaffModalOpen(true);
              }}
            />
          )}

          {activeTab === 2 && (
            <BranchesTab
              branches={branches}
              theme={theme}
              onEdit={(branch) => {
                setEditingBranch(branch);
                setBranchFormData(branch);
                modalState.setIsBranchModalOpen(true);
              }}
              onAdd={() => {
                setEditingBranch(null);
                setBranchFormData({});
                modalState.setIsBranchModalOpen(true);
              }}
            />
          )}

          {activeTab === 3 && (
            <ReviewsTab
              salonId={salonId}
              salonRating={salonRating}
              salonReviewsCount={salonReviewsCount}
              theme={theme}
            />
          )}

          {activeTab === 4 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <p>Archive section coming soon</p>
            </Box>
          )}

          {activeTab === 5 && (
            <SettingsTab
              salonId={salonId}
              theme={theme}
            />
          )}
        </Box>
      </Fade>
    </Box>
  );
};
