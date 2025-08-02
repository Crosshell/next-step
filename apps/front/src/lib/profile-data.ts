const languageLevels = [
  'BEGINNER',
  'ELEMENTARY',
  'INTERMEDIATE',
  'UPPER-INTERMEDIATE',
  'ADVANCED',
  'PROFICIENT',
  'NATIVE',
];

const degreeTypes = [
  'Bachelor',
  'Master',
  'Doctorate',
  'Associate',
  'Diploma',
  'Certificate',
];

// Profile dummy data

const skillsData = ['Next', 'Nest', 'GitHub'];

const personalInfoData = {
  name: 'John Doe',
  birthdate: '20.02.2002',
  address: 'Kyiv, Maidan Nezalezhnosti, 32',
};

const contactData = {
  linkedinURL: 'https://www.linkedin.com',
  githubURL: 'https://www.github.com',
  codewarsURL: 'https://www.codewars.com',
  telegramURL: 'https://www.telegram.com',
  facebookURL: 'https://www.facebook.com',
};

const bioData =
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,non. Consectetur, laborum nesciunt facere atque hic vero. Impedit           animi in, aperiam, asperiores odio quis excepturi ipsum quas  voluptatum incidunt quos!';

const experienceData = [
  {
    companyName: 'A cool company',
    startDate: '2020-02-27',
    endDate: '',
    details:
      'Some information Some information Some information Some information Some information Some information Some information Some information Some information Some information Some information',
    isCurrent: true,
  },
  {
    companyName: 'Not cool company',
    startDate: '2020-02-25',
    endDate: '2020-02-26',
    details:
      'Bad company Bad company Bad company Bad company Bad company Bad company ',
    isCurrent: false,
  },
];

const educationData = [
  {
    universityName: 'A cool university',
    startDate: '2025-02-27',
    endDate: '',
    field: 'IT',
    degree: 'Master',
    details:
      'Some information Some information Some information Some information Some information Some information Some information Some information Some information Some information Some information',
  },
  {
    universityName: 'A cool university',
    startDate: '2020-02-27',
    endDate: '2024-02-27',
    field: 'IT',
    degree: 'Bachelor',
    details:
      'Also Some information Also Some information Also Some information Also Some information ',
  },
];

const certificatesData = [
  { name: 'HTML Course', url: 'https://www.google.com/1', date: '2020-02-25' },
  { name: 'CSS Course', url: 'https://www.google.com/2', date: '2020-02-26' },
  { name: 'JS Course', url: 'https://www.google.com/3', date: '2020-02-27' },
];

const languagesData = [
  { language: 'English', level: 'B1 (Intermediate)' },
  { language: 'Korean', level: 'B2 (Upper-Intermediate)' },
];

const userData = {
  skills: skillsData,
  personalInfo: personalInfoData,
  contacts: contactData,
  bio: bioData,
  experience: experienceData,
  education: educationData,
  certificates: certificatesData,
  languages: languagesData,
};

export { languageLevels, degreeTypes, userData };
