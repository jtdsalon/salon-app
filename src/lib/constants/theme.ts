/**
 * Salon-app design tokens – use these for consistent UI across the app.
 * Avoid hardcoded hex in components; import from here or use theme.palette.
 */

/** Primary brand accent (gold). Use for CTAs, highlights, secondary buttons. */
export const ACCENT_COLOR = '#EAB308';
export const ACCENT_COLOR_DARK = '#EAB308';
/** Lighter accent for hover states. */
export const ACCENT_COLOR_HOVER = '#FACC15';
/** For box-shadow, gradients, etc. RGB of ACCENT_COLOR. */
export const ACCENT_COLOR_RGBA = (alpha: number) => `rgba(234, 179, 8, ${alpha})`;

/** Dark slate – primary text (light mode), primary button, nav. */
export const PRIMARY_DARK = '#0F172A';
/** Darker card/surface in dark mode. */
export const CARD_BG_DARK = '#0B1224';
/** Page background dark mode. */
export const BG_DARK = '#020617';
/** Ink color on accent buttons. */
export const ON_ACCENT = '#050914';
/** Success green. */
export const SUCCESS_COLOR = '#10B981';
/** Error red. */
export const ERROR_COLOR = '#F43F5E';
/** Muted text. */
export const TEXT_MUTED = '#64748B';
export const TEXT_MUTED_DARK = '#94A3B8';

/** Border radius – use for consistency. */
export const RADIUS_BUTTON_PILL = '100px';
export const RADIUS_CARD = '24px';
export const RADIUS_CARD_LG = '32px';
export const RADIUS_INPUT = '20px';
