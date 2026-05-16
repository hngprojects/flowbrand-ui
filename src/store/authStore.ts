import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        authService.logout();
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      // Restore isAuthenticated based on persisted token and user
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AuthStore>;
        const user = persisted.user ?? currentState.user;
        const token = persisted.token ?? currentState.token;
        const isAuthenticated = Boolean(user && token);

        return {
          ...currentState,
          ...persisted,
          user,
          token,
          isAuthenticated,
          isLoading: false,
        };
      },
    }
  )
);