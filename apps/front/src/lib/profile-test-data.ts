const skills = ['Next', 'Nest', 'GitHub'];
const personalInfo = {
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

const bioData = {
  bio: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,non. Consectetur, laborum nesciunt facere atque hic vero. Impedit           animi in, aperiam, asperiores odio quis excepturi ipsum quas  voluptatum incidunt quos!',
};

const languageLevel = [
  'A1 (Beginner)',
  'A2 (Elementary)',
  'B1 (Intermediate)',
  'B2 (Upper-Intermediate)',
  'C1 (Advanced)',
  'C2 (Proficient)',
  'Native',
];

const languages = [
  'English',
  'Mandarin Chinese',
  'Hindi',
  'Spanish',
  'French',
  'Arabic',
  'Bengali',
  'Russian',
  'Portuguese',
  'Urdu',
  'Indonesian',
  'German',
  'Japanese',
  'Swahili',
  'Turkish',
  'Korean',
  'Italian',
  'Vietnamese',
  'Polish',
  'Persian',
];

const userLanguages = [
  { language: 'English', level: 'B1 (Intermediate)' },
  { language: 'Korean', level: 'B2 (Upper-Intermediate)' },
];

const certificatesData = [
  { name: 'HTML Course', url: 'https://www.google.com/1', date: '2020-02-25' },
  { name: 'CSS Course', url: 'https://www.google.com/2', date: '2020-02-26' },
  { name: 'JS Course', url: 'https://www.google.com/3', date: '2020-02-27' },
];

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

const degreeTypes = [
  'Bachelor',
  'Master',
  'Doctorate',
  'Associate',
  'Diploma',
  'Certificate',
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

export {
  skills,
  personalInfo,
  contactData,
  bioData,
  languageLevel,
  languages,
  userLanguages,
  certificatesData,
  experienceData,
  degreeTypes,
  educationData,
};
