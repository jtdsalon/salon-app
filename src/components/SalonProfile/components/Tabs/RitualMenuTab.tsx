import React from 'react';
import { ServiceMenuView } from '@/components/Services';
import type { ServiceMenuItem } from '@/components/Services/types';
import { Service } from '../../types';

export const RitualMenuTab: React.FC<{
  services: Service[];
  theme: any;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}> = ({ services, theme, onEdit, onDelete, onAdd }) => {
  const menuItems: ServiceMenuItem[] = (services ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    category: s.category,
    duration: s.duration,
    duration_minutes: s.duration_minutes,
    popularity: s.popularity,
  }));

  return (
    <ServiceMenuView
      services={menuItems}
      theme={theme}
      onEdit={(service) => {
        const full = (services ?? []).find((s) => s.id === service.id);
        onEdit(full ?? (service as Service));
      }}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
