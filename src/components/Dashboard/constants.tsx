
import { Appointment, Service, Staff, Product, Customer } from './types';

// Helper to get relative dates for mock data
const getDateOffset = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SERVICES: Service[] = [
  { id: 's1', name: 'Signature Haircut', price: 4500, duration: 60, category: 'Hair' },
  { id: 's2', name: 'Deep Hydration Facial', price: 7500, duration: 90, category: 'Skin' },
  { id: 's3', name: 'Balayage & Color', price: 12000, duration: 180, category: 'Hair' },
  { id: 's4', name: 'Executive Grooming', price: 5000, duration: 45, category: 'Grooming' },
  { id: 's5', name: 'Beard Trim & Shape', price: 2500, duration: 30, category: 'Grooming' },
  { id: 's6', name: 'Texture Styling', price: 3500, duration: 45, category: 'Hair' },
  { id: 's7', name: 'Silk Press & Treatment', price: 8500, duration: 120, category: 'Hair' },
];

export const STAFF: Staff[] = [
  { id: 'st1', name: 'Elena Rodriguez', role: 'Master Artisan', avatar: 'https://picsum.photos/seed/elena/100/100' },
  { id: 'st2', name: 'Marcus Chen', role: 'Lead Artisan', avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 'st3', name: 'Julian Vane', role: 'Color Alchemist', avatar: 'https://picsum.photos/seed/julian/100/100' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', name: 'Julianne Moore', email: 'j.moore@hollywood.com', phone: '+1 555-9012', tier: 'Obsidian',
    history: [
      { date: '2026-02-09', price: 7500 },
      { date: '2026-01-15', price: 12000 },
      { date: '2025-12-01', price: 4500 }
    ]
  },
  { 
    id: 'c2', name: 'Robert De Niro', email: 'bobby.d@acting.org', phone: '+1 555-8832', tier: 'Pearl',
    history: [
      { date: '2026-02-08', price: 5000 },
      { date: '2026-01-10', price: 2500 }
    ]
  },
  { 
    id: 'c3', name: 'Emma Watson', email: 'emma@books.co.uk', phone: '+44 7700-9003', tier: 'Obsidian',
    history: [
      { date: '2026-02-10', price: 4500 },
      { date: '2026-01-20', price: 4500 },
      { date: '2025-12-15', price: 7500 }
    ]
  },
  { 
    id: 'c4', name: 'James Blake', email: 'j.blake@music.fm', phone: '+1 555-1234', tier: 'Gold',
    history: [
      { date: '2026-02-10', price: 2500 }
    ]
  },
  { 
    id: 'c5', name: 'Sophia Loren', email: 'sophia@classic.it', phone: '+39 06-123456', tier: 'Obsidian',
    history: [
      { date: '2026-02-10', price: 15500 }
    ]
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt-p1', customerId: 'c1', customerName: 'Julianne Moore', serviceIds: ['s2'], staffId: 'st2', date: getDateOffset(-1), time: '14:00', status: 'completed' },
  { id: 'apt-p2', customerId: 'c2', customerName: 'Robert De Niro', serviceIds: ['s4', 's5'], staffId: 'st2', date: getDateOffset(-2), time: '09:30', status: 'completed' },
  { id: 'apt-t1', customerId: 'c3', customerName: 'Emma Watson', serviceIds: ['s1'], staffId: 'st1', date: getDateOffset(0), time: '10:00', status: 'confirmed' },
  { id: 'apt-t2', customerId: 'c4', customerName: 'James Blake', serviceIds: ['s5'], staffId: 'st2', date: getDateOffset(0), time: '11:30', status: 'confirmed' },
  { id: 'apt-t3', customerId: 'c5', customerName: 'Sophia Loren', serviceIds: ['s3', 's1'], staffId: 'st1', date: getDateOffset(0), time: '13:00', status: 'confirmed' },
  { id: 'apt-u1', customerId: 'c6', customerName: 'Timothée Chalamet', serviceIds: ['s6'], staffId: 'st1', date: getDateOffset(1), time: '11:00', status: 'confirmed' },
  { id: 'apt-u2', customerId: 'c7', customerName: 'Zendaya', serviceIds: ['s7', 's2'], staffId: 'st1', date: getDateOffset(3), time: '15:30', status: 'confirmed' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Ethereal Mist Serum', price: 12500, description: 'Botanical infusion for instant radiance.', category: 'Skin', stock: 12, image: 'https://picsum.photos/seed/mist/300/300' },
  { id: 'p2', name: 'Obsidian Night Cream', price: 18000, description: 'Deep cell regeneration ritual.', category: 'Skin', stock: 5, image: 'https://picsum.photos/seed/cream/300/300' },
  { id: 'p3', name: 'Golden Elixir Oil', price: 8500, description: 'Premium hair nourishment treatment.', category: 'Hair', stock: 24, image: 'https://picsum.photos/seed/oil/300/300' },
];
