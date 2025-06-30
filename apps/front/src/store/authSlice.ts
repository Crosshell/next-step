import { create } from 'zustand';

interface ModalState {
  isConfirmed: boolean;
  isLogged: boolean;
  role: string | undefined;
  setIsConfirmed: () => void;
  setIsLogged: () => void;
  setRole: (role: string) => void;
}

export const useAuthStore = create<ModalState>((set) => ({
  isConfirmed: false,
  isLogged: false,
  role: undefined,
  setIsConfirmed: () => set({ isConfirmed: true }),
  setIsLogged: () => set({ isLogged: true }),
  setRole: (role) => set({ role }),
}));
