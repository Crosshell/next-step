const seniorityOptions = ['TRAINEE', 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD'];
const workFormatOptions = ['OFFICE', 'REMOTE', 'HYBRID'];
const employmentTypeOptions = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT',
];

const vacancyFallbackValues = {
  title: '',
  description: '',
  salaryMin: '',
  salaryMax: '',
  officeLocation: '',
  experienceRequired: '',
  workFormat: [],
  employmentType: [],
  seniorityLevel: '',
};

export {
  seniorityOptions,
  workFormatOptions,
  employmentTypeOptions,
  vacancyFallbackValues,
};
