const languageLevels = [
  'ELEMENTARY',
  'PRE_INTERMEDIATE',
  'INTERMEDIATE',
  'UPPER_INTERMEDIATE',
  'ADVANCED',
  'NATIVE',
];

const clientLanguageLevels = [
  'A2 (Elementary)',
  'B1 (Pre-Intermediate)',
  'B2 (Intermediate)',
  'C1 (Upper-Intermediate)',
  'C2 (Advanced)',
  'Native',
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

const contactsFallbackValues = {
  githubUrl: '',
  linkedinUrl: '',
  telegramUrl: '',
  publicEmail: '',
  phoneNumber: '',
};

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

const userData = {
  experience: experienceData,
  education: educationData,
  certificates: certificatesData,
};

export {
  languageLevels,
  clientLanguageLevels,
  degreeTypes,
  contactsFallbackValues,
  userData,
};
