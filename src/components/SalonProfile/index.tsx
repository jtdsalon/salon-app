import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, useMediaQuery, Box } from '@mui/material';

import { useSalonProfile, useModalState, useCurrentOpenStatus } from './hooks';
import { useSalonData, useSalonDataSync } from './hooks/useSalonData';
import { useSalonProfileRedux } from './hooks/useSalonProfileRedux';
import { useStaff } from '../../state/staff/useStaff';
import { useService } from '../../state/service/useService';
import { useBranch } from '../../state/branch/useBranch';
import { SalonHeader } from './components/SalonHeader';
import { SalonEditDialog, DeleteConfirmationDialog } from './dialogs';
import { ServiceModal } from '@/components/Services';
import { BranchModal } from './components/Modals/BranchModal';
import { StaffModal } from './components/Modals/StaffModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { HeaderSection } from './components/HeaderSection';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';
import { RootState } from '../../state/store';
import { getSalon } from '../../state/salon';
import {
  handleSaveSalon,
  handleSaveService,
  handleDeleteService as confirmServiceDelete,
  handleDelete,
  handleSaveStaff,
  handleSaveBranch,
  handleStaffDelete,
  handleImageUpload,
  handleOpenSalonEdit,
} from './utils/salonHandlers';
import { isSalonProfileComplete } from '@/lib/onboarding';

interface SalonProfileProps {
  salonId?: string | null;
  onBack: () => void;
  openSalonEditOnMount?: boolean;
}

