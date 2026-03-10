
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Collapse,
  InputBase,
  Divider,
  Fade,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Sparkles,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Check,
  Trash,
  Pencil,
  Send,
  X
} from 'lucide-react';
import { FeedPost, Comment } from './types';
import { ComparisonSlider } from './ComparisonSlider';

const ExpandableText = ({ text, limit = 90, userName, isComment = false }: { text: string; limit?: number; userName?: string; isComment?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = text.length > limit;

  return (
    <Typography sx={{ 
      fontSize: '12px', 
      lineHeight: 1.5, 
      color: '#64748b', 
      fontWeight: 300,
      margin: 0,
      fontFamily: '"Inter", sans-serif'
    }}>
      {userName && <Box component="span" sx={{ fontWeight: 800, mr: 1, color: 'text.primary' }}>{userName}</Box>}
      {isExpanded ? text : `${text.slice(0, limit)}${needsExpansion ? '...' : ''}`}
      {needsExpansion && (
        <Typography
          component="span"
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          sx={{
            display: 'inline-block', ml: 0.5,
            fontSize: '10px', fontWeight: 900,
            color: 'secondary.main', cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {isExpanded ? ' LESS' : ' READ MORE'}
        </Typography>
      )}
    </Typography>
  );
};

interface FeedItemProps {
  post: FeedPost;
  currentUser: any;
  onDelete: (id: string) => void;
  onEdit: (post: FeedPost) => void;
  onUpdate: (post: FeedPost) => void;
  onViewSalon?: (id: string) => void;
}

export const FeedItem = ({
  post,
  currentUser,
  onDelete,
  onEdit,
  onUpdate,
  onViewSalon
}: FeedItemProps) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleToggleGlow = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onUpdate({
      ...post,
      isLiked: newLiked,
      likes: post.likes + (newLiked ? 1 : -1)
    });
  };

  const handleHeaderClick = () => {
    if (post.userType === 'salon' && onViewSalon) {
      onViewSalon(post.userId);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userType: currentUser.type,
      text: newComment.trim(),
      timeAgo: 'Just now',
      likes: 0,
      isLiked: false
    };

    onUpdate({
      ...post,
      comments: [comment, ...post.comments]
    });
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = post.comments.map(c => {
      if (c.id === commentId) {
        const isCurrentlyLiked = c.isLiked || false;
        return {
          ...c,
          isLiked: !isCurrentlyLiked,
          likes: c.likes + (isCurrentlyLiked ? -1 : 1)
        };
      }
      return c;
    });
    onUpdate({ ...post, comments: updatedComments });
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    onUpdate({ ...post, comments: updatedComments });
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const saveEdit = (commentId: string) => {
    if (!editingText.trim()) return;
    const updatedComments = post.comments.map(c =>
      c.id === commentId ? { ...c, text: editingText.trim() } : c
    );
    onUpdate({ ...post, comments: updatedComments });
    setEditingCommentId(null);
    setEditingText('');
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 8, borderRadius: '0', bgcolor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`, pb: 6,
        maxWidth: 480, mx: 'auto',
        transition: 'all 0.3s ease'
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.userAvatar}
            onClick={handleHeaderClick}
            sx={{
              width: 42, height: 42, border: `1px solid ${theme.palette.divider}`,
              cursor: post.userType === 'salon' ? 'pointer' : 'default'
            }}
          />
        }
        title={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography
              onClick={handleHeaderClick}
              sx={{
                fontWeight: 800, color: 'text.primary', fontSize: '14px',
                cursor: post.userType === 'salon' ? 'pointer' : 'default'
              }}
            >
              {post.userName}
            </Typography>
            {post.userType === 'salon' && <Check size={14} color="#EAB308" strokeWidth={4} />}
          </Stack>
        }
        subheader={<Typography sx={{ color: 'text.secondary', fontSize: '11px', fontWeight: 400, opacity: 0.6 }}>{post.timeAgo}</Typography>}
        action={
          <>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertical size={16} color="#94a3b8" /></IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { borderRadius: '12px', border: `1px solid ${theme.palette.divider}`, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' } }}
            >
              {currentUser && post.userId === currentUser.id && (
                <MenuItem onClick={() => { setAnchorEl(null); onEdit(post); }} sx={{ fontSize: '12px', gap: 1.5, fontWeight: 600 }}>
                  <Pencil size={14} color={theme.palette.secondary.main} /> Edit
                </MenuItem>
              )}
              {currentUser && post.userId === currentUser.id && (
                <MenuItem onClick={() => { setAnchorEl(null); onDelete(post.id); }} sx={{ fontSize: '12px', color: '#ef4444', gap: 1.5, fontWeight: 600 }}>
                  <Trash size={14} /> Remove
                </MenuItem>
              )}
              <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: '12px', gap: 1.5, fontWeight: 600 }}>
                <Share2 size={14} /> Share
              </MenuItem>
            </Menu>
          </>
        }
        sx={{ px: 0, py: 1.5 }}
      />

      <Box
        sx={{
          position: 'relative',
          borderRadius: '40px',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1.5px solid ${theme.palette.divider}`,
          aspectRatio: '4/5',
          boxShadow: '0 20px 45px rgba(0,0,0,0.04)'
        }}
      >
        {post.isTransformation && post.image && post.imageBefore ? (
          <>
            <Box sx={{ 
              position: 'absolute', top: 20, left: 20, zIndex: 10, 
              bgcolor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)', 
              color: 'white', px: 1.2, py: 0.5, borderRadius: '6px', 
              fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' 
            }}>
              ORIGIN
            </Box>
            <Box sx={{ 
              position: 'absolute', top: 20, right: 20, zIndex: 10, 
              bgcolor: 'rgba(181, 148, 16, 0.4)', backdropFilter: 'blur(8px)', 
              color: 'white', px: 1.2, py: 0.5, borderRadius: '6px', 
              fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em' 
            }}>
              MASTERPIECE
            </Box>
            <ComparisonSlider before={post.imageBefore} after={post.image} />
          </>
        ) : (
          <Box
            component="img"
            src={post.image}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <CardActions sx={{ px: 0, pt: 2, pb: 0, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={handleToggleGlow}>
            <IconButton size="small" sx={{ p: 0.5, color: liked ? 'secondary.main' : '#94a3b8' }}>
              <Sparkles size={20} fill={liked ? theme.palette.secondary.main : 'none'} strokeWidth={1.5} />
            </IconButton>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography sx={{ fontSize: '13px', fontWeight: 800, color: liked ? 'secondary.main' : 'text.primary' }}>
                {post.likes}
              </Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>GLOWS</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
            <IconButton size="small" sx={{ p: 0.5, color: '#94a3b8' }}>
              <MessageCircle size={20} strokeWidth={1.5} />
            </IconButton>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography sx={{ fontSize: '13px', fontWeight: 800, color: 'text.primary' }}>
                {post.comments.length}
              </Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>THOUGHTS</Typography>
            </Stack>
          </Stack>

          <IconButton size="small" sx={{ p: 0.5, color: '#94a3b8' }}><Share2 size={20} strokeWidth={1.5} /></IconButton>
        </Stack>
        <IconButton size="small" sx={{ p: 0.5, color: '#94a3b8' }}><Bookmark size={20} strokeWidth={1.5} /></IconButton>
      </CardActions>

      <CardContent sx={{ px: 0, py: 1.5 }}>
        <ExpandableText text={post.caption || ''} userName={post.userName} limit={130} />
      </CardContent>

      <Collapse in={showComments} timeout="auto">
        <Box sx={{ mt: 1, px: 0 }}>
          <Divider sx={{ mb: 2, opacity: 0.3 }} />
          <Stack spacing={2} sx={{ mb: 2, maxHeight: 300, overflowY: 'auto', pr: 1 }}>
            {post.comments.map((comment) => (
              <Fade in key={comment.id}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar src={comment.userAvatar} sx={{ width: 28, height: 28 }} />
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{comment.userName}</Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleLikeComment(comment.id)} sx={{ p: 0.5, color: comment.isLiked ? 'secondary.main' : '#94a3b8' }}>
                          <Sparkles size={12} fill={comment.isLiked ? theme.palette.secondary.main : 'none'} />
                        </IconButton>
                        {currentUser && comment.userId === currentUser.id && (
                          <>
                            <IconButton size="small" onClick={() => startEditing(comment)} sx={{ p: 0.5, color: '#94a3b8' }}><Pencil size={12} /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteComment(comment.id)} sx={{ p: 0.5, color: '#94a3b8' }}><Trash size={12} /></IconButton>
                          </>
                        )}
                      </Stack>
                    </Stack>
                    {editingCommentId === comment.id ? (
                      <InputBase
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(comment.id)}
                        fullWidth
                        sx={{ fontSize: '12px', borderBottom: `1px solid ${theme.palette.secondary.main}` }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: '12px', color: '#64748b', fontWeight: 300 }}>{comment.text}</Typography>
                    )}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Stack>
          {currentUser && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
              <Avatar src={currentUser.avatar} sx={{ width: 28, height: 28 }} />
              <InputBase
                placeholder="Share your curation..."
                fullWidth
                sx={{ fontSize: '12px', borderBottom: `1px solid ${theme.palette.divider}`, py: 0.5 }}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <IconButton onClick={handleAddComment} disabled={!newComment.trim()} sx={{ color: 'secondary.main', p: 0.5 }}>
                <Send size={16} />
              </IconButton>
            </Stack>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};
