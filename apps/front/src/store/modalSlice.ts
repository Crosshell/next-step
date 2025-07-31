import { ReactNode } from 'react';
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  isAbsolute: boolean;
  openModal: (content: ReactNode, isAbsolute?: boolean) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  isAbsolute: false,
  openModal: (content, isAbsolute = false) =>
    set({ isOpen: true, content, isAbsolute }),
  closeModal: () => set({ isOpen: false, content: null }),
}));
