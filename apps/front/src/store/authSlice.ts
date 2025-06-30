import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isConfirmed: boolean;
  isLogged: boolean;
  role: string | undefined;
  setIsConfirmed: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
  setRole: (role: string | undefined) => void;
}

export const useAuthStore = create<ModalState>()(
  persist(
    (set) => ({
      isConfirmed: false,
      isLogged: false,
      role: undefined,
      setIsConfirmed: (value) => set({ isConfirmed: value }),
      setIsLogged: (value) => set({ isLogged: value }),
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isConfirmed: state.isConfirmed,
        isLogged: state.isLogged,
        role: state.role,
      }),
    }
  )
);
