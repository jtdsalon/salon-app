import React, { useEffect, useMemo, ReactNode } from 'react';
import { AuthContext } from './AuthContextDef';
import { useAuthAction } from '@/components/Auth/hooks/useAuthAction';

/** AuthProvider: bridges Redux auth state to React context for backwards compatibility. */
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { initialize, isInitialized, verificationPending, isVerified, completeVerification, ...auth } = useAuthAction();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const value = useMemo(
    () => ({
      user: auth.user,
      roles: auth.roles,
      isAuthenticated: auth.isAuthenticated,
      isVerified,
      verificationPending,
      isLoading: auth.loading,
      completeVerification,
      login: async (email: string, password: string) => {
        auth.login({ email, password });
      },
      register: async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        category?: string;
      }) => {
        auth.register({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          category: userData.category,
        });
      },
      logout: async () => {
        auth.logout();
      },
      refreshToken: async () => {
        auth.refresh();
      },
    }),
    [auth.user, auth.roles, auth.isAuthenticated, isVerified, verificationPending, auth.loading, completeVerification, auth.login, auth.register, auth.logout, auth.refresh]
  );

  if (!isInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
