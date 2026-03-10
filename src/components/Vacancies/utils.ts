import { Vacancy } from '../types';

export const validateVacancyForm = (formData: Partial<Vacancy>): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.title?.trim()) newErrors.title = 'Job title is required';
  if (!formData.experience?.trim()) newErrors.experience = 'Experience level is required';
  
  // Email Validation
  if (!formData.contactEmail?.trim()) {
    newErrors.contactEmail = 'Application email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    newErrors.contactEmail = 'Please enter a valid email address';
  }

  // Phone Validation (Optional)
  if (formData.contactPhone?.trim() && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.contactPhone)) {
    newErrors.contactPhone = 'Please enter a valid phone number';
  }

  // Description Validation
  const cleanDesc = formData.description?.replace(/<[^>]*>/g, '').trim();
  if (!cleanDesc) {
    newErrors.description = 'Job description is required';
  }

  return newErrors;
};
