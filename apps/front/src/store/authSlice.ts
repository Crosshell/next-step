import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isConfirmed: boolean;
  isLogged: boolean;
  role: string | undefined;
  hasProfile: boolean;
  setIsConfirmed: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
  setRole: (role: string | undefined) => void;
  setHasProfile: (value: boolean) => void;
}

export const useAuthStore = create<ModalState>()(
  persist(
    (set) => ({
      isConfirmed: false,
      isLogged: false,
      role: undefined,
      hasProfile: false,
      setIsConfirmed: (value) => set({ isConfirmed: value }),
      setIsLogged: (value) => set({ isLogged: value }),
      setRole: (role) => set({ role }),
      setHasProfile: (value) => set({ hasProfile: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isConfirmed: state.isConfirmed,
        isLogged: state.isLogged,
        role: state.role,
        hasProfile: state.hasProfile,
      }),
    }
  )
);
