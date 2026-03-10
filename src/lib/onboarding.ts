/**
 * Onboarding helpers per doc/onboarding.md and salon-profile-update.md
 * Profile completion requires: Logo, Cover, Name, Handle, Address, City, Area, Operating Hours (≥1 day)
 */

/** Minimal salon shape for profile completion check */
export interface SalonForOnboarding {
  id?: string;
  name?: string;
  address?: string;
  avatar?: string;
  cover?: string;
  handle?: string;
  city?: string;
  area?: string;
  hours?: Array<{ day: string; isOpen: boolean }>;
  [key: string]: unknown;
}

/** Profile is complete when all required fields per salon-profile-update.md are filled. */
export function isSalonProfileComplete(salon: SalonForOnboarding | null | undefined): boolean {
  if (!salon?.id) return false;
  const name = (salon.name ?? '').toString().trim();
  const address = (salon.address ?? '').toString().trim();
  const handle = (salon.handle ?? '').toString().trim();
  const city = (salon.city ?? '').toString().trim();
  const area = (salon.area ?? '').toString().trim();
  const hasLogo = !!(salon.avatar ?? salon.image_url);
  const hasCover = !!(salon.cover ?? salon.cover_image_url);
  const hours = Array.isArray(salon.hours) ? salon.hours : [];
  const hasAtLeastOneOpenDay = hours.some((h) => h?.isOpen === true);
  return (
    name.length > 0 &&
    address.length > 0 &&
    handle.length > 0 &&
    city.length > 0 &&
    area.length > 0 &&
    hasLogo &&
    hasCover &&
    hasAtLeastOneOpenDay
  );
}

/** Minimum number of services required before salon can accept bookings (doc §3.3). */
export const MIN_SERVICES_REQUIRED = 3;
