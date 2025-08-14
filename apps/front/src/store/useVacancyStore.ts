import { UpdatedUserLanguages } from '@/types/profile';
import { create } from 'zustand';

interface VacancyState {
  languages: UpdatedUserLanguages[];
  setLanguages: (langs: UpdatedUserLanguages[]) => void;
}

export const useVacancyStore = create<VacancyState>((set) => ({
  languages: [],
  setLanguages: (langs) => set({ languages: langs }),
}));
