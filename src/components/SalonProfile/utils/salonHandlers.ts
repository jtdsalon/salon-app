import { Service, Staff, Branch } from '../types';
import { optimizeImage } from '../imageProcessor';

export const handleOpenSalonEdit = (
    modalState: any,
    salon: any,
    setSalonFormData: any
) => {
    const socials = salon.socials || {};
    setSalonFormData({
        id: salon.id || "",
        name: salon.name || "",
        handle: salon.handle || "",
        bio: salon.bio || "",
        rating: salon.rating || 0,
        reviewsCount: salon.reviewsCount || 0,
        address: salon.address || "",
        city: salon.city || salon.meta?.city || "",
        area: salon.area || salon.meta?.area || "",
        latitude: salon.latitude ?? undefined,
        longitude: salon.longitude ?? undefined,
        cover: salon.cover || "",
        avatar: salon.avatar || "",
        hours: salon.hours || [],
        category: salon.category || [],
        website: socials.website ?? "",
        facebook: socials.facebook ?? "",
        instagram: socials.instagram ?? "",
        tiktok: socials.tiktok ?? "",
    });
    modalState.setIsSalonEditOpen(true);
};

export const handleSaveSalon = async ({
    salonId,
    reduxSalon,
    salonFormData,
    handleUpdateProfile
}: {
    salonId: string | null | undefined;
    reduxSalon: any;
    salonFormData: any;
    handleUpdateProfile: (id: string, data: any) => void;
}) => {
    const actualSalonId = salonId || reduxSalon?.id;

    if (!actualSalonId) {
        console.error('Cannot update: salonId is missing');
        return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(actualSalonId)) {
        console.error('Invalid salonId format');
        return;
    }

    const lat = salonFormData.latitude;
    const lng = salonFormData.longitude;
    const hasLat = lat != null && lat !== '' && !Number.isNaN(Number(lat));
    const hasLng = lng != null && lng !== '' && !Number.isNaN(Number(lng));
    const avatar = salonFormData.avatar;
    const cover = salonFormData.cover;
    const hasAvatar = avatar != null && avatar !== '' && (typeof avatar === 'string' ? avatar.trim().length > 0 : true);
    const hasCover = cover != null && cover !== '' && (typeof cover === 'string' ? cover.trim().length > 0 : true);

    const profilePayload: Record<string, unknown> = {
        name: salonFormData.name,
        handle: salonFormData.handle,
        bio: salonFormData.bio,
        address: salonFormData.address,
        city: salonFormData.city,
        area: salonFormData.area,
        category: salonFormData.category,
        hours: salonFormData.hours,
        socials: {
            website: (salonFormData.website || "").trim() || undefined,
            facebook: (salonFormData.facebook || "").trim() || undefined,
            instagram: (salonFormData.instagram || "").trim() || undefined,
            tiktok: (salonFormData.tiktok || "").trim() || undefined,
        },
    };
    if (hasLat) profilePayload.latitude = Number(lat);
    if (hasLng) profilePayload.longitude = Number(lng);
    if (hasAvatar || avatar instanceof File) profilePayload.avatar = avatar;
    if (hasCover || cover instanceof File) profilePayload.cover = cover;

    handleUpdateProfile(actualSalonId, profilePayload);
};

export const handleImageUpload = (
    setIsProcessingImage: (value: boolean) => void,
    setImagePreviewUrls: (urls: any) => void,
    setSalonFormData: (data: any) => void
) => (type: 'avatar' | 'cover') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
        const optimized = await optimizeImage(file, {
            maxWidth: type === 'cover' ? 1400 : 400,
            quality: 0.8
        });

        const previewUrl = URL.createObjectURL(optimized);
        setImagePreviewUrls((prev: any) => ({ ...prev, [type]: previewUrl }));
        setSalonFormData((prev: any) => ({ ...prev, [type]: optimized }));
    } catch (err) {
        console.error("Image processing failed", err);
    } finally {
        setIsProcessingImage(false);
    }
};

