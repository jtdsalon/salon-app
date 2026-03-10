import type { SalonRole } from '@/state/auth/types';

/** Check if user has any role for the given salon (can access salon app) */
export const hasSalonAccess = (roles: SalonRole[] | null | undefined, salonId: string | null | undefined): boolean => {
  if (!salonId || !roles?.length) return false;
  return roles.some((r) => r.salonId === salonId);
};

/** Check if user has a specific permission for the given salon. Admin roles get full access. */
export const hasPermission = (
  roles: SalonRole[] | null | undefined,
  salonId: string | null | undefined,
  permission: string
): boolean => {
  if (!salonId || !roles?.length) return false;

  const salonRole = roles.find((r) => r.salonId === salonId);
  if (!salonRole) return false;

  // SALON_ADMIN and SUPER_ADMIN have full access
  if (['SALON_ADMIN', 'SUPER_ADMIN'].includes(salonRole.role)) return true;

  return salonRole.permissions?.includes(permission) ?? false;
};
