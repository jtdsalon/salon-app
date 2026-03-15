
export const ALL_HOURS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

export const SALON_OPEN_HOUR = 8;
export const SALON_CLOSE_HOUR = 21;
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const formatTime12h = (time24: string) => {
  if (!time24) return '';
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
};

export const ARTISAN_ESSENCES: Record<string, string[]> = {
  'st1': ['Master of Form', 'Color Alchemist', 'Ritual Specialist'],
  'st2': ['Texture Artisan', 'Precision Carver', 'Fade Architect']
};
