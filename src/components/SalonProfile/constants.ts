import { Service, Staff, Appointment, Customer, Product, SocialPost, PromoOffer, FeedPost, Notification, AuditLog } from './types';

export const CATEGORIES = ['Hair', 'Nails', 'Skin', 'Grooming', 'Massage', 'Other'];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CURRENT_USER = {
    id: 'me',
    name: 'Jane Doe',
    avatar: '',
    type: 'customer' as const
};

export const FEED_POSTS: FeedPost[] = [
    {
        id: 'fp1',
        userId: 'st1',
        userName: 'Elena Rodriguez',
        userAvatar: '',
        userType: 'salon',
        caption: 'The art of the perfect balayage. Luminous tones for the modern muse.',
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop',
        likes: 124,
        isLiked: false,
        timeAgo: '2h ago',
        comments: [
            {
                id: 'c1',
                userId: 'c1',
                userName: 'Emma Watson',
                userAvatar: '',
                userType: 'customer',
                text: 'Absolutely stunning work, Elena!',
                timeAgo: '1h ago',
                likes: 5,
                isLiked: false
            }
        ]
    },
    {
        id: 'fp2',
        userId: 'c1',
        userName: 'Emma Watson',
        userAvatar: '',
        userType: 'customer',
        caption: 'Obsessed with my new transformation. Thank you @Elena!',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop',
        imageBefore: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop',
        isTransformation: true,
        likes: 89,
        isLiked: true,
        timeAgo: '5h ago',
        comments: []
    },
];

export const STAFF: Staff[] = [
    {
        id: 'st1',
        name: 'Elena Rodriguez',
        role: 'Senior Stylist',
        email: 'elena@glowsalon.com',
        phone: '+94 77 123 4567',
        bio: 'Sculpting beauty through precision and passion. 12 years of defining the modern aesthetic.',
        specialties: ['Precision Cutting', 'Editorial Styling'],
        socials: {
            instagram: '@elena_glamour',
            tiktok: '@elenastyle',
            linkedin: 'elena-rodriguez-beauty'
        },
        experience: 12,
        joinedDate: '2020-03-15',
        commissionRate: 0.25,
        avatar: '',
        status: 'active',
        rating: 4.9,
        monthlyRevenue: 12400
    },
    {
        id: 'st2',
        name: 'Marcus Chen',
        role: 'Color Expert',
        email: 'marcus@glowsalon.com',
        phone: '+94 77 987 6543',
        bio: 'Mastering the spectrum. Specializing in high-contrast balayage and chromatic transformations.',
        specialties: ['Balayage', 'Corrective Color'],
        socials: {
            instagram: '@marcus_chroma',
            facebook: 'marcus.chen.color'
        },
        experience: 8,
        joinedDate: '2021-06-10',
        commissionRate: 0.20,
        avatar: '',
        status: 'active',
        rating: 4.8,
        monthlyRevenue: 9800
    },
    {
        id: 'st3',
        name: 'Sarah Jenkins',
        role: 'Esthetician',
        email: 'sarah@glowsalon.com',
        phone: '+94 77 555 4433',
        bio: 'Curating radiant skin rituals. Expert in non-invasive facial rejuvenation and holistic dermis care.',
        specialties: ['HydraFacials', 'Chemical Peels'],
        socials: {
            instagram: '@sarah_glow_ritual',
            linkedin: 'sarah-jenkins-glow'
        },
        experience: 6,
        joinedDate: '2022-01-20',
        commissionRate: 0.15,
        avatar: '',
        status: 'on-leave',
        rating: 5.0,
        monthlyRevenue: 7500
    },
];

export const SERVICES: Service[] = [
    { id: 's1', name: 'Signature Haircut', price: 65, duration: 45, category: 'Hair', popularity: 85 },
    { id: 's2', name: 'Balayage & Color', price: 180, duration: 150, category: 'Hair', popularity: 92 },
    { id: 's3', name: 'Luxury Manicure', price: 45, duration: 60, category: 'Nails', popularity: 64 },
    { id: 's4', name: 'HydraFacial', price: 120, duration: 75, category: 'Skin', popularity: 78 },
    { id: 's5', name: 'Beard Trim & Shape', price: 35, duration: 30, category: 'Grooming', popularity: 45 },
];