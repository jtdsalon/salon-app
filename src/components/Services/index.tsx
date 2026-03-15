import React, { useState, useEffect } from 'react';

export { ServiceMenuView } from './ServiceMenuView';
export { ServiceModal } from './ServiceModal';
export type { ServiceMenuItem } from './types';
export type { ServiceFormData } from './ServiceModal';
export { ServiceMenuCategories } from './constants';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useAuthContext } from '@/state/auth';
import { useService } from '@/state/service';
import { ServiceMenuView } from './ServiceMenuView';
import { ServiceModal } from './ServiceModal';
import type { ServiceMenuItem } from './types';

export default function Services() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const salonId = user?.salonId ?? null;

  const {
    serviceList,
    loading,
    creating,
    updating,
    error,
    success,
    successMessage,
    handleGetServices,
    handleCreateService,
    handleUpdateService,
    handleDeleteService,
    handleClearSuccess,
    handleClearError,
  } = useService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceMenuItem | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceMenuItem & { images?: (File | string)[] }>>({
    name: '',
    price: 0,
    duration_minutes: 30,
    category: 'Hair',
    description: '',
  });

  useEffect(() => {
    if (salonId) handleGetServices(salonId);
  }, [salonId, handleGetServices]);

  const handleOpenModal = (service?: ServiceMenuItem) => {
    if (service) {
      const fullService = (serviceList ?? []).find((s) => s.id === service.id) as (typeof serviceList)[0] & { images?: string[] };
      const images = (fullService as any)?.images ?? (service as { images?: string[] }).images;
      const imagesList = Array.isArray(images) ? [...images] : [];
      setEditingService(service);
      setFormData({
        id: service.id,
        name: service.name,
        price: service.price,
        duration_minutes: service.duration_minutes ?? service.duration ?? 30,
        duration: service.duration ?? service.duration_minutes ?? 30,
        buffer_minutes: (fullService as any)?.buffer_minutes ?? 0,
        category: service.category,
        description: (fullService as any)?.description ?? service.description ?? '',
        images: imagesList,
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', price: 0, duration_minutes: 30, buffer_minutes: 0, category: 'Hair', description: '', images: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleClearSuccess();
    handleClearError();
  };

  const handleSaveService = () => {
    const name = (formData.name ?? '').toString().trim();
    const price = Number(formData.price);
    if (!name || Number.isNaN(price)) return;
    const duration = Number(formData.duration_minutes ?? formData.duration ?? 30);
    const category = (formData.category ?? 'Hair').toString();
    const description = (formData.description ?? '').toString().trim();
    const images = (formData as any).images ?? [];

    const buffer_minutes = Number(formData.buffer_minutes);
    const payload: any = {
      name,
      price,
      duration_minutes: duration,
      duration,
      buffer_minutes: Number.isNaN(buffer_minutes) ? 0 : Math.max(0, buffer_minutes),
      category,
      description: description || undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (editingService) {
      handleUpdateService(editingService.id, payload);
    } else if (salonId) {
      handleCreateService({ salon_id: salonId, ...payload });
    }
  };

  const handleDelete = () => {
    if (serviceToDelete) {
      handleDeleteService(serviceToDelete);
      setIsDeleteConfirmOpen(false);
      setServiceToDelete(null);
    }
  };

  const menuItems: ServiceMenuItem[] = (serviceList ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    category: s.category,
    duration_minutes: s.duration_minutes,
    duration: (s as { duration?: number }).duration,
    popularity: (s as { popularity?: number }).popularity,
    description: s.description,
    images: (s as { images?: string[] }).images,
  }));

  return (
    <Box sx={{ pb: 8 }} className="animate-fadeIn">
      <ServiceMenuView
        services={menuItems}
        theme={{ palette: {} }}
        onEdit={(service) => handleOpenModal(service)}
        onDelete={(id) => {
          setServiceToDelete(id);
          setIsDeleteConfirmOpen(true);
        }}
        onAdd={() => handleOpenModal()}
      />

      <ServiceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        editingService={editingService}
        serviceFormData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveService}
        loading={loading}
        creating={creating}
        updating={updating}
        error={error}
        success={success}
        successMessage={successMessage}
      />

      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: '24px', p: 1, maxWidth: { xs: 'calc(100vw - 32px)', sm: 320 }, width: { xs: '100%', sm: 'auto' } } }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Box sx={{ color: '#ef4444', mb: 1 }}>
            <AlertTriangle size={40} style={{ margin: '0 auto' }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Delete this service?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" align="center">
            This will remove the service from your menu. Existing bookings are not affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setIsDeleteConfirmOpen(false)} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              bgcolor: '#ef4444',
              color: 'white',
              borderRadius: '100px',
              px: 2,
              fontWeight: 800,
              '&:hover': { bgcolor: '#dc2626' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
