/**
 * Salon Form Validation Utility
 * Manual validation without external dependencies
 */

export interface SalonFormErrors {
  name?: string;
  handle?: string;
  bio?: string;
  address?: string;
  city?: string;
  area?: string;
  category?: string;
  avatar?: string;
  cover?: string;
  hours?: string;
}

export interface OperatingHour {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface SalonFormData {
  name: string;
  handle: string;
  bio: string;
  address: string;
  city?: string;
  area?: string;
  category?: string;
  avatar?: string;
  cover?: string;
  hours: OperatingHour[];
}

/**
 * Validates the entire salon form
 */
export const validateSalonForm = (formData: SalonFormData): SalonFormErrors => {
  const errors: SalonFormErrors = {};

  // Validate name
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Sanctuary name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Sanctuary name must be at least 2 characters';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Sanctuary name must be less than 100 characters';
  }

  // Validate handle
  if (!formData.handle || formData.handle.trim().length === 0) {
    errors.handle = 'Public handle is required';
  } else if (formData.handle.trim().length < 2) {
    errors.handle = 'Handle must be at least 2 characters';
  } else if (formData.handle.trim().length > 50) {
    errors.handle = 'Handle must be less than 50 characters';
  } else if (!/^@?[a-zA-Z0-9_-]+$/.test(formData.handle.trim())) {
    errors.handle = 'Handle can only contain @ (at start), letters, numbers, underscores, and hyphens';
  }

  // Validate bio (doc: max 1000 characters)
  if (formData.bio && formData.bio.trim().length > 1000) {
    errors.bio = 'Bio must be less than 1000 characters';
  }

  // Validate category
  if (formData.category && formData.category.trim().length > 100) {
    errors.category = 'Category must be less than 100 characters';
  }

  // Validate address
  if (!formData.address || formData.address.trim().length === 0) {
    errors.address = 'Address is required';
  } else if (formData.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  } else if (formData.address.trim().length > 200) {
    errors.address = 'Address must be less than 200 characters';
  }

  // Validate city (required per doc)
  if (!formData.city || formData.city.trim().length === 0) {
    errors.city = 'City is required';
  } else if (formData.city.trim().length > 100) {
    errors.city = 'City must be less than 100 characters';
  }

  // Validate area/neighbourhood (required per doc)
  if (!formData.area || formData.area.trim().length === 0) {
    errors.area = 'Area / Neighbourhood is required';
  } else if (formData.area.trim().length > 150) {
    errors.area = 'Area must be less than 150 characters';
  }

  // Validate logo (required per doc)
  const hasLogo = formData.avatar != null && formData.avatar !== '' && (typeof formData.avatar === 'string' ? formData.avatar.trim().length > 0 : true);
  if (!hasLogo) {
    errors.avatar = 'Logo is required';
  }

  // Validate cover image (required per doc)
  const hasCover = formData.cover != null && formData.cover !== '' && (typeof formData.cover === 'string' ? formData.cover.trim().length > 0 : true);
  if (!hasCover) {
    errors.cover = 'Cover image is required';
  }

  // Validate operating hours
  const operatingHoursError = validateOperatingHours(formData.hours);
  if (operatingHoursError) {
    errors.hours = operatingHoursError;
  }

  return errors;
};

/**
 * Validates individual form fields
 */
