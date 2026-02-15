import { LanguageLevel } from '@prisma/client';

export function getLanguageLevelsFromLevel({
  minLevel = LanguageLevel.ELEMENTARY,
  maxLevel = LanguageLevel.NATIVE,
}: {
  minLevel?: LanguageLevel;
  maxLevel?: LanguageLevel;
}): LanguageLevel[] {
  const allLevels = Object.values(LanguageLevel);
  const startIndex = allLevels.indexOf(minLevel);
  const endIndex = allLevels.indexOf(maxLevel);
  return allLevels.slice(startIndex, endIndex + 1);
}
