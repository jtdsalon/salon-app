
import { Service, Staff, Product } from './types';

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

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Ethereal Mist Serum', price: 12500, description: 'Botanical infusion for instant radiance.', category: 'Skin', stock: 12, image: 'https://picsum.photos/seed/mist/300/300' },
  { id: 'p2', name: 'Obsidian Night Cream', price: 18000, description: 'Deep cell regeneration ritual.', category: 'Skin', stock: 5, image: 'https://picsum.photos/seed/cream/300/300' },
  { id: 'p3', name: 'Golden Elixir Oil', price: 8500, description: 'Premium hair nourishment treatment.', category: 'Hair', stock: 24, image: 'https://picsum.photos/seed/oil/300/300' },
];
