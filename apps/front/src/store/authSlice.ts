import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isConfirmed: boolean;
  isLogged: boolean;
  setIsConfirmed: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
}

export const useAuthStore = create<ModalState>()(
  persist(
    (set) => ({
      isConfirmed: false,
      isLogged: false,
      role: undefined,
      setIsConfirmed: (value) => set({ isConfirmed: value }),
      setIsLogged: (value) => set({ isLogged: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isConfirmed: state.isConfirmed,
        isLogged: state.isLogged,
      }),
    }
  )
);
