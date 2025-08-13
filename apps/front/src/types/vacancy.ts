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
};

export type { Vacancy, VacancyFormValues };
