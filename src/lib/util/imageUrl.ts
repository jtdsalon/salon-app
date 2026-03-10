/**
 * Constructs a full image URL from a relative path
 * @param imagePath - Relative image path from the API response (e.g., /uploads/salons/...)
 * @returns Full URL to the image
 */
export const getFullImageUrl = (imagePath: string | undefined | null): string | undefined => {
  // Handle null, undefined, or non-string values
  if (!imagePath || typeof imagePath !== 'string') {
    return undefined
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Get the backend base URL from environment or use default
  const backendUrl = (import.meta.env.VITE_APP_BASE_URL as string | undefined) || 'http://localhost:5000/api'
  
  // Remove '/api' from the end if it exists to get the base server URL
  const baseServerUrl = backendUrl.replace(/\/api\s*$/, '')
  
  // Combine the base server URL with the image path
  return `${baseServerUrl}${imagePath}`
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
