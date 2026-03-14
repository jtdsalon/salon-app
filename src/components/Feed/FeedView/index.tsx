import React from 'react';
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
} from '@mui/material';
import { Plus } from 'lucide-react';
import { FeedItem } from '../FeedItem';
import { getFeedStrings } from '../properties';
import FeedComposer from '../FeedComposer';
import InsightsView from '../InsightsView';
import { useAuthContext } from '@/state/auth';
import { useFeedViewAction } from './hooks/useFeedViewAction';
import { StorySection } from '../components';
import { FeedSearch } from '../FeedSearch';

interface FeedViewProps {
  onViewSalon?: (id: string) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ onViewSalon }) => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const currentUser = user;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    actorPage,
    navigate,
    viewTab,
    setViewTab,
    displayedPosts,
    loading,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    searchSuggestions,
    isLoadingMore,
    hasMore,
    isComposerOpen,
    editingPost,
    handleOpenComposer,
    handleEditPost,
    handleCloseComposer,
    handleUpdatePost,
    handleDeletePost,
    handleSavePost,
    handleToggleLike,
    handleToggleSave,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleToggleCommentLike,
    observerTarget,
  } = useFeedViewAction();

  const s = getFeedStrings();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12, width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Box sx={{ textAlign: 'center', pt: 6, mb: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
          {s.view.style} <Box component="span" sx={{ color: 'secondary.main' }}>{s.view.lookbook}</Box>
        </Typography>
        <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.4em', textTransform: 'uppercase' }}>{s.view.subtitle}</Typography>
      </Box>

      <Container maxWidth="sm">
        <StorySection />
        <FeedSearch
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          suggestions={searchSuggestions}
        />
      </Container>

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
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <Container maxWidth="sm">
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                display: 'flex',
                bgcolor: 'action.hover',
                p: 0.5,
                borderRadius: '100px',
                flex: 1,
                maxWidth: '100%',
              }}
            >
              {[s.view.tabFavorites, s.view.tabPublic, s.view.tabInsights].map((label, idx) => (
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
                    '&:hover': { bgcolor: viewTab === idx ? 'background.paper' : 'action.selected' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {actorPage && (
              <Tooltip title={s.view.createMasterpiece} arrow>
                <IconButton
                  onClick={handleOpenComposer}
                  sx={{
                    bgcolor: 'text.primary',
                    color: 'secondary.main',
                    width: { xs: 38, sm: 42 },
                    height: { xs: 38, sm: 42 },
                    '&:hover': { bgcolor: 'text.secondary', transform: 'scale(1.05)' },
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={isMobile ? 18 : 20} strokeWidth={3} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="sm">
        <Fade in timeout={800} appear={false}>
          <Box component="div">
            {viewTab < 2 ? (
              <>
                {loading ? (
                  <Box sx={{ py: 12, textAlign: 'center' }}>
                    <CircularProgress size={32} sx={{ color: 'secondary.main' }} />
                  </Box>
                ) : displayedPosts.length === 0 ? (
                  <Box sx={{ py: 12, textAlign: 'center', opacity: 0.5 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {viewTab === 0 ? s.view.noFavoritesArchived : s.view.noPublicEntriesFound}
                    </Typography>
                  </Box>
                ) : (
                  displayedPosts.map((post) => (
                    <FeedItem
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                      onUpdate={handleUpdatePost}
                      onViewSalon={onViewSalon ?? ((id) => navigate(`/salon/${id}`))}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddComment={handleAddComment}
                      onUpdateComment={handleUpdateComment}
                      onDeleteComment={handleDeleteComment}
                      onToggleCommentLike={handleToggleCommentLike}
                    />
                  ))
                )}
                <Box ref={observerTarget} sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isLoadingMore && hasMore && (
                    <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
                  )}
                </Box>
              </>
            ) : (
              <InsightsView onViewSalon={(id) => navigate(`/salon/${id}`)} />
            )}
          </Box>
        </Fade>

        <FeedComposer open={isComposerOpen} onClose={handleCloseComposer} onSave={handleSavePost} currentUser={currentUser} actorPage={actorPage} initialPost={editingPost} />
      </Container>
    </Box>
  );
};

export default FeedView;
