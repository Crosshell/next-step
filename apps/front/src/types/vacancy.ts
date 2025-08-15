interface Vacancy {
  id: string;
  title: string;
  description: string;
  work_format: string;
  office_location: string;
  experience_required: number;
  employment_type: string;
  views: number;
  is_active: boolean;
  seniority_level: string;
  company_name: string;
  company_site: string;
  archived_at: Date;
  created_at: Date;
  edited_at: Date;
}

type FormLanguage = {
  languageId: string;
  level: string;
  language?: { id: string; name: string };
};

type VacancyFormValues = {
  title: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  officeLocation: string;
  experienceRequired: string;
  workFormat: string[];
  employmentType: string[];
  seniorityLevel: string;
  languages: FormLanguage[];
};

type VacancySideBoxData = {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string | null;
  companyUrl: string | null;
  employmentType: string[];
  workFormat: string[];
  officeLocation: string;
  salaryMin: number;
  salaryMax: number;
};

export type { Vacancy, VacancyFormValues, VacancySideBoxData, FormLanguage };
