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
  level:
    | 'ELEMENTARY'
    | 'PRE_INTERMEDIATE'
    | 'INTERMEDIATE'
    | 'UPPER_INTERMEDIATE'
    | 'ADVANCED'
    | 'NATIVE';
};

type VacancySearchForm = {
  title: string;
  salaryMin: number | undefined;
  experienceRequired: number | undefined;
  workFormats: ('OFFICE' | 'REMOTE' | 'HYBRID')[];
  employmentTypes: ('FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT')[];
  seniorityLevel:
    | 'TRAINEE'
    | 'JUNIOR'
    | 'MIDDLE'
    | 'SENIOR'
    | 'LEAD'
    | undefined;
  requiredLanguages: RequiredLanguage[];
  requiredSkillIds: { skill: { id: string; name?: string } }[] | string[];
  newSkill: string;
  orderBy: OrderBy;
  page: number;
};

export type {
  VacancyData,
  VacancyItemData,
  RequiredLanguage,
  VacancySearchForm,
};
