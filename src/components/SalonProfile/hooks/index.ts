import { useState, useMemo, useCallback } from 'react';
import { DAYS } from '../constants';
import { Service, Staff, Branch, FeedPost, OperatingHour } from '../types';
import { updateSalonProfileApi, updateOperatingHoursApi } from '../../../services/api/salonService';

// Local type definition for Salon
interface Salon {
  id?: string;
  name: string;
  handle: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  address: string;
  cover: string;
  avatar: string;
  hours: any[];
}

export const useSalonProfile = () => {
  // Initialize with empty state - data MUST come from Redux/backend only
  const [salon, setSalon] = useState<Salon>({
    id: undefined,
    name: "",
    handle: "",
    bio: "",
    rating: 0,
    reviewsCount: 0,
    address: "",
    cover: "",
    avatar: "",
    hours: [] // Start empty - no fallback defaults
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  // Loading and error states
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Update salon profile with backend
  const updateProfile = useCallback(async (profileData: Partial<Salon>) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await updateSalonProfileApi(salon.id || 'default', {
        name: profileData.name || salon.name,
        handle: profileData.handle || salon.handle,
        bio: profileData.bio || salon.bio,
        address: profileData.address || salon.address,
        avatar: profileData.avatar || salon.avatar,
        cover: profileData.cover || salon.cover,
        hours: profileData.hours || salon.hours, // Include hours in profile update
      });

      // Update local state with server response
      setSalon((prev: Salon) => ({ ...prev, ...response.data.data }));
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      return response.data.data;
    } catch (error: any) {
      // API client interceptor rejects with { code, errorMessage, errors }, not error.response.data
      const backend = error.response?.data ?? error;
      const defaultMessage = backend?.message ?? backend?.errorMessage ?? 'Failed to update profile';
      let friendlyMessage = defaultMessage;

      if (backend?.code === 'VALIDATION_ERROR' && Array.isArray(backend.errors) && backend.errors.length) {
        const fieldMessages = backend.errors.map((e: any) => {
          const rawField = e.field || 'field';
          const normalizedField =
            rawField === 'avatar'
              ? 'Logo'
              : rawField === 'cover'
              ? 'Cover image'
              : rawField === 'area'
              ? 'Area'
              : rawField.charAt(0).toUpperCase() + rawField.slice(1);
          const cleanMessage = typeof e.message === 'string' ? e.message.replace(/"/g, '') : '';
          return cleanMessage ? `${normalizedField}: ${cleanMessage}` : normalizedField;
        });
        friendlyMessage = fieldMessages.join('\n');
      }

      setUpdateError(friendlyMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [salon.id, salon.name, salon.handle, salon.bio, salon.address, salon.avatar, salon.cover, salon.hours]);

  // Update operating hours with backend
  const updateOperatingHours = useCallback(async (hours: OperatingHour[]) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await updateOperatingHoursApi(salon.id || 'default', hours);
      
      // Update local state with server response
      setSalon((prev: Salon) => ({ ...prev, hours: hours }));
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update operating hours';
      setUpdateError(message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [salon.id]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setUpdateError(null);
    setUpdateSuccess(false);
  }, []);

  return {
    salon,
    setSalon,
    branches,
    setBranches,
    services,
    setServices,
    staffList,
    setStaffList,
    posts,
    setPosts,
    isUpdating,
    updateError,
    updateSuccess,
    updateProfile,
    updateOperatingHours,
    clearMessages
  };
};

export const useModalState = () => {
  const [isSalonEditOpen, setIsSalonEditOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStaffDeleteOpen, setIsStaffDeleteOpen] = useState(false);

  return {
    isSalonEditOpen, setIsSalonEditOpen,
    isServiceModalOpen, setIsServiceModalOpen,
    isStaffModalOpen, setIsStaffModalOpen,
    isBranchModalOpen, setIsBranchModalOpen,
    isDeleteConfirmOpen, setIsDeleteConfirmOpen,
    isStaffDeleteOpen, setIsStaffDeleteOpen
  };
};

export const useCurrentOpenStatus = (operatingHours: OperatingHour[]) => {
  return useMemo(() => {
    if (!operatingHours || operatingHours.length === 0) return 'LOADING...';
    const todayIndex = (new Date().getDay() + 6) % 7;
    const todaySchedule = operatingHours[todayIndex];
    if (!todaySchedule.isOpen) return 'CLOSED TODAY';
    return `OPEN: ${todaySchedule.open} - ${todaySchedule.close}`;
  }, [operatingHours]);
};