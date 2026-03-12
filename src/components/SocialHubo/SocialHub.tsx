import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Fade,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Paper,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Plus, TrendingUp, Users, Heart, MessageCircle, ArrowUpRight, Award, Zap } from 'lucide-react';
import { FEED_POSTS } from './constants';
import { FeedPost } from './types';
import { FeedItem } from './FeedItem';
import FeedComposer from './FeedComposer';
import { RootState } from '../../state/store';
import { getSalon } from '../../state/salon';

const APP_NAME = "GLOW BEAUTY";
const ITEMS_PER_PAGE = 3;

const USERS = {
  customer: {
    id: 'u_me',
    name: 'Jane Doe',
    avatar: '',
    type: 'customer' as const
  },
  salon: {
    id: 's_me',
    name: 'Luxe Salon Elite',
    avatar: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=100&h=100&auto=format&fit=crop',
    type: 'salon' as const
  }
};

const SocialHub: React.FC<{ onViewSalon?: (id: string) => void }> = ({ onViewSalon }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  
  const [viewTab, setViewTab] = useState(0);
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);
  const [displayedPosts, setDisplayedPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);
  const [role, setRole] = useState<'customer' | 'salon'>('customer');
  const [salonMap, setSalonMap] = useState<Map<string, string>>(new Map()); // Map userId to real salonId

  const observerTarget = useRef<HTMLDivElement>(null);
  const currentUser = role === 'customer' ? USERS.customer : USERS.salon;

  // Filter logic based on tab
  const getFilteredBase = useCallback(() => {
    return posts.filter(p => viewTab === 0 ? p.userType === 'customer' : p.userType === 'salon');
  }, [posts, viewTab]);

  // Initial load and tab change reset
  useEffect(() => {
    if (viewTab === 2) return; // Don't run feed logic for analytics tab
    const filtered = getFilteredBase();
    setDisplayedPosts(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE || filtered.length > 0);
  }, [viewTab, posts, getFilteredBase]);

  // Infinite Scroll Logic
  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMore || viewTab === 2) return;

    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredBase = getFilteredBase();
    const startIndex = page * ITEMS_PER_PAGE;
    const nextBatch = filteredBase.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (nextBatch.length === 0 && filteredBase.length > 0) {
      const simulatedBatch = filteredBase.slice(0, ITEMS_PER_PAGE).map(p => ({
        ...p,
        id: `${p.id}-cycle-${page}`,
        timeAgo: `${page + 2}h ago`
      }));
      setDisplayedPosts(prev => [...prev, ...simulatedBatch]);
    } else {
      setDisplayedPosts(prev => [...prev, ...nextBatch]);
    }

    setPage(prev => prev + 1);
    setIsLoadingMore(false);
  }, [page, isLoadingMore, hasMore, getFilteredBase, viewTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore && viewTab !== 2) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems, isLoadingMore, viewTab]);

  const handleUpdatePost = (updated: FeedPost) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const handleDeletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  
  const handleEditPost = (post: FeedPost) => {
    setEditingPost(post);
    setIsComposerOpen(true);
  };

  const handleSavePost = (newPost: FeedPost) => {
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === newPost.id ? newPost : p));
    } else {
      setPosts(prev => [newPost, ...prev]);
    }
    setIsComposerOpen(false);
    setEditingPost(null);
  };

  // Handle salon navigation with proper ID resolution
  const handleViewSalon = (userId: string) => {
    // Try to get the real salon ID from the map
    const realSalonId = salonMap.get(userId);
    
    if (realSalonId) {
      // We have a real salon ID, navigate to it
      onViewSalon?.(realSalonId);
    } else {
      // Fallback: use the userId directly and log a warning
      console.warn('No real salon ID found for user:', userId, 'Using user ID as fallback');
      // For now, we'll still navigate but log the issue
      onViewSalon?.(userId);
    }
  };

  // --- Analytics Derivations ---
  const analyticsData = useMemo(() => {
    const salonPosts = posts.filter(p => p.userType === 'salon');
    const totalLikes = salonPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = salonPosts.reduce((sum, p) => sum + p.comments.length, 0);
    const avgEngagement = salonPosts.length ? (totalLikes + totalComments) / salonPosts.length : 0;
    
    const topPosts = [...salonPosts].sort((a, b) => 
      (b.likes + b.comments.length) - (a.likes + a.comments.length)
    ).slice(0, 3);

    return {
      followers: 12450,
      followerGrowth: '+8.4%',
      reach: 48200,
      reachGrowth: '+12%',
      engagementRate: '4.2%',
      topPosts
    };
  }, [posts]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      {/* Feed Header */}
      <Box sx={{ textAlign: 'center', pt: 6, mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: '0.2em' }}>{APP_NAME}</Typography>
        <Typography sx={{ fontSize: '8px', fontWeight: 900, color: 'secondary.main', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Aesthetic Archive</Typography>
      </Box>

      {/* Sticky Navigation Toggle */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          bgcolor: isDarkMode ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          py: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <Container maxWidth="sm">
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ 
              display: 'flex', 
              bgcolor: 'action.hover', 
              p: 0.5, 
              borderRadius: '100px',
              flex: 1,
              maxWidth: '100%'
            }}>
              {['FAVORITES', 'PUBLIC', 'INSIGHTS'].map((label, idx) => (
                <Button 
                  key={label}
                  fullWidth
                  onClick={() => setViewTab(idx)}
                  sx={{ 
                    borderRadius: '100px', 
                    fontSize: isMobile ? '7px' : '9px', 
                    fontWeight: 900, 
                    py: 1.2,
                    bgcolor: viewTab === idx ? 'background.paper' : 'transparent',
                    color: viewTab === idx ? 'text.primary' : 'text.secondary',
                    boxShadow: viewTab === idx ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { bgcolor: viewTab === idx ? 'background.paper' : 'action.selected' }
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Tooltip title="Create Masterpiece" arrow>
              <IconButton 
                onClick={() => { setEditingPost(null); setIsComposerOpen(true); }}
                sx={{ 
                  bgcolor: 'text.primary', 
                  color: 'secondary.main',
                  width: { xs: 38, sm: 42 },
                  height: { xs: 38, sm: 42 },
                  '&:hover': { bgcolor: 'text.secondary', transform: 'scale(1.05)' },
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  flexShrink: 0
                }}
              >
                <Plus size={isMobile ? 18 : 20} strokeWidth={3} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ mx: 'auto', px: 2 }}>
        {viewTab < 2 ? (
          <Fade in timeout={800} key={viewTab}>
            <Box>
              {displayedPosts.length > 0 ? (
                <>
                  {displayedPosts.map(post => (
                    <FeedItem 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                      onUpdate={handleUpdatePost}
                      onViewSalon={handleViewSalon}
                    />
                  ))}
                  
                  <Box 
                    ref={observerTarget} 
                    sx={{ 
                      height: 100, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mt: -4 
                    }}
                  >
                    {isLoadingMore && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress size={16} sx={{ color: 'secondary.main' }} />
                        <Typography sx={{ 
                          fontSize: '10px', 
                          fontWeight: 900, 
                          color: 'text.secondary', 
                          letterSpacing: '0.2em' 
                        }}>
                          RECOVERING ARCHIVES...
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </>
              ) : (
                <Box sx={{ py: 12, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px', fontStyle: 'italic', fontWeight: 300 }}>
                    The archive is empty for this category...
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        ) : (
          /* INSIGHTS VIEW */
          <Fade in timeout={800}>
            <Box sx={{ pb: 8 }}>
              {/* Metric Grid */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ p: 1, borderRadius: '100px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <Users size={18} />
                      </Box>
                      <Typography sx={{ color: '#10B981', fontWeight: 900, fontSize: '12px' }}>{analyticsData.followerGrowth}</Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 900 }}>{analyticsData.followers.toLocaleString()}</Typography>
                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>TOTAL AUDIENCE</Typography>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '32px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ p: 1, borderRadius: '100px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                        <Zap size={18} />
                      </Box>
                      <Typography sx={{ color: '#6366F1', fontWeight: 900, fontSize: '12px' }}>Healthy</Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 900 }}>{analyticsData.engagementRate}</Typography>
                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>AVG ENGAGEMENT</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Performance Chart Simulation */}
              <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '40px', border: '1.5px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '16px' }}>Growth Trajectory</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 500 }}>Daily reach impressions</Typography>
                  </Box>
                  <Tooltip title="Yield is increasing consistently">
                    <IconButton size="small"><TrendingUp size={20} color={theme.palette.secondary.main} /></IconButton>
                  </Tooltip>
                </Stack>

                <Box sx={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 1.5, px: 1 }}>
                  {[35, 45, 30, 60, 85, 55, 95].map((val, i) => (
                    <Box 
                      key={i} 
                      sx={{ 
                        flex: 1, 
                        height: `${val}%`, 
                        bgcolor: i === 6 ? 'secondary.main' : 'action.selected',
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'secondary.light' }
                      }} 
                    />
                  ))}
                </Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, px: 1 }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                    <Typography key={d} sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary' }}>{d}</Typography>
                  ))}
                </Stack>
              </Paper>

              {/* Top Performing Masterpieces */}
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '11px', letterSpacing: '0.2em', color: 'text.secondary', mb: 3, textTransform: 'uppercase' }}>
                  Top Masterpieces
                </Typography>
                
                <Stack spacing={3}>
                  {analyticsData.topPosts.map((post, idx) => (
                    <Paper 
                      key={post.id} 
                      elevation={0} 
                      sx={{ 
                        p: 2.5, 
                        borderRadius: '32px', 
                        border: '1.5px solid', 
                        borderColor: 'divider',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ position: 'relative' }}>
                          <Box 
                            component="img" 
                            src={post.image} 
                            sx={{ width: 80, height: 80, borderRadius: '20px', objectFit: 'cover' }} 
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            top: -10, 
                            left: -10, 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'secondary.main', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '4px solid',
                            borderColor: 'background.paper',
                            color: 'white'
                          }}>
                            <Award size={14} strokeWidth={3} />
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography noWrap sx={{ fontWeight: 800, fontSize: '15px', mb: 1 }}>{post.caption?.substring(0, 30)}...</Typography>
                          <Stack direction="row" spacing={3}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Heart size={14} color={theme.palette.secondary.main} fill={theme.palette.secondary.main} />
                              <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>{post.likes}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <MessageCircle size={14} color="text.secondary" />
                              <Typography sx={{ fontSize: '12px', fontWeight: 900, color: 'text.secondary' }}>{post.comments.length}</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                        <IconButton onClick={() => handleViewSalon(post.userId)} sx={{ color: 'text.secondary' }}>
                          <ArrowUpRight size={20} />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Fade>
        )}

        <FeedComposer 
          open={isComposerOpen} 
          onClose={() => { setIsComposerOpen(false); setEditingPost(null); }} 
          onSave={handleSavePost}
          editingPost={editingPost}
          currentUser={currentUser}
        />
      </Container>
    </Box>
  );
};

export default SocialHub;
