type ProfileFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
};

type ProfileData = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  contacts: ContactsData | null;
  dateOfBirth: string | null;
  expectedSalary: number | null;
  isOpenToWork: boolean;
  seniorityLevel: string | null;
  location: string | null;
  languages: UserLanguageData[];
  skills: SkillData[];
  createdAt: string;
  updatedAt: string;
};

type PersonalData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  location: string | null;
};

type UpdatedPersonalData = {
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string | null;
  expectedSalary?: number;
  dateOfBirth?: string;
  isOpenToWork?: boolean;
  seniorityLevel?: string;
};

type SkillItem = {
  id: string;
  name: string;
};

type UpdatedSkills = {
  skillIds: string[];
};

type SkillData = {
  skill: SkillItem;
};

type ContactsData = {
  jobSeekerId?: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  telegramUrl: string | null;
  publicEmail: string | null;
  phoneNumber: string | null;
};

type LanguageData = {
  id: string;
  name: string;
};

type UserLanguageData = {
  level: string;
  language: LanguageData;
};

type UpdatedUserLanguages = {
  languageId: string;
  level: string;
};

type CertificateData = {
  name: string;
  url: string;
  date: string;
};

type ExperienceData = {
  companyName: string;
  startDate: string;
  endDate: string;
  details: string;
  isCurrent: boolean;
};

type EducationData = {
  universityName: string;
  startDate: string;
  endDate: string;
  field: string;
  degree: string;
  details: string;
};

export {
  type ProfileFormData,
  type ProfileData,
  type PersonalData,
  type UpdatedPersonalData,
  type UpdatedSkills,
  type SkillItem,
  type SkillData,
  type ContactsData,
  type LanguageData,
  type UserLanguageData,
  type UpdatedUserLanguages,
  type CertificateData,
  type ExperienceData,
  type EducationData,
};
