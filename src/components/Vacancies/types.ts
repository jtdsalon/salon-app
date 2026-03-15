
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
    ACCOUNT_SETTINGS = 'ACCOUNT_SETTINGS',
    SALON_SETTINGS = 'SALON_SETTINGS',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    VACANCIES = 'VACANCIES'
  }
  
  export type AppointmentStatus = 'pending' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  
  export interface Appointment {
    id: string;
    customerId: string;
    customerName: string;
    serviceIds: string[];
    staffId: string;
    date: string;
    time: string;
    status: AppointmentStatus;
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
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    tier: string;
    history: {
      date: string;
      price: number;
    }[];
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
  
  export interface Vacancy {
    id: string;
    title: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    requirements: string[];
    experience: string;
    salaryRange: string;
    status: 'Open' | 'Closed';
    postedDate: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }
  