import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    IconButton,
    Box
} from '@mui/material';
import { X } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const TERMS_SECTIONS = [
    {
        title: '1. Acceptance',
        body: 'By creating an account, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, do not use the service.',
    },
    {
        title: '2. Account & Eligibility',
        body: 'You must be at least 18 years old and have the authority to represent your salon or business. You are responsible for keeping your login details secure and for all activity under your account.',
    },
    {
        title: '3. Use of the Service',
        body: 'The platform is provided for managing your salon operations, including appointments, staff, services, and client communications. You agree to use it only for lawful purposes and in line with any guidelines we provide.',
    },
    {
        title: '4. Your Content & Data',
        body: 'You retain ownership of content you upload (e.g. staff details, services, promotions). You grant us the rights needed to operate the service and to display your content to your clients and staff as intended.',
    },
    {
        title: '5. Privacy & Data Protection',
        body: 'Our Privacy Policy explains how we collect, use, and protect personal data. We process data in accordance with applicable privacy laws. By using the service, you also agree to our Privacy Policy.',
    },
    {
        title: '6. Fees & Cancellation',
        body: 'Any applicable subscription or usage fees will be communicated before you are charged. You may cancel in line with our cancellation policy. We may update pricing with reasonable notice.',
    },
    {
        title: '7. Limitation of Liability',
        body: 'The service is provided "as is." We are not liable for indirect, incidental, or consequential damages, or for losses arising from your use of the platform or reliance on it for business decisions.',
    },
    {
        title: '8. Changes',
        body: 'We may update these terms from time to time. We will notify you of material changes (e.g. by email or in-app notice). Continued use after changes constitutes acceptance of the updated terms.',
    },
];

export const ManifestoDialog = ({ open, onClose, onAccept }: Props) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={900}>Terms and Conditions</Typography>
                <IconButton onClick={onClose} aria-label="Close">
                    <X size={18} />
                </IconButton>
            </Stack>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                By creating an account, you agree to the following terms and to our Privacy Policy.
            </Typography>
            <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 2 } }}>
                {TERMS_SECTIONS.map(({ title, body }) => (
                    <Box component="li" key={title}>
                        <Typography variant="body2" fontWeight={700} color="text.primary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {body}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </DialogContent>

        <DialogActions>
            <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={onAccept}
                sx={{
                    borderRadius: '12px',
                    bgcolor: 'text.primary',
                    color: 'background.paper',
                    py: { xs: 1.5, sm: 2 },
                    fontSize: '12px',
                    fontWeight: 900,
                    minHeight: { xs: 44, sm: 48 },
                }}
            >
                I Accept
            </Button>
        </DialogActions>
    </Dialog>
);
