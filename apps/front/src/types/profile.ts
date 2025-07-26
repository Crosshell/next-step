interface PersonalData {
  name: string;
  birthdate: string;
  address: string;
}

interface ContactsData {
  linkedinURL: string;
  githubURL: string;
  codewarsURL: string;
  telegramURL: string;
  facebookURL: string;
}

interface LanguageData {
  language: string;
  level: string;
}

export { type PersonalData, type ContactsData, type LanguageData };
