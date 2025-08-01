interface ProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
}

interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  contacts: string | null;
  dateOfBirth: string | null;
  expectedSalary: number | null;
  isOpenToWork: boolean;
  seniorityLevel: string | null;
  location: string | null;
  languages: string[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  location: string | null;
}

interface UpdatedPersonalData {
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  expectedSalary?: number;
  dateOfBirth?: string;
  isOpenToWork?: boolean;
  seniorityLevel?: string;
}

interface ContactsData {
  linkedinURL: string;
  githubURL: string;
  codewarsURL: string;
  telegramURL: string;
  facebookURL: string;
}

interface LanguageData {
  language: string;
  level: string;
}

interface CertificateData {
  name: string;
  url: string;
  date: string;
}

interface ExperienceData {
  companyName: string;
  startDate: string;
  endDate: string;
  details: string;
  isCurrent: boolean;
}

interface EducationData {
  universityName: string;
  startDate: string;
  endDate: string;
  field: string;
  degree: string;
  details: string;
}

export {
  type ProfileFormData,
  type ProfileData,
  type PersonalData,
  type UpdatedPersonalData,
  type ContactsData,
  type LanguageData,
  type CertificateData,
  type ExperienceData,
  type EducationData,
};
