// filepath: salon-app/src/state/auth/AuthContextDef.ts
import React, { createContext } from 'react';
import type { SalonRole, SalonPage } from './types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  salonId?: string;
  phone?: string;
  roles?: SalonRole[];
  subscription?: {
    isPro: boolean;
    banner: { type: 'trial_ending' | 'payment_due' | 'expired'; daysLeft?: number } | null;
  };
  pages?: SalonPage[];
}

export interface AuthContextType {
  user: User | null;
  roles: SalonRole[];
  isAuthenticated: boolean;
  isVerified: boolean;
  verificationPending: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  completeVerification: (user?: unknown) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
