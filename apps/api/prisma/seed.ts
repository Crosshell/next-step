import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BASE_LANGUAGES = [
  'Afar',
  'Abkhazian',
  'Avestan',
  'Afrikaans',
  'Akan',
  'Amharic',
  'Aragonese',
  'Arabic',
  'Assamese',
  'Avaric',
  'Aymara',
  'Azerbaijani',
  'Bashkir',
  'Belarusian',
  'Bulgarian',
  'Bihari',
  'Bislama',
  'Bambara',
  'Bengali',
  'Tibetan',
  'Breton',
  'Bosnian',
  'Catalan',
  'Chechen',
  'Chamorro',
  'Corsican',
  'Cree',
  'Czech',
  'Church Slavic',
  'Chuvash',
  'Welsh',
  'Danish',
  'German',
  'Divehi',
  'Dzongkha',
  'Ewe',
  'Greek',
  'English',
  'Esperanto',
  'Spanish',
  'Estonian',
  'Basque',
  'Persian',
  'Fulah',
  'Finnish',
  'Fijian',
  'Faroese',
  'French',
  'Western Frisian',
  'Irish',
  'Scottish Gaelic',
  'Galician',
  'Guarani',
  'Gujarati',
  'Manx',
  'Hausa',
  'Hebrew',
  'Hindi',
  'Hiri Motu',
  'Croatian',
  'Haitian Creole',
  'Hungarian',
  'Armenian',
  'Herero',
  'Interlingua',
  'Indonesian',
  'Interlingue',
  'Igbo',
  'Sichuan Yi',
  'Inupiaq',
  'Ido',
  'Icelandic',
  'Italian',
  'Inuktitut',
  'Japanese',
  'Javanese',
  'Georgian',
  'Kongo',
  'Kikuyu',
  'Kuanyama',
  'Sotho',
  'Sundanese',
  'Swedish',
  'Swahili',
  'Tamil',
  'Telugu',
  'Tajik',
  'Thai',
  'Tigrinya',
  'Turkmen',
  'Tagalog',
  'Tswana',
  'Tonga',
  'Turkish',
  'Tsonga',
  'Tatar',
  'Twi',
  'Tahitian',
  'Uighur',
  'Ukrainian',
  'Urdu',
  'Uzbek',
  'Venda',
  'Vietnamese',
  'Volapük',
  'Walloon',
  'Wolof',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zhuang',
  'Chinese',
  'Zulu',
];

const BASE_SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Angular',
  'Redux',
  'Node.js',
  'Express',
  'Nest.js',
  'MongoDB',
  'SQL',
  'PostgreSQL',
  'MySQL',
];

async function main() {
  await seedLanguages();
  await seedSkills();
}

async function seedLanguages(): Promise<void> {
  const data = BASE_LANGUAGES.map((name) => ({ name }));
  const { count } = await prisma.language.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Languages created: ${count}`);
}

async function seedSkills(): Promise<void> {
  const data = BASE_SKILLS.map((name) => ({ name }));
  const { count } = await prisma.skill.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Skills created: ${count}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
