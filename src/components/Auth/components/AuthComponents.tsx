import React from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    IconButton,
    InputAdornment,
    TextField,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
} from '@mui/material';
import {
    Mail,
    Lock,
    User,
    Building2,
    Eye,
    EyeOff,
    ChevronLeft,
    Palette,
    Clock,
    HeartHandshake,
    X,
    Sparkles,
} from 'lucide-react';

interface AuthFormLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footerText?: string;
    footerActionText?: string;
    onFooterAction?: () => void;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
    title,
    subtitle,
    children,
    footerText,
    footerActionText,
    onFooterAction,
    showBackButton,
    onBack,
}) => (
    <Stack spacing={4}>
        {showBackButton && onBack && (
            <IconButton
                onClick={onBack}
                sx={{
                    alignSelf: 'flex-start',
                    color: 'text.secondary'
                }}
            >
                <ChevronLeft size={24} />
            </IconButton>
        )}

        <Box>
            <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                    mb: 1,
                    letterSpacing: '-0.02em'
                }}
            >
                {title.split(' ').map((word, index, array) => (
                    <React.Fragment key={word}>
                        {index === array.length - 1 ? (
                            <Box component="span" color="secondary.main">
                                {word}
                            </Box>
                        ) : (
                            word + ' '
                        )}
                    </React.Fragment>
                ))}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
            >
                {subtitle}
            </Typography>
        </Box>

        {children}

        {footerText && footerActionText && onFooterAction && (
            <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {footerText}{' '}
                    <Button
                        onClick={onFooterAction}
                        sx={{
                            color: '#EAB308',
                            fontWeight: 900,
                            p: 0,
                            minWidth: 'auto',
                            textTransform: 'none',
                            '&:hover': { color: '#ca9b07', bgcolor: 'transparent' }
                        }}
                    >
                        {footerActionText}
                    </Button>
                </Typography>
            </Box>
        )}
    </Stack>
);

interface AuthTextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onEndIconClick?: () => void;
}

export const AuthTextField: React.FC<AuthTextFieldProps> = ({
    label,
    value,
    onChange,
    error,
    type = 'text',
    startIcon,
    endIcon,
    onEndIconClick,
}) => (
    <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        type={type}
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
            }
        }}
        FormHelperTextProps={{
            sx: {
                fontWeight: 600,
                fontSize: '11px',
                mx: 0,
                mt: 0.5,
                letterSpacing: '0.02em'
            }
        }}
        InputProps={{
            startAdornment: startIcon && (
                <InputAdornment position="start">
                    {startIcon}
                </InputAdornment>
            ),
            endAdornment: endIcon && onEndIconClick && (
                <IconButton
                    size="small"
                    onClick={onEndIconClick}
                    edge="end"
                >
                    {endIcon}
                </IconButton>
            ),
        }}
    />
);

interface ManifestoDialogProps {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const ManifestoDialog: React.FC<ManifestoDialogProps> = ({
    open,
    onClose,
    onAccept,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
            sx: {
                borderRadius: 4,
                overflow: 'hidden'
            }
        }}
    >
        <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={900}>
                    The <Box component="span" color="secondary.main">Glow Manifesto</Box>
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                >
                    <X size={20} />
                </IconButton>
            </Stack>
        </DialogTitle>

        <DialogContent dividers>
            <Stack spacing={3}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                    sx={{ lineHeight: 1.6 }}
                >
                    "In this sanctuary, we believe beauty is a ritual, not a routine. We commit to the following principles of excellence."
                </Typography>

                <Stack spacing={2.5}>
                    <ManifestoPrinciple
                        icon={<Palette size={18} />}
                        title="Artistic Integrity"
                        description="Every transformation must honor the client's unique aesthetic and our collective standards of precision."
                    />

                    <ManifestoPrinciple
                        icon={<Clock size={18} />}
                        title="Sanctuary Protocol"
                        description="We maintain absolute hygiene and a serene atmosphere. Punctuality is respect for the craft."
                    />

                    <ManifestoPrinciple
                        icon={<HeartHandshake size={18} />}
                        title="Collective Loyalty"
                        description="Artisans share knowledge and respect the sanctuary's boundaries. Commission is fair, performance is rewarded."
                    />
                </Stack>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        sx={{ display: 'block' }}
                    >
                        By acknowledging this manifesto, you become a bound member of the Glow Collective,
                        subject to our aesthetic and operational guidelines.
                    </Typography>
                </Box>
            </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
            <Button
                fullWidth
                variant="contained"
                onClick={onAccept}
                sx={{
                    borderRadius: 6,
                    py: 1.5,
                    fontWeight: 900,
                    textTransform: 'none'
                }}
            >
                I Accept the Manifesto
            </Button>
        </DialogActions>
    </Dialog>
);

interface ManifestoPrincipleProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const ManifestoPrinciple: React.FC<ManifestoPrincipleProps> = ({
    icon,
    title,
    description
}) => (
    <Box>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
            <Box color="secondary.main">
                {icon}
            </Box>
            <Typography fontWeight={800} fontSize="14px">
                {title}
            </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ pl: 4 }}>
            {description}
        </Typography>
    </Box>
);

export const HeroSection = () => (
    <Box sx={{
        flex: { xs: 0, md: 1.2 },
        display: { xs: 'none', md: 'flex' },
        position: 'relative',
        bgcolor: '#0F172A'
    }}>
        <Box
            component="img"
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1400&auto=format&fit=crop"
            alt="Salon interior"
            sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.6
            }}
        />
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: 8,
                py: 4
            }}
        >
            <Stack spacing={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'secondary.main',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <Sparkles color="white" size={24} />
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="white">
                        GlowSalon Pro
                    </Typography>
                </Stack>

                <Typography
                    variant="h2"
                    fontWeight={900}
                    color="white"
                    sx={{
                        maxWidth: { xs: '100%', md: 500 },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                    }}
                >
                    The Modern{' '}
                    <Box component="span" color="secondary.main">
                        Sanctuary
                    </Box>
                    {' '}for Elite Artisans.
                </Typography>

                <Typography
                    variant="h6"
                    fontWeight={400}
                    color="rgba(255,255,255,0.8)"
                    sx={{ maxWidth: { xs: '100%', md: 400 } }}
                >
                    Curate bookings, manage your collective, and scale your aesthetic presence with AI intelligence.
                </Typography>
            </Stack>
        </Box>
    </Box>
);