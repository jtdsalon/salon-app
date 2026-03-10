import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    IconButton
} from '@mui/material';
import { X } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const ManifestoDialog = ({ open, onClose, onAccept }: Props) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={900}>Terms and Conditions</Typography>
                <IconButton onClick={onClose}>
                    <X size={18} />
                </IconButton>
            </Stack>
        </DialogTitle>

        <DialogContent>
            <Typography variant="body2" color="text.secondary">
                By creating an account, you agree to our terms of service and privacy policy.
            </Typography>
        </DialogContent>

        <DialogActions>
            <Button fullWidth variant="contained" onClick={onAccept}>
                I Accept
            </Button>
        </DialogActions>
    </Dialog>
);
