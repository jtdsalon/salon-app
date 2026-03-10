import React from 'react';
import { Lock, CheckCircle2, Monitor, User, Activity } from 'lucide-react';

export function getActivityIcon(action: string, targetType: string) {
  const lower = (action + targetType).toLowerCase();
  if (lower.includes('password') || lower.includes('security')) return <Lock size={14} />;
  if (lower.includes('appointment') || lower.includes('booking')) return <CheckCircle2 size={14} />;
  if (lower.includes('login') || lower.includes('session')) return <Monitor size={14} />;
  if (lower.includes('profile') || lower.includes('settings')) return <User size={14} />;
  return <Activity size={14} />;
}

export function formatActivityDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  if (diffDays === 1) return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
