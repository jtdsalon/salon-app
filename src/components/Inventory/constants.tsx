
import { Service, Staff, Appointment, Customer, Product, SocialPost, PromoOffer, FeedPost, Notification, AuditLog } from './types';

export const SERVICES: Service[] = [
  { id: 's1', name: 'Signature Haircut', price: 65, duration: 45, category: 'Hair', popularity: 85 },
  { id: 's2', name: 'Balayage & Color', price: 180, duration: 150, category: 'Hair', popularity: 92 },
  { id: 's3', name: 'Luxury Manicure', price: 45, duration: 60, category: 'Nails', popularity: 64 },
  { id: 's4', name: 'HydraFacial', price: 120, duration: 75, category: 'Skin', popularity: 78 },
  { id: 's5', name: 'Beard Trim & Shape', price: 35, duration: 30, category: 'Grooming', popularity: 45 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', action: 'Appointment Confirmed', actor: 'Elena Rodriguez', target: 'Emma Watson', timestamp: '10:24 AM', severity: 'success' },
  { id: 'l2', action: 'Inventory Depleted', actor: 'System', target: 'Midnight Recovery Serum', timestamp: '09:15 AM', severity: 'warning' },
  { id: 'l3', action: 'New Artisan Enrolled', actor: 'Admin', target: 'Marcus Chen', timestamp: 'Yesterday', severity: 'info' },
  { id: 'l4', action: 'Sale Processed', actor: 'Sarah Jenkins', target: 'Rs. 12,500 Order', timestamp: 'Yesterday', severity: 'success' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    fromUserId: 'c1',
    fromUserName: 'Emma Watson',
    fromUserAvatar: '',
    message: 'liked your latest transformation masterpiece.',
    timeAgo: '2m ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'comment',
    fromUserId: 'st1',
    fromUserName: 'Elena Rodriguez',
    fromUserAvatar: '',
    message: 'curated a thought on your profile.',
    timeAgo: '15m ago',
    isRead: false,
  }
];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Midnight Recovery Serum', 
    brand: 'AURORA ELITE', 
    price: 12500, 
    stock: 12, 
    minStock: 5, 
    category: 'Skincare', 
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop', 
    barcode: '7890123456',
    description: 'Transformative overnight ritual for luminous skin.',
    rating: 4.9
  },
  { 
    id: 'p2', 
    name: 'Luxe Hair Infusion Oil', 
    brand: 'ARTISAN ESSENTIALS', 
    price: 8500, 
    stock: 3, 
    minStock: 5, 
    category: 'Haircare', 
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=800&auto=format&fit=crop', 
    barcode: '1234567890',
    description: 'Gold-infused weightless hydration for split ends.',
    rating: 4.8
  },
  { 
    id: 'p3', 
    name: 'Zen Silk Massage Stone', 
    brand: 'SPA ORIGIN', 
    price: 4500, 
    stock: 8, 
    minStock: 2, 
    category: 'Tools', 
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop', 
    barcode: '4567890123',
    description: 'Hand-polished volcanic stone for thermal release.',
    rating: 4.7
  },
  { 
    id: 'p4', 
    name: 'Oud & Amber Ritual Candle', 
    brand: 'AURORA SCENT', 
    price: 6500, 
    stock: 2, 
    minStock: 5, 
    category: 'Fragrance', 
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', 
    barcode: '3210987654',
    description: 'Hand-poured soy wax with signature apothecary scents.',
    rating: 5.0
  },
];

export const STAFF: Staff[] = [
  { id: 'st1', name: 'Elena Rodriguez', role: 'Senior Stylist', commissionRate: 0.25, avatar: '', status: 'active', rating: 4.9, monthlyRevenue: 12400 },
  { id: 'st2', name: 'Marcus Chen', role: 'Color Expert', commissionRate: 0.20, avatar: '', status: 'active', rating: 4.8, monthlyRevenue: 9800 },
  { id: 'st3', name: 'Sarah Jenkins', role: 'Esthetician', commissionRate: 0.15, avatar: '', status: 'on-leave', rating: 5.0, monthlyRevenue: 7500 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', 
    name: 'Elena Gilbert', 
    email: 'elena@example.com', 
    phone: '+1 555 0123', 
    history: [
      { id: 'h1', date: '2023-10-15', serviceId: 's1', staffId: 'st1', price: 1240 }
    ] 
  },
  { 
    id: 'c2', 
    name: 'Damon Salvatore', 
    email: 'damon@example.com', 
    phone: '+1 555 0999', 
    history: [
      { id: 'h2', date: '2023-09-20', serviceId: 's5', staffId: 'st2', price: 450 }
    ] 
  },
  { 
    id: 'c3', 
    name: 'Stefan Salvatore', 
    email: 'stefan@example.com', 
    phone: '+1 555 1111', 
    history: [
      { id: 'h3', date: '2023-11-02', serviceId: 's2', staffId: 'st1', price: 2100 }
    ] 
  },
  { 
    id: 'c4', 
    name: 'Bonnie Bennett', 
    email: 'bonnie@example.com', 
    phone: '+1 555 2222', 
    history: [
      { id: 'h4', date: '2023-08-14', serviceId: 's4', staffId: 'st3', price: 890 }
    ] 
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', customerId: 'c1', customerName: 'Emma Watson', serviceId: 's1', staffId: 'st1', date: '2024-05-20', time: '10:00 AM', status: 'confirmed' },
  { id: 'a2', customerId: 'c2', customerName: 'James Blake', serviceId: 's5', staffId: 'st2', date: '2024-05-20', time: '11:30 AM', status: 'pending' },
];

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
