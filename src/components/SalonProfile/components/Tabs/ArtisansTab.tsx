import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Stack,
    Typography,
    Button,
    Paper,
    Grid2,
    IconButton,
    Tooltip,
    Divider,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Fade } from '@mui/material';
import {
    UserPlus,
    Pencil,
    Trash2,
    Briefcase,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import { ROUTES } from '@/routes/routeConfig';
import { Staff } from '../../types';
interface ArtisansTabProps {
    staffList: Staff[];
    theme: any;
    onEdit: (staff: Staff) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
}

export const ArtisansTab: React.FC<ArtisansTabProps> = ({
    staffList,
    theme,
    onEdit,
    onDelete,
    onAdd,
}) => {
    const navigate = useNavigate();
    const themeFromHook = useTheme();
    const isMobile = useMediaQuery(themeFromHook.breakpoints.down('sm'));
    const calculateTotalRevenue = () => {
        return staffList.reduce((sum, member) => sum + member.monthlyRevenue, 0);
    };

    const calculateAverageRating = () => {
        if (staffList.length === 0) return 0;
        const total = staffList.reduce((sum, member) => sum + member.rating, 0);
        return total / staffList.length;
    };

    const calculateOptimizationPercentage = () => {
        // Simple calculation based on active staff vs capacity
        const activeStaff = staffList.filter(s => s.status === 'active').length;
        const optimalCapacity = Math.max(staffList.length * 0.9, 1); // Assume 90% is optimal
        return Math.min(Math.round((activeStaff / optimalCapacity) * 100), 100);
    };

    return (
        <Fade in>
            <Box>
                {/* Header Section */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={{ xs: 2, sm: 0 }} sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                            Staff
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Curate and manage your world-class team of professionals.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<UserPlus size={16} />}
                        onClick={onAdd}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            fontSize: '11px',
                            fontWeight: 900,
                            px: 2.5,
                            py: 1.5,
                            minHeight: 44,
                            '&:hover': { bgcolor: 'text.primary', opacity: 0.9 },
                        }}
                    >
                        Add staff member
                    </Button>
                </Stack>

                {/* Metrics Cards */}
                <Grid2 container spacing={3} sx={{ mb: 5 }}>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            borderRadius: '24px',
                            border: '1.5px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'secondary.main',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            }
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrendingUp size={20} />
                            </Box>
                            <Box>
                                <Typography sx={{
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}>
                                    COLLECTIVE YIELD
                                </Typography>
                                <Typography sx={{
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Rs. {(calculateTotalRevenue() / 1000).toFixed(1)}k
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            borderRadius: '24px',
                            border: '1.5px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'secondary.main',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            }
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                bgcolor: 'rgba(181, 148, 16, 0.1)',
                                color: 'secondary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Star size={20} />
                            </Box>
                            <Box>
                                <Typography sx={{
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}>
                                    AVG ARTISAN RATING
                                </Typography>
                                <Typography sx={{
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    color: 'text.primary'
                                }}>
                                    {calculateAverageRating().toFixed(2)} / 5.0
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            borderRadius: '24px',
                            border: '1.5px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'secondary.main',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            }
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366F1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Users size={20} />
                            </Box>
                            <Box>
                                <Typography sx={{
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}>
                                    STUDIO CAPACITY
                                </Typography>
                                <Typography sx={{
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    background: 'linear-gradient(90deg, #6366F1 0%, #4F46E5 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {calculateOptimizationPercentage()}% Optimized
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid2>
                </Grid2>

                {/* Artisans Table (desktop) / Card list (mobile) */}
                {isMobile ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {staffList.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '24px',
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    py: 8,
                                    px: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <Users size={48} color={theme.palette.divider} style={{ marginBottom: 16 }} />
                                <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '14px', mb: 2 }}>
                                    No staff members added yet
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<UserPlus size={16} />}
                                    onClick={onAdd}
                                    sx={{ borderRadius: '100px', borderColor: 'divider', fontWeight: 700 }}
                                >
                                    Add First Staff Member
                                </Button>
                            </Paper>
                        ) : (
                            staffList.map((member) => (
                                <Paper
                                    key={member.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '20px',
                                        border: '1.5px solid',
                                        borderColor: 'divider',
                                        p: 2,
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                            <Avatar
                                                src={member.avatar}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    border: '2px solid',
                                                    borderColor: 'divider',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Box sx={{ minWidth: 0 }} component="button" type="button" onClick={() => navigate(`${ROUTES.STAFF_PORTAL}/${member.id}`)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}>{member.name}</Typography>
                                                <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600, fontFamily: 'monospace' }}>
                                                    ID: ART-{member.id.split('-')[1]?.toUpperCase() || 'SYS'}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                    <Briefcase size={12} color={theme.palette.text.secondary} />
                                                    <Typography sx={{ fontWeight: 600, fontSize: '12px' }}>{member.role}</Typography>
                                                </Stack>
                                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                                                    <Chip
                                                        label={`${Math.round(member.commissionRate * 100)}%`}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 900,
                                                            fontSize: '10px',
                                                            borderRadius: '8px',
                                                            bgcolor: 'rgba(16, 185, 129, 0.05)',
                                                            color: '#10B981',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                        }}
                                                    />
                                                    <Chip
                                                        label={member.status.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 900,
                                                            fontSize: '10px',
                                                            borderRadius: '6px',
                                                            letterSpacing: '0.05em',
                                                            bgcolor: member.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : member.status === 'on-leave' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                                            color: member.status === 'active' ? '#10B981' : member.status === 'on-leave' ? '#F59E0B' : '#64748B',
                                                        }}
                                                    />
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Star size={12} fill={theme.palette.secondary.main} color={theme.palette.secondary.main} />
                                                        <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{member.rating.toFixed(1)}</Typography>
                                                    </Stack>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.secondary' }}>
                                                        Rs. {(member.monthlyRevenue / 1000).toFixed(1)}k
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton size="small" onClick={() => onEdit(member)} aria-label="Edit">
                                                <Pencil size={16} />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => onDelete(member.id)} aria-label="Delete" sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)' } }}>
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))
                        )}
                    </Box>
                ) : (
                <TableContainer component={Paper} elevation={0} sx={{
                    borderRadius: '40px',
                    border: '1.5px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }
                }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    py: 3,
                                    pl: 4,
                                    letterSpacing: '0.1em'
                                }}>
                                    ARTISAN DOSSIER
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em'
                                }}>
                                    SPECIALTY
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em'
                                }}>
                                    YIELD SHARE
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em'
                                }}>
                                    METRICAL ANALYSIS
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    letterSpacing: '0.1em'
                                }}>
                                    DEPLOYMENT
                                </TableCell>
                                <TableCell align="right" sx={{
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    pr: 4,
                                    letterSpacing: '0.1em'
                                }}>
                                    ACTIONS
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {staffList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Stack alignItems="center" spacing={2}>
                                            <Users size={48} color={theme.palette.divider} />
                                            <Typography sx={{
                                                color: 'text.secondary',
                                                fontWeight: 600,
                                                fontStyle: 'italic'
                                            }}>
                                                No staff members added yet
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<UserPlus size={16} />}
                                                onClick={onAdd}
                                                sx={{
                                                    borderRadius: '100px',
                                                    borderColor: 'divider',
                                                    fontWeight: 700
                                                }}
                                            >
                                                Add First Staff Member
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                staffList.map((member) => (
                                    <TableRow
                                        key={member.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.02)',
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ py: 3, pl: 4 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    src={member.avatar}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        border: '2px solid',
                                                        borderColor: 'divider',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Box component="button" type="button" onClick={() => navigate(`${ROUTES.STAFF_PORTAL}/${member.id}`)} sx={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                                                    <Typography sx={{
                                                        fontWeight: 800,
                                                        fontSize: '15px',
                                                        letterSpacing: '-0.01em',
                                                        color: 'text.primary',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}>
                                                        {member.name}
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontSize: '11px',
                                                        color: 'text.secondary',
                                                        fontWeight: 600,
                                                        fontFamily: 'monospace'
                                                    }}>
                                                        ID: ART-{member.id.split('-')[1]?.toUpperCase() || 'SYS'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Briefcase size={14} color={theme.palette.text.secondary} />
                                                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                                                    {member.role}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${Math.round(member.commissionRate * 100)}%`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 900,
                                                    fontSize: '11px',
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'rgba(16, 185, 129, 0.05)',
                                                    color: '#10B981'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Star size={12} fill={theme.palette.secondary.main} color={theme.palette.secondary.main} />
                                                    <Typography sx={{
                                                        fontWeight: 900,
                                                        fontSize: '13px',
                                                        color: 'secondary.main'
                                                    }}>
                                                        {member.rating.toFixed(1)}
                                                    </Typography>
                                                </Stack>
                                                <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                                                <Typography sx={{
                                                    fontWeight: 700,
                                                    fontSize: '13px',
                                                    color: 'text.secondary'
                                                }}>
                                                    Rs. {(member.monthlyRevenue / 1000).toFixed(1)}k
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={member.status.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    fontWeight: 900,
                                                    fontSize: '10px',
                                                    borderRadius: '6px',
                                                    letterSpacing: '0.05em',
                                                    bgcolor: member.status === 'active'
                                                        ? 'rgba(16, 185, 129, 0.1)'
                                                        : member.status === 'on-leave'
                                                            ? 'rgba(245, 158, 11, 0.1)'
                                                            : 'rgba(148, 163, 184, 0.1)',
                                                    color: member.status === 'active'
                                                        ? '#10B981'
                                                        : member.status === 'on-leave'
                                                            ? '#F59E0B'
                                                            : '#64748B'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Refine Dossier" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(member)}
                                                        sx={{
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: 'text.primary',
                                                                bgcolor: 'action.hover',
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Pencil size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Archive Staff Member" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDelete(member.id)}
                                                        sx={{
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: '#ef4444',
                                                                bgcolor: 'rgba(239, 68, 68, 0.05)',
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
            </Box>
        </Fade>
    );
};