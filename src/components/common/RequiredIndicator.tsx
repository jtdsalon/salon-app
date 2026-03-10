import React from 'react';
import { Typography } from '@mui/material';

/**
 * Consistent required field asterisk for salon-app forms.
 * Use with label: label={<>Field Name <RequiredIndicator /></>}
 * Or: label={requiredLabel('Field Name')}
 */
export const RequiredIndicator: React.FC = () => (
  <Typography component="span" color="error.main" sx={{ fontWeight: 900 }}>*</Typography>
);

/** Helper for TextField label prop: label={requiredLabel('Field Name')} */
export const requiredLabel = (text: string): React.ReactNode => (
  <>{text} <RequiredIndicator /></>
);
