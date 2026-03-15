export * from './index';

export interface OperatingHour {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  SCHEDULE = 'SCHEDULE',
  STAFF = 'STAFF',
  CUSTOMERS = 'CUSTOMERS',
  ARCHIVE = 'ARCHIVE',
  APOTHECARY = 'APOTHECARY',
  CHAT = 'CHAT',
  SERVICES = 'SERVICES',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SALON_PROFILE = 'SALON_PROFILE',
  DEMAND_FORECAST = 'DEMAND_FORECAST',
  CHECKOUT = 'CHECKOUT',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  BILLING = 'BILLING',
  STAFF_PORTAL = 'STAFF_PORTAL'
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  type: 'salon' | 'customer';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  image?: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: UserProfile[];
  groupName?: string;
  messages: Message[];
  lastMessageAt: number;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  targetId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
}

export interface StaffSocials {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  specialties?: string[];
  socials?: StaffSocials;
  experience?: number;
  joinedDate?: string;
  commissionRate?: number;
  avatar?: string;
  status?: 'active' | 'on-leave' | 'inactive' | 'blocked';
  rating?: number;
  monthlyRevenue?: number;
  schedule?: { day: string; slots: string[] }[];
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  city?: string;
  isPrimary?: boolean;
  is_primary?: boolean;
  status?: 'active' | 'inactive' | 'opening-soon' | 'maintenance' | 'closed' | 'permanent-closed';
  salonId?: string;
  salon_id?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  hours?: any;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration?: number;
  duration_minutes?: number;
  category: string;
  popularity?: number;
  description?: string;
  is_active?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  image: string;
  barcode: string;
  description?: string;
  rating?: number;
}

export interface SocialPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  timestamp: string;
  caption: string;
}

export interface PromoOffer {
  id: string;
  title: string;
  discount: string;
  reach: number;
  status: 'active' | 'scheduled' | 'ended';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  history: AppointmentHistory[];
}

export interface AppointmentHistory {
  id: string;
  date: string;
  serviceId: string;
  staffId: string;
  price: number;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  staffId: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'arrived' | 'in-progress';
  notes?: string;
  allergies?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType: 'customer' | 'salon';
  text: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType: 'customer' | 'salon';
  caption: string;
  image?: string;
  imageBefore?: string;
  isTransformation?: boolean;
  likes: number;
  isLiked: boolean;
  timeAgo: string;
  comments: Comment[];
}

export interface SalonReview {
  id: string;
  user: string;
  userId?: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  serviceId?: string;
  reply?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
