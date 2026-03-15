import { getServerOrigin } from '@/config/api'

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - Relative image path from the API response (e.g., /uploads/salons/...)
 * @returns Full URL to the image
 */
export const getFullImageUrl = (imagePath: string | undefined | null): string | undefined => {
  if (!imagePath || typeof imagePath !== 'string') return undefined
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  const embeddedUrl = imagePath.match(/https?:\/\/[^\s'"]+/)
  if (embeddedUrl) return embeddedUrl[0]
  return `${getServerOrigin()}${imagePath}`
}

/**
 * Constructs full URLs for both avatar and cover images
 * @param salon - Salon object with avatar and cover properties
 * @returns Object with fullAvatarUrl and fullCoverUrl
 */
export const getSalonImageUrls = (salon: any) => {
  return {
    fullAvatarUrl: getFullImageUrl(salon?.avatar),
    fullCoverUrl: getFullImageUrl(salon?.cover),
  }
}
