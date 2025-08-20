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

type OrderBy = {
  salaryMin?: 'asc' | 'desc';
  salaryMax?: 'asc' | 'desc';
  experienceRequired?: 'asc' | 'desc';
};

type RequiredLanguage = {
  languageId: string;
  level: 'NATIVE' | 'FLUENT' | 'INTERMEDIATE' | 'BASIC';
};

type VacancySearchForm = {
  title: string;
  salaryMin: number | null;
  experienceRequired: number | null;
  workFormats: ('OFFICE' | 'REMOTE' | 'HYBRID')[];
  employmentTypes: ('FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT')[];
  seniorityLevel: 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD' | null;
  requiredLanguages: RequiredLanguage[];
  requiredSkillIds: string[];
  orderBy: OrderBy;
  page: number;
};

export type { VacancyData, VacancyItemData, VacancySearchForm };
