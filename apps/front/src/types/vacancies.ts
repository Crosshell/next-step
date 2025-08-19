type VacancyData = {
  id: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  officeLocation: string;
  experienceRequired: number;
  isActive: boolean;
  workFormat: string[];
  employmentType: string[];
  seniorityLevel: string;
  requiredSkills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
  requiredLanguages: {
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | string;
    language: {
      id: string;
      name: string;
    };
  }[];
  company: {
    id: string;
    name: string;
    description: string;
    url: string;
    logoUrl: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

type VacancyItemData = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  createdAt: string;
};

export type { VacancyData, VacancyItemData };
