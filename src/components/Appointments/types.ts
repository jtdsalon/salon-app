export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DEMAND_FORECAST = 'DEMAND_FORECAST',
  SCHEDULE = 'SCHEDULE',
  CUSTOMERS = 'CUSTOMERS',
  ARCHIVE = 'ARCHIVE',
  CHAT = 'CHAT',
  APOTHECARY = 'APOTHECARY',
  BILLING = 'BILLING',
  STAFF_PORTAL = 'STAFF_PORTAL',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SALON_PROFILE = 'SALON_PROFILE',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS'
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId?: string; // Single service (backward compatibility)
  serviceIds?: string[]; // Multiple services
  staffId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  /** URLs of style/suggested images the customer selected when booking */
  styleImageUrls?: string[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'artisan' | 'patron';
  text: string;
  timestamp: string;
}
