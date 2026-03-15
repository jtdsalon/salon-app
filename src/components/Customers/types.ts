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