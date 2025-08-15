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
  description: '',
  salaryMin: '',
  salaryMax: '',
  officeLocation: '',
  experienceRequired: '',
  workFormat: [],
  employmentType: [],
  seniorityLevel: '',
  languages: [{ languageId: '', level: '' }],
};

export {
  seniorityOptions,
  workFormatOptions,
  employmentTypeOptions,
  vacancyFallbackValues,
};
