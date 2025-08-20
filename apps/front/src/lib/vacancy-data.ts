import { VacancySearchForm } from '@/types/vacancies';
import { VacancyFormValues } from '@/types/vacancy';

const seniorityOptions = ['TRAINEE', 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];
const workFormatOptions = ['OFFICE', 'REMOTE', 'HYBRID'];
const employmentTypeOptions = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT',
];

const vacancyFallbackValues: VacancyFormValues = {
  title: '',
  isActive: true,
  description: '',
  salaryMin: '',
  salaryMax: '',
  officeLocation: '',
  experienceRequired: '',
  workFormat: [],
  employmentType: [],
  seniorityLevel: '',
  languages: [],
  skills: [],
  newSkill: '',
};

const vacancySearchDefaults: VacancySearchForm = {
  title: '',
  salaryMin: null,
  experienceRequired: null,
  workFormats: [],
  employmentTypes: [],
  seniorityLevel: null,
  requiredLanguages: [],
  requiredSkillIds: [],
  orderBy: {},
  page: 1,
};

export {
  seniorityOptions,
  workFormatOptions,
  employmentTypeOptions,
  vacancyFallbackValues,
  vacancySearchDefaults,
};