export const handleSaveService = (
    editingService: Service | null,
    serviceFormData: Partial<Service>,
    salonId: string | null | undefined,
    handleCreateService: (data: any) => void,
    handleUpdateService: (id: string, data: any) => void,
    modalState: any
) => {
    // Description is optional; if provided, must be at least 10 characters
    const description = ((serviceFormData as any).description || '').trim();
    if (description.length > 0 && description.length < 10) {
        console.error('Description must be at least 10 characters (or leave empty)');
        return;
    }

    // Images are optional
    const images = (serviceFormData as any).images || [];

    // Validate duration
    const duration = serviceFormData.duration_minutes ?? serviceFormData.duration;
    if (!duration || duration < 15) {
        console.error('Duration must be at least 15 minutes');
        return;
    }

    // Transform form data to match API requirements
    // Backend expects: duration (not duration_minutes), images array, and other fields
    const servicePayload = {
        salon_id: salonId,
        name: serviceFormData.name || '',
        category: serviceFormData.category || '',
        price: Number(serviceFormData.price) || 0,
        duration: Number(duration), // Use 'duration' instead of 'duration_minutes'
        description: description || '',
        images: images, // Array of File (new) or URL strings (existing)
        is_active: true,
    };

    if (editingService) {
        // Update existing service
        handleUpdateService(editingService.id, servicePayload);
    } else {
        // Create new service
        handleCreateService(servicePayload);
    }
    // Don't close modal here - let the Redux Saga success handler close it
};

export const handleDeleteService = (
    serviceToDelete: string | null,
    salonId: string | null | undefined,
    handleDeleteService: (id: string) => void,
    setServiceToDelete: (id: string | null) => void,
    modalState: any
) => {
    if (serviceToDelete) {
        // Call Redux Saga action to delete service via API
        handleDeleteService(serviceToDelete);
        modalState.setIsDeleteConfirmOpen(false);
        setServiceToDelete(null);
    }
};

export const handleDelete = (
    serviceToDelete: string | null,
    setServices: (services: Service[] | ((prev: Service[]) => Service[])) => void,
    setServiceToDelete: (id: string | null) => void,
    modalState: any
) => {
    if (serviceToDelete) {
        setServices(prev => prev.filter(s => s.id !== serviceToDelete));
        modalState.setIsDeleteConfirmOpen(false);
        setServiceToDelete(null);
    }
};

export const handleSaveStaff = (
    editingStaff: Staff | null,
    staffFormData: Partial<Staff>,
    salonId: string | null | undefined,
    handleCreateStaff: (data: any) => void,
    handleUpdateStaff: (id: string, data: any) => void,
    modalState: any
) => {
    // Transform form data to match API requirements
    const staffPayload: Record<string, any> = {
        salon_id: salonId,
        job_title: staffFormData.role || '',
        display_name: staffFormData.name || '',
        avatar_url: staffFormData.avatar || null,
        email: staffFormData.email || null,
        phone: staffFormData.phone || null,
        bio: staffFormData.bio || null,
        specialties: staffFormData.specialties || [],
        socials: staffFormData.socials || {},
        experience: staffFormData.experience || 0,
        joined_date: staffFormData.joinedDate || new Date().toISOString(),
        commission_rate: staffFormData.commissionRate || 0,
        is_active: staffFormData.status === 'active' || staffFormData.status === 'on-leave',
    };
    if (Array.isArray((staffFormData as any).service_ids)) {
        staffPayload.service_ids = (staffFormData as any).service_ids;
    }

    if (editingStaff) {
        // Update existing staff
        handleUpdateStaff(editingStaff.id, staffPayload);
    } else {
        // Create new staff
        handleCreateStaff(staffPayload);
    }
    modalState.setIsStaffModalOpen(false);
};

export const handleSaveBranch = (
    editingBranch: Branch | null,
    branchFormData: Partial<Branch>,
    salonId: string | null | undefined,
    handleCreateBranch: (data: any) => void,
    handleUpdateBranch: (id: string, data: any) => void,
    modalState: any
) => {
    // Transform form data to match API requirements
    const branchPayload = {
        salon_id: salonId,
        name: branchFormData.name || '',
        address: branchFormData.address || '',
        phone: branchFormData.phone || '',
        is_primary: branchFormData.isPrimary || false,
        status: branchFormData.status || 'active',
    };

    if (editingBranch) {
        // Update existing branch
        handleUpdateBranch(editingBranch.id, branchPayload);
    } else {
        // Create new branch
        handleCreateBranch(branchPayload);
    }
    // Don't close modal here - let the Redux Saga success handler close it
};

export const handleStaffDelete = (
    staffToDelete: string | null,
    salonId: string | null | undefined,
    handleDeleteStaff: (id: string) => void,
    setStaffToDelete: (id: string | null) => void,
    modalState: any
) => {
    if (staffToDelete) {
        // Call Redux Saga action to delete staff via API
        handleDeleteStaff(staffToDelete);
        modalState.setIsStaffDeleteOpen(false);
        setStaffToDelete(null);
    }
};