export const validateField = (
  fieldName: keyof SalonFormData,
  value: any,
  formData?: SalonFormData
): string | undefined => {
  switch (fieldName) {
    case 'name':
      if (!value || value.trim().length === 0) {
        return 'Sanctuary name is required';
      }
      if (value.trim().length < 2) {
        return 'Sanctuary name must be at least 2 characters';
      }
      if (value.trim().length > 100) {
        return 'Sanctuary name must be less than 100 characters';
      }
      break;

    case 'handle':
      if (!value || value.trim().length === 0) {
        return 'Public handle is required';
      }
      if (value.trim().length < 2) {
        return 'Handle must be at least 2 characters';
      }
      if (value.trim().length > 50) {
        return 'Handle must be less than 50 characters';
      }
      if (!/^@?[a-zA-Z0-9_-]+$/.test(value.trim())) {
        return 'Handle can only contain @ (at start), letters, numbers, underscores, and hyphens';
      }
      break;

    case 'bio':
      if (value && value.trim().length > 1000) {
        return 'Bio must be less than 1000 characters';
      }
      break;

    case 'category':
      if (value && value.trim().length > 100) {
        return 'Category must be less than 100 characters';
      }
      break;

    case 'address':
      if (!value || value.trim().length === 0) {
        return 'Address is required';
      }
      if (value.trim().length < 5) {
        return 'Address must be at least 5 characters';
      }
      if (value.trim().length > 200) {
        return 'Address must be less than 200 characters';
      }
      break;

    case 'city': {
      if (!value || String(value).trim().length === 0) return 'City is required';
      const city = String(value).trim();
      if (city.length > 100) return 'City must be less than 100 characters';
      break;
    }

    case 'area': {
      if (!value || String(value).trim().length === 0) return 'Area / Neighbourhood is required';
      const area = String(value).trim();
      if (area.length > 150) return 'Area must be less than 150 characters';
      break;
    }

    case 'avatar':
      if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Logo is required';
      break;

    case 'cover':
      if (!value || (typeof value === 'string' && value.trim().length === 0)) return 'Cover image is required';
      break;

    case 'hours':
      return validateOperatingHours(value);

    default:
      return undefined;
  }

  return undefined;
};

/**
 * Validates operating hours (doc: at least 1 operating day required)
 */
const validateOperatingHours = (hours: OperatingHour[] | undefined): string | undefined => {
  if (!hours || hours.length === 0) {
    return 'At least one operating day is required';
  }

  const hasOpenDay = hours.some((h) => h.isOpen === true);
  if (!hasOpenDay) {
    return 'At least one operating day must be open';
  }

  for (const hour of hours) {
    if (hour.isOpen) {
      // Check if times are provided
      if (!hour.open || !hour.close) {
        return `${hour.day}: Opening and closing times are required when open`;
      }

      // Validate time format (HH:MM)
      if (!/^\d{2}:\d{2}$/.test(hour.open)) {
        return `${hour.day}: Invalid opening time format`;
      }
      if (!/^\d{2}:\d{2}$/.test(hour.close)) {
        return `${hour.day}: Invalid closing time format`;
      }

      // Check if closing time is after opening time
      const openTime = convertTimeToMinutes(hour.open);
      const closeTime = convertTimeToMinutes(hour.close);

      if (closeTime <= openTime) {
        return `${hour.day}: Closing time must be after opening time`;
      }
    }
  }

  return undefined;
};

/**
 * Validates individual operating hour
 */
export const validateOperatingHour = (hour: OperatingHour): string | undefined => {
  if (hour.isOpen) {
    if (!hour.open || !hour.close) {
      return `${hour.day}: Opening and closing times are required when open`;
    }

    if (!/^\d{2}:\d{2}$/.test(hour.open)) {
      return `${hour.day}: Invalid opening time format`;
    }
    if (!/^\d{2}:\d{2}$/.test(hour.close)) {
      return `${hour.day}: Invalid closing time format`;
    }

    const openTime = convertTimeToMinutes(hour.open);
    const closeTime = convertTimeToMinutes(hour.close);

    if (closeTime <= openTime) {
      return `${hour.day}: Closing time must be after opening time`;
    }
  }

  return undefined;
};

/**
 * Helper function to convert HH:MM to minutes
 */
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Checks if form has any errors
 */
export const hasErrors = (errors: SalonFormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

/**
 * Clears errors for a specific field
 */
export const clearFieldError = (
  errors: SalonFormErrors,
  fieldName: keyof SalonFormErrors
): SalonFormErrors => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * Sets error for a specific field
 */
export const setFieldError = (
  errors: SalonFormErrors,
  fieldName: keyof SalonFormErrors,
  errorMessage: string | undefined
): SalonFormErrors => {
  const newErrors = { ...errors };
  if (errorMessage) {
    newErrors[fieldName] = errorMessage;
  } else {
    delete newErrors[fieldName];
  }
  return newErrors;
};
