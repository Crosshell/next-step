import { clientLanguageLevels, languageLevels } from '@/lib/profile-data';

function isoToDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

function isoToSimpleDate(isoString: string): string {
  return new Date(isoString).toISOString().split('T')[0];
}

function toClientLangLevel(level: string): string {
  const landIndex = languageLevels.findIndex((l) => l === level);
  return clientLanguageLevels[landIndex];
}

export { isoToDate, isoToSimpleDate, toClientLangLevel };
