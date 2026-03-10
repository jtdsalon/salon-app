/** Display shape for a service in the service menu (list view). */
export interface ServiceMenuItem {
  id: string;
  name: string;
  price: number | string;
  category: string;
  duration?: number;
  duration_minutes?: number;
  popularity?: number;
  description?: string;
  is_active?: boolean;
  [key: string]: unknown;
}
