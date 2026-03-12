import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Fade,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { FeedItem } from '../../FeedItem';
import type { FeedPost } from '../../types';
import { useAuthContext } from '@/state/auth';
import type { RootState } from '@/state/store';
import {
  addPostComment,
  deletePost,
  deletePostComment,
  togglePostCommentLike,
  togglePostLike,
  togglePostSave,
  updateFeedPost,
  updatePostComment,
} from '@/state/feed';
import { getPostByIdApi, mapApiPostToFeedPost } from '@/services/api/feedService';

const PostDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useAuthContext();
  const feed = useSelector((state: RootState) => state.feed);
  const feedPosts = useMemo(() => {
    const byId = new Map<string, FeedPost>();
    [...(feed.posts ?? []), ...(feed.favourites?.posts ?? []), ...(feed.public?.posts ?? [])].forEach((p) => {
      if (p.id && !byId.has(p.id)) byId.set(p.id, p);
    });
    return Array.from(byId.values());
  }, [feed.posts, feed.favourites?.posts, feed.public?.posts]);

  const actorPage = useMemo(
    () => user?.pages?.find((page) => page.salonId === user?.salonId),
    [user]
  );

  const syncedPost = useMemo(
    () => (id ? feedPosts.find((feedPost) => feedPost.id === id) ?? null : null),
    [feedPosts, id]
  );

  const [post, setPost] = useState<FeedPost | null>(syncedPost);
  const [isLoading, setIsLoading] = useState(!syncedPost);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    if (syncedPost) {
      setPost(syncedPost);
      setIsLoading(false);
      setError(null);
    }
  }, [syncedPost]);

  useEffect(() => {
    let isActive = true;

    if (!id) {
      setError('This post could not be found.');
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchPost = async () => {
      if (!syncedPost) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await getPostByIdApi(id);
        const mappedPost = mapApiPostToFeedPost(response.data.data);

        if (!isActive) {
          return;
        }

        setPost(mappedPost);
        dispatch(updateFeedPost(mappedPost));
      } catch (fetchError) {
        console.error('Failed to fetch post details:', fetchError);

        if (!isActive || syncedPost) {
          return;
        }

        setError('This post is unavailable or may have been removed.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isActive = false;
    };
  }, [dispatch, id, syncedPost]);

  const handleDeletePost = (postId: string) => {
    dispatch(deletePost(postId));
    navigate('/social-hub');
  };

  const handleUpdatePost = (updated: FeedPost) => {
    setPost(updated);
    dispatch(updateFeedPost(updated));
  };

  const handleToggleLike = (postId: string) => {
    dispatch(togglePostLike(postId, actorPage?.pageId));
  };

  const handleToggleSave = (postId: string) => {
    dispatch(togglePostSave(postId));
  };

  const handleAddComment = (postId: string, comment: string) => {
    dispatch(addPostComment(postId, comment, actorPage?.pageId));
  };

  const handleUpdateComment = (postId: string, commentId: string, comment: string) => {
    dispatch(updatePostComment(postId, commentId, comment));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    dispatch(deletePostComment(postId, commentId));
  };

  const handleToggleCommentLike = (postId: string, commentId: string) => {
    dispatch(togglePostCommentLike(postId, commentId));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(2, 6, 23, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1,
          mb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Post Details
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm">
        {isLoading ? (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ color: 'secondary.main' }} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <AlertCircle
              size={48}
              color={theme.palette.text.secondary}
              strokeWidth={1}
              style={{ marginBottom: 24 }}
            />
            <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 3 }}>
              {error}
            </Typography>
            <Button
              onClick={() => navigate('/social-hub')}
              variant="text"
              sx={{ color: 'secondary.main', fontWeight: 900, letterSpacing: '0.06em' }}
            >
              Return to Social Hub
            </Button>
          </Box>
        ) : post ? (
          <Fade in timeout={400}>
            <Box>
              <FeedItem
                post={post}
                currentUser={user}
                onDelete={handleDeletePost}
                onEdit={() => {}}
                onUpdate={handleUpdatePost}
                onViewSalon={(salonId) => navigate(`/salon/${salonId}`)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                onToggleCommentLike={handleToggleCommentLike}
              />
            </Box>
          </Fade>
        ) : null}
      </Container>
    </Box>
  );
};

export default PostDetailView;