const SalonProfile: React.FC<SalonProfileProps> = ({ salonId, onBack, openSalonEditOnMount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  // Redux hooks
  const {
    salon: reduxSalon,
    updating: reduxUpdating,
    updateError: reduxUpdateError,
    success: reduxSuccess,
    handleUpdateProfile,
    handleClearSuccess,
  } = useSalonProfileRedux();

  // Staff state management with Redux Saga
  const {
    staffList,
    loading: staffLoading,
    creating: staffCreating,
    updating: staffUpdating,
    deleting: staffDeleting,
    error: staffError,
    success: staffSuccess,
    successMessage: staffSuccessMessage,
    handleGetStaff,
    handleCreateStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleClearSuccess: handleClearStaffSuccess,
    handleClearError: handleClearStaffError,
  } = useStaff();

  // Service state management with Redux Saga
  const {
    serviceList,
    loading: serviceLoading,
    creating: serviceCreating,
    updating: serviceUpdating,
    deleting: serviceDeleting,
    error: serviceError,
    success: serviceSuccess,
    successMessage: serviceSuccessMessage,
    handleGetServices,
    handleCreateService,
    handleUpdateService,
    handleDeleteService,
    handleClearSuccess: handleClearServiceSuccess,
    handleClearError: handleClearServiceError,
  } = useService();

  // Branch state management with Redux Saga
  const {
    branchList,
    loading: branchLoading,
    creating: branchCreating,
    updating: branchUpdating,
    deleting: branchDeleting,
    error: branchError,
    success: branchSuccess,
    successMessage: branchSuccessMessage,
    handleGetBranches,
    handleCreateBranch,
    handleUpdateBranch,
    handleDeleteBranch,
    handleClearSuccess: handleClearBranchSuccess,
    handleClearError: handleClearBranchError,
  } = useBranch();

  // Local state hooks
  const {
    salon,
    setSalon,
    branches,
    setBranches,
    services,
    setServices,
    staffList: localStaffList,
    setStaffList,
    posts,
    setPosts,
    salonFormData,
    setSalonFormData,
    imagePreviewUrls,
    setImagePreviewUrls,
    serviceToDelete,
    setServiceToDelete,
    staffToDelete,
    setStaffToDelete,
    editingService,
    setEditingService,
    serviceFormData,
    setServiceFormData,
    editingStaff,
    setEditingStaff,
    staffFormData,
    setStaffFormData,
    editingBranch,
    setEditingBranch,
    branchFormData,
    setBranchFormData,
    isProcessingImage,
    setIsProcessingImage,
    avatarInputRef,
    coverInputRef,
  } = useSalonData();

  const modalState = useModalState();
  const currentOpenStatus = useCurrentOpenStatus(salon.hours);
  const hasOpenedEditOnMount = useRef(false);

  // Doc §3 & §3.2: Open salon edit dialog when arriving from verification, or when profile is incomplete (login without completing)
  const shouldOpenEditOnMount = openSalonEditOnMount || (reduxSalon && !isSalonProfileComplete(reduxSalon));
  useEffect(() => {
    if (
      shouldOpenEditOnMount &&
      !hasOpenedEditOnMount.current &&
      (reduxSalon?.id || salon?.id)
    ) {
      hasOpenedEditOnMount.current = true;
      handleOpenSalonEdit(modalState, salon, setSalonFormData);
    }
  }, [shouldOpenEditOnMount, reduxSalon?.id, salon?.id, modalState, salon, setSalonFormData]);

  // Effects for data synchronization
  useSalonDataSync({
    salonId,
    reduxSalon,
    reduxSuccess,
    setSalon,
    setSalonFormData,
    modalState,
    handleClearSuccess,
    dispatch
  });

  // Fetch staff, services, and branches when salonId changes or component mounts
  useEffect(() => {
    if (salonId) {
      handleGetStaff(salonId);
      handleGetServices(salonId);
      handleGetBranches(salonId);
    }
  }, [salonId, handleGetStaff, handleGetServices, handleGetBranches]);

  // Sync Redux staff list to local state
  useEffect(() => {
    setStaffList(staffList);
  }, [staffList, setStaffList]);

  // Sync Redux service list to local state
  useEffect(() => {
    setServices(serviceList);
  }, [serviceList, setServices]);

  // Sync Redux branch list to local state
  useEffect(() => {
    setBranches(branchList);
  }, [branchList, setBranches]);

  // Show success message for staff operations
  useEffect(() => {
    if (staffSuccess && staffSuccessMessage) {
      console.log('Staff operation:', staffSuccessMessage);
      handleClearStaffSuccess();
    }
  }, [staffSuccess, staffSuccessMessage, handleClearStaffSuccess]);

  // Show success message for service operations and close modal
  useEffect(() => {
    if (serviceSuccess && serviceSuccessMessage) {
      console.log('Service operation:', serviceSuccessMessage);
      // Close modal and reset form
      setTimeout(() => {
        modalState.setIsServiceModalOpen(false);
        setServiceFormData({});
        setEditingService(null);
        handleClearServiceSuccess();
        handleClearServiceError();
      }, 1500); // Wait for success message to display
    }
  }, [serviceSuccess, serviceSuccessMessage, modalState, handleClearServiceSuccess, handleClearServiceError]);

  // Show success message for branch operations and close modal
  useEffect(() => {
    if (branchSuccess && branchSuccessMessage) {
      console.log('Branch operation:', branchSuccessMessage);
      // Close modal and reset form
      setTimeout(() => {
        modalState.setIsBranchModalOpen(false);
        setBranchFormData({});
        setEditingBranch(null);
        handleClearBranchSuccess();
        handleClearBranchError();
      }, 1500); // Wait for success message to display
    }
  }, [branchSuccess, branchSuccessMessage, modalState, handleClearBranchSuccess, handleClearBranchError]);

  // Loading and error handling
  const salonLoading = useSelector((state: RootState) => state.salon?.loading || false);
  const salonError = useSelector((state: RootState) => state.salon?.error || null);

  if (salonLoading) return <LoadingState />;
  if (salonError && !reduxSalon?.id) return <ErrorState onBack={onBack} salonId={salonId} />;

  return (
    <Box sx={{ pb: 10 }} className="animate-fadeIn">
      <HeaderSection onBack={onBack} />

      {salon.id && (
        <SalonHeader
          salon={salon}
          currentOpenStatus={currentOpenStatus}
          onEditClick={() => handleOpenSalonEdit(modalState, salon, setSalonFormData)}
        />
      )}

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabContent
        activeTab={activeTab}
        salonId={salonId ?? salon?.id}
        salonRating={salon?.rating ?? 0}
        salonReviewsCount={salon?.reviewsCount ?? 0}
        services={services}
        staffList={staffList}
        branches={branches}
        posts={posts}
        theme={theme}
        modalState={modalState}
        setEditingService={setEditingService}
        setServiceFormData={setServiceFormData}
        setServiceToDelete={setServiceToDelete}
        setEditingStaff={setEditingStaff}
        setStaffFormData={setStaffFormData}
        setStaffToDelete={setStaffToDelete}
        setEditingBranch={setEditingBranch}
        setBranchFormData={setBranchFormData}
        handleUpdatePost={setPosts}
        handleDeletePost={setPosts}
      />

      <SalonEditDialog
        open={modalState.isSalonEditOpen}
        onClose={() => {
          modalState.setIsSalonEditOpen(false);
          handleClearSuccess();
        }}
        salonFormData={salonFormData}
        onFormDataChange={setSalonFormData}
        onOperatingHourChange={(index, field, value) => {
          const updatedHours = [...(salonFormData.hours as any[] || [])] as any[];
          if (updatedHours[index]) {
            updatedHours[index] = {
              ...updatedHours[index],
              [field]: value
            };
            setSalonFormData({
              ...salonFormData,
              hours: updatedHours as any
            });
          }
        }}
        onSave={() => handleSaveSalon({
          salonId,
          reduxSalon,
          salonFormData,
          handleUpdateProfile,
        })}
        isProcessingImage={isProcessingImage}
        isUpdating={reduxUpdating}
        updateError={reduxUpdateError}
        updateSuccess={reduxSuccess}
        clearMessages={handleClearSuccess}
        avatarInputRef={avatarInputRef}
        coverInputRef={coverInputRef}
        imagePreviewUrls={imagePreviewUrls}
        onImageUpload={handleImageUpload(setIsProcessingImage, setImagePreviewUrls, setSalonFormData)}
      />

      <DeleteConfirmationDialog
        open={modalState.isDeleteConfirmOpen}
        onClose={() => modalState.setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmServiceDelete(serviceToDelete, salonId, handleDeleteService, setServiceToDelete, modalState)}
        title="Delete Service?"
        message="This action will retire the entry from your active collection. Current records will be preserved."
      />

      <DeleteConfirmationDialog
        open={modalState.isStaffDeleteOpen}
        onClose={() => modalState.setIsStaffDeleteOpen(false)}
        onConfirm={() => handleStaffDelete(staffToDelete, salonId, handleDeleteStaff, setStaffToDelete, modalState)}
        title="Archive Staff Member?"
        message="This action will retire the entry from your active collection. Current records will be preserved."
      />

      <ServiceModal
        open={modalState.isServiceModalOpen}
        onClose={() => {
          modalState.setIsServiceModalOpen(false);
          handleClearServiceError();
        }}
        editingService={editingService}
        serviceFormData={serviceFormData}
        onFormDataChange={setServiceFormData}
        onSave={() => handleSaveService(editingService, serviceFormData, salonId, handleCreateService, handleUpdateService, modalState)}
        loading={serviceLoading}
        creating={serviceCreating}
        updating={serviceUpdating}
        error={serviceError}
        success={serviceSuccess}
        successMessage={serviceSuccessMessage}
      />

      <BranchModal
        open={modalState.isBranchModalOpen}
        onClose={() => {
          modalState.setIsBranchModalOpen(false);
          handleClearBranchError();
        }}
        editingBranch={editingBranch}
        branchFormData={branchFormData}
        onFormDataChange={setBranchFormData}
        onSave={() => handleSaveBranch(editingBranch, branchFormData, salonId, handleCreateBranch, handleUpdateBranch, modalState)}
        loading={branchLoading}
        creating={branchCreating}
        updating={branchUpdating}
        error={branchError}
        success={branchSuccess}
        successMessage={branchSuccessMessage}
      />

      <StaffModal
        open={modalState.isStaffModalOpen}
        onClose={() => {
          modalState.setIsStaffModalOpen(false);
          handleClearStaffError();
        }}
        editingStaff={editingStaff}
        staffFormData={staffFormData}
        onFormDataChange={setStaffFormData}
        onSave={() => handleSaveStaff(editingStaff, staffFormData, salonId, handleCreateStaff, handleUpdateStaff, modalState)}
        loading={staffLoading}
        creating={staffCreating}
        updating={staffUpdating}
        error={staffError}
        success={staffSuccess}
        successMessage={staffSuccessMessage}
      />
    </Box>
  );
};

export default SalonProfile;