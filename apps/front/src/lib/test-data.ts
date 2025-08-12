import { VacancyData } from '@/types/vacancies';

const vacanciesData: VacancyData[] = [
  {
    id: '4234234234204324-23-423-4',
    title: 'Ex title',
    description: 'Ex description',
    salaryMin: 100,
    salaryMax: 500,
    officeLocation: 'Hostel number 8',
    experienceRequired: 7,
    isActive: true,
    workFormat: ['OFFICE', 'REMOTE', 'HYBRID'],
    employmentType: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'],
    seniorityLevel: 'MIDDLE',
    requiredSkills: [
      {
        skill: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'Nest.js',
        },
      },
      {
        skill: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'Nest.js',
        },
      },
    ],
    requiredLanguages: [
      {
        level: 'INTERMEDIATE',
        language: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'English',
        },
      },
      {
        level: 'NATIVE',
        language: {
          id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
          name: 'English',
        },
      },
    ],
    company: {
      id: '2fd1960a-461c-4cfb-ba19-7ede8ef6e158',
      name: 'Company Name',
      description: 'Company description',
      url: 'https://company.url',
      logoUrl: 'https://company.logo/url',
      isVerified: false,
      createdAt: '2025-07-29T18:40:17.097Z',
      updatedAt: '2025-07-29T18:40:17.097Z',
    },
    createdAt: '2025-07-29T18:40:22.800Z',
    updatedAt: '2025-07-29T18:40:22.800Z',
  },
];

export { vacanciesData };
