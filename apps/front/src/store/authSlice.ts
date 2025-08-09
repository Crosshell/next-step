import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModalState {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
}

export const useAuthStore = create<ModalState>()(
  persist(
    (set) => ({
      isLogged: false,
      role: undefined,
      setIsLogged: (value) => set({ isLogged: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLogged: state.isLogged,
      }),
    }
  )
);
