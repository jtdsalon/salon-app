import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LayoutContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  followedUsers: string[];
  toggleFollowedUser: (id: string) => void;
  savedPosts: string[];
  toggleSavePost: (id: string) => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'salon-app:favorites';
const FOLLOWED_USERS_STORAGE_KEY = 'salon-app:followed-users';
const SAVED_POSTS_STORAGE_KEY = 'salon-app:saved-posts';

const readStoredIds = (key: string): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return [];
  }
};

export const useLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (context) return context;
  return {
    favorites: [],
    toggleFavorite: () => {},
    followedUsers: [],
    toggleFollowedUser: () => {},
    savedPosts: [],
    toggleSavePost: () => {},
  };
};

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readStoredIds(FAVORITES_STORAGE_KEY));
  const [followedUsers, setFollowedUsers] = useState<string[]>(() => readStoredIds(FOLLOWED_USERS_STORAGE_KEY));
  const [savedPosts, setSavedPosts] = useState<string[]>(() => readStoredIds(SAVED_POSTS_STORAGE_KEY));

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const toggleFollowedUser = useCallback((id: string) => {
    setFollowedUsers((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const toggleSavePost = useCallback((id: string) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(FOLLOWED_USERS_STORAGE_KEY, JSON.stringify(followedUsers));
  }, [followedUsers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SAVED_POSTS_STORAGE_KEY, JSON.stringify(savedPosts));
  }, [savedPosts]);

  const value: LayoutContextValue = {
    favorites,
    toggleFavorite,
    followedUsers,
    toggleFollowedUser,
    savedPosts,
    toggleSavePost,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
