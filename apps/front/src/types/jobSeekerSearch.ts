type OrderBy = {
  updatedAt?: 'asc' | 'desc';
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

export type JobSeekerSearchForm = {
  seniorityLevels: ('TRAINEE' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD')[];
  languages: RequiredLanguage[];
  skillIds: { skill: { id: string; name?: string } }[] | string[];
  newSkill: string;
  orderBy: OrderBy;
  page: number;
};

export type JobSeekerItemData = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  createdAt: string;
};
