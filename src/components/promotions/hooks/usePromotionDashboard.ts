import { useState, useEffect, useCallback } from 'react';
import { usePromotion } from '@/state/promotion';
import { mapApiPromotionToCard } from '@/services/api/promotionService';

export function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  const e = err as { errorMessage?: string; response?: { data?: { message?: string } }; message?: string };
  return e?.errorMessage || e?.response?.data?.message || e?.message || 'An error occurred';
}

export interface UsePromotionDashboardProps {
  salonId: string | null | undefined;
}

export function usePromotionDashboard({ salonId }: UsePromotionDashboardProps) {
  const {
    promotionList,
    loading: isLoading,
    error: promotionError,
    handleGetPromotions,
    handleUpdatePromotion,
    handleDeletePromotion,
    handleClearError,
  } = usePromotion();

  const [viewMode, setViewMode] = useState<'grid2' | 'table' | 'analytics'>('grid2');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    if (salonId) {
      handleGetPromotions(salonId, { status: 'all', page: 1, limit: 100 });
    }
  }, [salonId, handleGetPromotions]);

  const handleRefresh = useCallback(() => {
    if (salonId) {
      handleGetPromotions(salonId, { status: 'all', page: 1, limit: 100 });
    }
  }, [salonId, handleGetPromotions]);

  const [viewDetailsPromo, setViewDetailsPromo] = useState<import('@/services/api/promotionService').PromotionCardData | null>(null);
  const [duplicateFromId, setDuplicateFromId] = useState<string | null>(null);

  const handleEdit = useCallback((idOrPromo: string | { id: string }) => setEditingId(typeof idOrPromo === 'string' ? idOrPromo : idOrPromo.id), []);
  const handleDelete = useCallback((id: string) => setDeleteConfirmId(id), []);
  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirmId) return;
    handleDeletePromotion(deleteConfirmId);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, handleDeletePromotion]);

  const handleToggleStatus = useCallback(
    (id: string, isActive: boolean) => {
      handleUpdatePromotion(id, { is_active: isActive });
    },
    [handleUpdatePromotion]
  );

  const handleViewDetails = useCallback((promo: import('@/services/api/promotionService').PromotionCardData) => {
    setViewDetailsPromo(promo);
  }, []);
  const handleCloseViewDetails = useCallback(() => setViewDetailsPromo(null), []);
  const handleDuplicate = useCallback((promo: { id: string }) => {
    setEditingId(null);
    setDuplicateFromId(promo.id);
    setIsCreating(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => setDeleteConfirmId(null), []);
  const handleStartCreating = useCallback(() => {
    setDuplicateFromId(null);
    setIsCreating(true);
  }, []);
  const handleCancelCreateEdit = useCallback(() => {
    setIsCreating(false);
    setEditingId(null);
    setDuplicateFromId(null);
  }, []);
  const handleSaveComplete = useCallback(() => {
    setIsCreating(false);
    setEditingId(null);
    setDuplicateFromId(null);
    handleRefresh();
  }, [handleRefresh]);

  const filteredPromotions = (promotionList || [])
    .map(mapApiPromotionToCard)
    .filter((promo) => {
      const matchesSearch = promo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'All' || promo.type === filterType;
      return matchesSearch && matchesFilter;
    });

  const showCreateOrEdit = (isCreating || editingId || duplicateFromId) && salonId;

  return {
    // State
    promotionList,
    isLoading,
    promotionError,
    viewMode,
    setViewMode,
    isCreating,
    editingId,
    duplicateFromId,
    deleteConfirmId,
    viewDetailsPromo,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredPromotions,
    showCreateOrEdit,

    // Actions
    handleRefresh,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleToggleStatus,
    handleViewDetails,
    handleCloseViewDetails,
    handleDuplicate,
    handleCloseDeleteDialog,
    handleStartCreating,
    handleCancelCreateEdit,
    handleSaveComplete,
    handleClearError,
  };
}
