const languageLevels = [
  'A1 (Beginner)',
  'A2 (Elementary)',
  'B1 (Intermediate)',
  'B2 (Upper-Intermediate)',
  'C1 (Advanced)',
  'C2 (Proficient)',
  'Native',
];

const languagesList = [
  'Afrikaans',
  'Albanian',
  'Amharic',
  'Arabic',
  'Armenian',
  'Assamese',
  'Aymara',
  'Azerbaijani',
  'Basque',
  'Belarusian',
  'Bengali',
  'Bhojpuri',
  'Bosnian',
  'Bulgarian',
  'Burmese',
  'Catalan',
  'Cebuano',
  'Chichewa',
  'Chinese (Cantonese)',
  'Chinese (Mandarin)',
  'Corsican',
  'Croatian',
  'Czech',
  'Danish',
  'Dhivehi',
  'Dogri',
  'Dutch',
  'English',
  'Esperanto',
  'Estonian',
  'Ewe',
  'Filipino',
  'Finnish',
  'French',
  'Frisian',
  'Galician',
  'Georgian',
  'German',
  'Greek',
  'Guarani',
  'Gujarati',
  'Haitian Creole',
  'Hausa',
  'Hawaiian',
  'Hebrew',
  'Hindi',
  'Hmong',
  'Hungarian',
  'Icelandic',
  'Igbo',
  'Ilocano',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Kannada',
  'Kazakh',
  'Khmer',
  'Kinyarwanda',
  'Konkani',
  'Korean',
  'Kurdish (Kurmanji)',
  'Kurdish (Sorani)',
  'Kyrgyz',
  'Lao',
  'Latin',
  'Latvian',
  'Lingala',
  'Lithuanian',
  'Luxembourgish',
  'Macedonian',
  'Maithili',
  'Malagasy',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Odia (Oriya)',
  'Pashto',
  'Persian (Farsi)',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Quechua',
  'Romanian',
  'Russian',
  'Samoan',
  'Sanskrit',
  'Scots Gaelic',
  'Serbian',
  'Sesotho',
  'Shona',
  'Sindhi',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Somali',
  'Spanish',
  'Sundanese',
  'Swahili',
  'Swedish',
  'Tajik',
  'Tamil',
  'Tatar',
  'Telugu',
  'Thai',
  'Tigrinya',
  'Turkish',
  'Turkmen',
  'Ukrainian',
  'Urdu',
  'Uyghur',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Western Frisian',
  'Wolof',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zulu',
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

export { languagesList, languageLevels, degreeTypes, userData };
