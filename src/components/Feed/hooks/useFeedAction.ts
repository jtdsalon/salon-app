import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { FeedPost } from '../types';
import type { RootState } from '@/state/store';
import { useRealtime } from '@/contexts/RealtimeContext';
import {
  createPost,
  getFeedPosts,
  updatePost,
  deletePost,
  updateFeedPost,
  togglePostLike,
  togglePostSave,
  addPostComment,
  updatePostComment,
  deletePostComment,
  togglePostCommentLike,
} from '@/state/feed';
import { useLayout } from '@/components/common/layouts/layoutContext';
import { useAuthContext } from '@/state/auth';
import { getFilteredPosts, getBaseSuggestions } from '../feedSelectors';
import type { FeedFilters } from '../FeedSearch';

const ITEMS_PER_PAGE = 3;

export function useFeedAction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { favorites, followedUsers } = useLayout();
  const feed = useSelector((s: RootState) => s.feed);

  const [viewTab, setViewTab] = useState(0);
  const [displayedPosts, setDisplayedPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FeedFilters>({
    categories: [],
    sortBy: 'newest',
    contentType: 'all',
  });

  const observerTarget = useRef<HTMLDivElement>(null);
  const prevViewTabRef = useRef<number | null>(null);
  const prevSearchFilterRef = useRef<string>('');
  const displayedPostsRef = useRef<FeedPost[]>(displayedPosts);
  displayedPostsRef.current = displayedPosts;

  const actorPage = user?.pages?.find((p) => p.salonId === user?.salonId);

  const tabFilter = useCallback(
    (p: FeedPost) => {
      const isOwnPost = user && (p.userId === (user.id || (user as { sub?: string }).sub) || (actorPage && p.userId === actorPage.pageId));
      const isFromFavouriteUserOrPage = favorites.includes(p.userId) || followedUsers.includes(p.userId);
      const isFavourite = isOwnPost || isFromFavouriteUserOrPage;
      if (viewTab === 0) return isFavourite;
      return !isFavourite;
    },
    [viewTab, favorites, followedUsers, user?.id, (user as { sub?: string })?.sub, actorPage?.pageId]
  );

  const getFilteredBase = useCallback(() => {
    const posts = feed?.posts ?? [];
    return getFilteredPosts(posts, searchQuery, activeFilters, tabFilter);
  }, [feed?.posts, searchQuery, activeFilters, tabFilter]);

  const searchSuggestions = useMemo(() => {
    return getBaseSuggestions(feed?.posts ?? []);
  }, [feed?.posts]);

  useEffect(() => {
    dispatch(getFeedPosts());
  }, [dispatch]);

  const realtime = useRealtime();
  useEffect(() => {
    if (!realtime) return;
    realtime.joinFeed();
    return () => {
      realtime.leaveFeed();
    };
  }, [realtime]);

  useEffect(() => {
    if (!realtime) return;
    return realtime.subscribe('feed_updated', () => {
      dispatch(getFeedPosts({ silent: true }));
    });
  }, [realtime, dispatch]);

  useEffect(() => {
    if (viewTab === 2) return; // Insights tab - don't run feed logic
    const filtered = getFilteredBase();
    const viewTabChanged = prevViewTabRef.current !== null && prevViewTabRef.current !== viewTab;
    const searchFilterKey = `${searchQuery}|${activeFilters.categories.join(',')}|${activeFilters.sortBy}|${activeFilters.contentType}`;
    const searchFilterChanged = prevSearchFilterRef.current !== searchFilterKey;
    prevViewTabRef.current = viewTab;
    prevSearchFilterRef.current = searchFilterKey;
    const prev = displayedPostsRef.current;

    // Reset when tab or search/filters change
    if (viewTabChanged || searchFilterChanged) {
      setDisplayedPosts(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
      return;
    }

    // Initial load: feed arrived and we have nothing shown
    if (prev.length === 0 && filtered.length > 0) {
      setDisplayedPosts(filtered.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
      return;
    }

    // Merge updates (like, comment, delete) without resetting pagination
    const posts = feed?.posts ?? [];
    if (prev.length > 0 && posts.length > 0) {
      const filteredIds = new Set(filtered.map((p) => p.id));
      const prevIds = new Set(prev.map((p) => p.id));
      const hasNewPosts = filtered.some((p) => !prevIds.has(p.id));

      if (hasNewPosts) {
        setDisplayedPosts(filtered.slice(0, ITEMS_PER_PAGE));
        setPage(1);
        setHasMore(filtered.length > ITEMS_PER_PAGE);
      } else {
        setDisplayedPosts(
          prev
            .map((p) => posts.find((x) => x.id === p.id) ?? p)
            .filter((p) => filteredIds.has(p.id))
        );
      }
    }
  }, [viewTab, feed?.posts, getFilteredBase, searchQuery, activeFilters]);

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMore || viewTab === 2) return;
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredBase = getFilteredBase();
    const startIndex = page * ITEMS_PER_PAGE;
    const nextBatch = filteredBase.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (nextBatch.length > 0) {
      setDisplayedPosts(prev => [...prev, ...nextBatch]);
      setPage(prev => prev + 1);
      setHasMore(startIndex + nextBatch.length < filteredBase.length);
    } else {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  }, [getFilteredBase, hasMore, isLoadingMore, page, viewTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0]?.isIntersecting) loadMoreItems(); },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMoreItems]);

  const handleUpdatePost = useCallback((updated: FeedPost) => {
    dispatch(updateFeedPost(updated));
  }, [dispatch]);

  const handleDeletePost = useCallback((id: string) => {
    dispatch(deletePost(id));
  }, [dispatch]);

  const handleSavePost = useCallback((newPost: FeedPost) => {
    const base = {
      content: newPost.caption,
      image: newPost.image,
      image_before: newPost.imageBefore,
      is_transformation: newPost.isTransformation,
    };
    if (editingPost) {
      dispatch(updatePost(editingPost.id, base));
      setEditingPost(null);
    } else {
      dispatch(createPost({ ...base, page_id: actorPage?.pageId }));
    }
    setIsComposerOpen(false);
  }, [dispatch, editingPost, actorPage?.pageId]);

  const handleToggleLike = useCallback((postId: string) => {
    dispatch(togglePostLike(postId, actorPage?.pageId));
  }, [dispatch, actorPage?.pageId]);

  const handleToggleSave = useCallback((postId: string) => {
    dispatch(togglePostSave(postId));
  }, [dispatch]);

  const handleAddComment = useCallback((postId: string, comment: string) => {
    dispatch(addPostComment(postId, comment, actorPage?.pageId));
  }, [dispatch, actorPage?.pageId]);

  const handleUpdateComment = useCallback((postId: string, commentId: string, comment: string) => {
    dispatch(updatePostComment(postId, commentId, comment));
  }, [dispatch]);

  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    dispatch(deletePostComment(postId, commentId));
  }, [dispatch]);

  const handleToggleCommentLike = useCallback((postId: string, commentId: string) => {
    dispatch(togglePostCommentLike(postId, commentId));
  }, [dispatch]);

  const handleOpenComposer = useCallback(() => {
    setEditingPost(null);
    setIsComposerOpen(true);
  }, []);
  const handleEditPost = useCallback((post: FeedPost) => {
    setEditingPost(post);
    setIsComposerOpen(true);
  }, []);
  const handleCloseComposer = useCallback(() => {
    setEditingPost(null);
    setIsComposerOpen(false);
  }, []);

  return {
    actorPage,
    navigate,
    viewTab,
    setViewTab,
    displayedPosts,
    feed,
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
  };
}
