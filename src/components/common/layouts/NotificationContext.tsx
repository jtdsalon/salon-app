import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
} from '@/services/api/notificationsService';
import { useRealtime } from '@/contexts/RealtimeContext';

export interface AppNotification {
  id: string;
  type: string;
  title?: string;
  message: string;
  fromUserId?: string;
  postId?: string;
  fromUserName: string;
  fromUserAvatar: string;
  timeAgo: string;
  isRead: boolean;
  bookingId?: string | null;
  jobId?: string | null;
  reviewId?: string | null;
  navigationTarget?: string | null;
}

function mapApiToNotification(raw: any): AppNotification {
  return {
    id: raw.id,
    type: raw.type || 'system',
    title: raw.title,
    message: raw.message || '',
    fromUserId: raw.fromUserId,
    postId: raw.postId ?? undefined,
    fromUserName: raw.fromUserName || 'System',
    fromUserAvatar: raw.fromUserAvatar ?? '',
    timeAgo: raw.timeAgo || 'Just now',
    isRead: !!raw.isRead,
    bookingId: raw.bookingId ?? null,
    jobId: raw.jobId ?? null,
    reviewId: raw.reviewId ?? null,
    navigationTarget: raw.navigationTarget ?? null,
  };
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetchError: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getNotificationsApi(1, 100, undefined, signal);
      if (signal?.aborted) return;
      const body = (res?.data as any) ?? {};
      const data = Array.isArray(body) ? body : body?.data;
      const list = Array.isArray(data) ? data : [];
      setNotifications(list.map((r) => mapApiToNotification(r)));
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED' || err?.errorMessage === 'canceled') return;
      setNotifications([]);
      setFetchError(err?.errorMessage || err?.message || 'Failed to load notifications');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    return () => controller.abort();
  }, [fetchNotifications]);

  const realtime = useRealtime();
  useEffect(() => {
    if (!realtime) return;
    return realtime.subscribe('notification_new', () => {
      fetchNotifications();
    });
  }, [realtime, fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (_) {}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (_) {}
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_) {}
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await clearAllNotificationsApi();
      setNotifications([]);
    } catch (_) {}
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      fetchError,
      fetchNotifications,
      markAsRead,
      markAllRead,
      removeNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      loading,
      fetchError,
      fetchNotifications,
      markAsRead,
      markAllRead,
      removeNotification,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
