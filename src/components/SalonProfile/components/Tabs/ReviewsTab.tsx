import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  alpha,
  useTheme,
  Avatar,
  IconButton,
  Rating,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Zoom,
  Fade,
} from '@mui/material';
import {
  MessageSquare,
  Filter,
  Send,
  X as CloseIcon,
  Crown,
} from 'lucide-react';
import Grid from '@mui/material/Grid2';
import { SalonReview } from '../../types';
import { getSalonReviewsApi, replyToReviewApi } from '@/services/api/reviewService';
import { getFullImageUrl } from '@/lib/util/imageUrl';

interface ReviewsTabProps {
  salonId: string | null | undefined;
  salonRating: number;
  salonReviewsCount: number;
  theme: any;
}

/** Compute star distribution (1-5) from reviews. Returns object like { 5: 90, 4: 8, 3: 2, 2: 0, 1: 0 }. */
function getStarDistribution(reviews: SalonReview[]): Record<number, number> {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (!reviews.length) return dist;
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    dist[star] = (dist[star] ?? 0) + 1;
  });
  return dist;
}

/** Format relative date from date string if possible. */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString();
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  salonId,
  salonRating,
  salonReviewsCount,
  theme: _theme,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    if (!salonId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getSalonReviewsApi(salonId)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [salonId]);

  const starDistribution = useMemo(() => getStarDistribution(reviews), [reviews]);
  const totalForPercent = reviews.length || 1;
  const getPercent = (star: number) => Math.round(((starDistribution[star] ?? 0) / totalForPercent) * 100);

  const activeReview = activeReviewId ? reviews.find((r) => r.id === activeReviewId) : null;

  const handleOpenReplyDialog = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    setActiveReviewId(reviewId);
    setReplyText(review?.reply ?? '');
    setReplyError(null);
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setActiveReviewId(null);
    setReplyText('');
    setReplyError(null);
  };

  const handleSendReply = async () => {
    if (!activeReviewId || !replyText.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    try {
      await replyToReviewApi(activeReviewId, replyText.trim());
      setReviews((prev) =>
        prev.map((r) => (r.id === activeReviewId ? { ...r, reply: replyText.trim() } : r))
      );
      handleCloseReplyDialog();
    } catch (e: any) {
      setReplyError(e?.response?.data?.message ?? e?.message ?? 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <Fade in>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Loading reviews…</Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Customer <Box component="span" sx={{ color: '#EAB308' }}>Reviews</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Monitor and respond to your customers' feedback.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Review Stats */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '32px',
                border: '1.5px solid',
                borderColor: 'divider',
                bgcolor: isDark ? '#0B1224' : 'white',
                position: 'sticky',
                top: 100,
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#EAB308', mb: 1 }}>
                  {salonReviewsCount > 0 ? salonRating.toFixed(1) : '—'}
                </Typography>
                <Rating value={salonRating} precision={0.1} readOnly sx={{ color: '#EAB308', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  Based on {salonReviewsCount.toLocaleString()} reviews
                </Typography>
              </Box>

              <Stack spacing={2}>
                {([5, 4, 3, 2, 1] as const).map((star) => (
                  <Stack key={star} direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 900, minWidth: 15 }}>
                      {star}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getPercent(star)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.text.primary, 0.05),
                          '& .MuiLinearProgress-bar': { bgcolor: '#EAB308' },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 30 }}>
                      {getPercent(star)}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Filter size={18} />}
                sx={{ borderRadius: '12px', fontWeight: 800, py: 1.5 }}
              >
                Filter Reviews
              </Button>
            </Paper>
          </Grid>

          {/* Review List */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              {reviews.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    borderRadius: '32px',
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    textAlign: 'center',
                  }}
                >
                  <MessageSquare size={48} style={{ color: theme.palette.text.secondary, opacity: 0.5, marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Customer reviews will appear here once they leave feedback.
                  </Typography>
                </Paper>
              ) : (
                reviews.map((review) => (
                  <Paper
                    key={review.id}
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: '32px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: isDark ? '#0B1224' : 'white',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: alpha('#EAB308', 0.3),
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar
                        src={review.avatar ? getFullImageUrl(review.avatar) : undefined}
                        sx={{
                          width: 48,
                          height: 48,
                          border: '2px solid',
                          borderColor: alpha('#EAB308', 0.2),
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                            {review.user}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {formatDate(review.date) || review.date}
                          </Typography>
                        </Stack>
                        <Rating value={review.rating} size="small" readOnly sx={{ color: '#EAB308' }} />
                      </Box>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'text.secondary', mb: 3, lineHeight: 1.6 }}
                    >
                      "{review.comment}"
                    </Typography>

                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {(review.service || 'SERVICE').toUpperCase()}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => handleOpenReplyDialog(review.id)}
                        sx={{ fontWeight: 800, color: '#EAB308' }}
                      >
                        {review.reply ? 'Edit Reply' : 'Reply to Customer'}
                      </Button>
                    </Stack>

                    {review.reply && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 3,
                          borderRadius: '20px',
                          bgcolor: isDark ? alpha('#EAB308', 0.05) : alpha('#EAB308', 0.03),
                          borderLeft: '4px solid #EAB308',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: '#EAB308' }}>
                            <Crown size={12} color="#050914" />
                          </Avatar>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 900, color: '#EAB308', letterSpacing: '0.05em' }}
                          >
                            SALON RESPONSE
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontStyle: 'italic', opacity: 0.8 }}>
                          "{review.reply}"
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))
              )}

              {reviews.length > 0 && (
                <Button
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: '16px',
                    border: '1px dashed',
                    borderColor: 'divider',
                    color: 'text.secondary',
                    fontWeight: 800,
                  }}
                >
                  LOAD MORE REVIEWS
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={handleCloseReplyDialog}
          TransitionComponent={Zoom}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '32px',
              bgcolor: isDark ? '#0B1224' : 'white',
              backgroundImage: 'none',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <DialogTitle sx={{ p: 4, pb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Write a <Box component="span" sx={{ color: '#EAB308' }}>Response</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Respond to your customer's feedback.
                </Typography>
              </Box>
              <IconButton onClick={handleCloseReplyDialog} sx={{ color: 'text.secondary' }}>
                <CloseIcon size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ p: 4, pt: 0 }}>
            {activeReview && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: alpha(theme.palette.text.primary, 0.03),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1 }}
                >
                  CUSTOMER REVIEW
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontStyle: 'italic', opacity: 0.7 }}>
                  "{activeReview.comment}"
                </Typography>
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{ fontWeight: 900, color: 'text.secondary', ml: 1, mb: 1, display: 'block' }}
            >
              YOUR RESPONSE
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Thank the customer or address their feedback..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              error={!!replyError}
              helperText={replyError}
              InputProps={{
                sx: { borderRadius: '20px', fontWeight: 600, fontSize: '14px' },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSendReply}
              disabled={!replyText.trim() || sendingReply}
              startIcon={sendingReply ? null : <Send size={18} />}
              sx={{
                mt: 4,
                borderRadius: '12px',
                bgcolor: '#EAB308',
                color: '#050914',
                py: 1.8,
                fontWeight: 900,
                '&:hover': { bgcolor: '#FACC15' },
              }}
            >
              {sendingReply ? 'SENDING…' : 'SEND RESPONSE'}
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
};
