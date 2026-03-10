import { useState, useRef, useEffect } from 'react';
import { Service, Staff, Branch, FeedPost } from '../types';
import { getSalon } from '@/state/salon';
// import { optimizeImage } from '../imageProcessor';

export const useSalonData = () => {
    const [salon, setSalon] = useState({
        id: '',
        name: '',
        handle: '',
        bio: '',
        rating: 0,
        reviewsCount: 0,
        address: '',
        city: '',
        area: '',
        latitude: null as number | null,
        longitude: null as number | null,
        cover: '',
        avatar: '',
        category: '',
        hours: []
    });

    const [branches, setBranches] = useState<Branch[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [posts, setPosts] = useState<FeedPost[]>([]);

    const [salonFormData, setSalonFormData] = useState({ ...salon });
    const [imagePreviewUrls, setImagePreviewUrls] = useState<{ avatar?: string; cover?: string }>({});
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceFormData, setServiceFormData] = useState<Partial<Service>>({});
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffFormData, setStaffFormData] = useState<Partial<Staff>>({});
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [branchFormData, setBranchFormData] = useState<Partial<Branch>>({});
    const [isProcessingImage, setIsProcessingImage] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

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
    };
};

export const useSalonDataSync = ({
    salonId,
    reduxSalon,
    reduxSuccess,
    setSalon,
    setSalonFormData,
    modalState,
    handleClearSuccess,
    dispatch
}: any) => {
    useEffect(() => {
        if (salonId) {
            dispatch(getSalon(salonId));
        }
    }, [salonId, dispatch]);

    useEffect(() => {
        if (reduxSalon && reduxSalon.id) {
            const hoursArray = convertHoursToArray(reduxSalon.hours);
            const socials = reduxSalon.socials || {};
            setSalon({
                id: reduxSalon.id,
                name: reduxSalon.name || "",
                handle: reduxSalon.handle || "",
                bio: reduxSalon.bio || "",
                rating: reduxSalon.rating || 0,
                reviewsCount: reduxSalon.reviewsCount || 0,
                address: reduxSalon.address || "",
                city: reduxSalon.city || reduxSalon.meta?.city || "",
                area: reduxSalon.area || reduxSalon.meta?.area || "",
                latitude: reduxSalon.latitude ?? null,
                longitude: reduxSalon.longitude ?? null,
                cover: reduxSalon.cover || "",
                avatar: reduxSalon.avatar || "",
                category: reduxSalon.category || '',
                hours: hoursArray,
                socials: reduxSalon.socials,
            });

            setSalonFormData({
                id: reduxSalon.id,
                name: reduxSalon.name || "",
                handle: reduxSalon.handle || "",
                bio: reduxSalon.bio || "",
                rating: reduxSalon.rating || 0,
                reviewsCount: reduxSalon.reviewsCount || 0,
                address: reduxSalon.address || "",
                city: reduxSalon.city || reduxSalon.meta?.city || "",
                area: reduxSalon.area || reduxSalon.meta?.area || "",
                latitude: reduxSalon.latitude ?? null,
                longitude: reduxSalon.longitude ?? null,
                cover: reduxSalon.cover || "",
                avatar: reduxSalon.avatar || "",
                category: reduxSalon.category || '',
                hours: hoursArray,
                website: socials.website ?? "",
                facebook: socials.facebook ?? "",
                instagram: socials.instagram ?? "",
            });
        }
    }, [reduxSalon]);

    useEffect(() => {
        if (reduxSuccess && reduxSalon && reduxSalon.id) {
            const hoursArray = convertHoursToArray(reduxSalon.hours);
            const socials = reduxSalon.socials || {};

            setSalon({
                id: reduxSalon.id,
                name: reduxSalon.name || "",
                handle: reduxSalon.handle || "",
                bio: reduxSalon.bio || "",
                rating: reduxSalon.rating || 0,
                reviewsCount: reduxSalon.reviewsCount || 0,
                address: reduxSalon.address || "",
                city: reduxSalon.city || reduxSalon.meta?.city || "",
                area: reduxSalon.area || reduxSalon.meta?.area || "",
                latitude: reduxSalon.latitude ?? null,
                longitude: reduxSalon.longitude ?? null,
                cover: reduxSalon.cover || "",
                avatar: reduxSalon.avatar || "",
                category: reduxSalon.category || '',
                hours: hoursArray,
                socials: reduxSalon.socials,
            });

            setSalonFormData({
                id: reduxSalon.id,
                name: reduxSalon.name || "",
                handle: reduxSalon.handle || "",
                bio: reduxSalon.bio || "",
                rating: reduxSalon.rating || 0,
                reviewsCount: reduxSalon.reviewsCount || 0,
                address: reduxSalon.address || "",
                city: reduxSalon.city || reduxSalon.meta?.city || "",
                area: reduxSalon.area || reduxSalon.meta?.area || "",
                latitude: reduxSalon.latitude ?? null,
                longitude: reduxSalon.longitude ?? null,
                cover: reduxSalon.cover || "",
                avatar: reduxSalon.avatar || "",
                category: reduxSalon.category || '',
                hours: hoursArray,
                website: socials.website ?? "",
                facebook: socials.facebook ?? "",
                instagram: socials.instagram ?? "",
            });

            modalState.setIsSalonEditOpen(false);
        }
    }, [reduxSuccess]);
};

const convertHoursToArray = (hours: any) => {
    if (!hours) return [];
    if (Array.isArray(hours)) return hours;
    if (typeof hours === 'object') return Object.values(hours);
    return [];
};