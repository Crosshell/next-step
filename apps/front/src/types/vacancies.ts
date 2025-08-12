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
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | string; // adjust if you have a fixed enum
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

export { type VacancyData };
