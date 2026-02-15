import { LanguageLevel } from '@prisma/client';
import { getLanguageLevelsFromLevel } from '@common/utils';

describe('getLanguageLevelsFromLevel', () => {
  it('should return full range by default', () => {
    const result = getLanguageLevelsFromLevel({});

    expect(result).toEqual([
      LanguageLevel.ELEMENTARY,
      LanguageLevel.PRE_INTERMEDIATE,
      LanguageLevel.INTERMEDIATE,
      LanguageLevel.UPPER_INTERMEDIATE,
      LanguageLevel.ADVANCED,
      LanguageLevel.NATIVE,
    ]);
  });

  it('should return range from min to max inclusive', () => {
    const result = getLanguageLevelsFromLevel({
      minLevel: LanguageLevel.PRE_INTERMEDIATE,
      maxLevel: LanguageLevel.UPPER_INTERMEDIATE,
    });

    expect(result).toEqual([
      LanguageLevel.PRE_INTERMEDIATE,
      LanguageLevel.INTERMEDIATE,
      LanguageLevel.UPPER_INTERMEDIATE,
    ]);
  });

  it('should return single-level array when min equals max', () => {
    const result = getLanguageLevelsFromLevel({
      minLevel: LanguageLevel.INTERMEDIATE,
      maxLevel: LanguageLevel.INTERMEDIATE,
    });

    expect(result).toEqual([LanguageLevel.INTERMEDIATE]);
  });

  it('should respect only minLevel when maxLevel not provided', () => {
    const result = getLanguageLevelsFromLevel({
      minLevel: LanguageLevel.ADVANCED,
    });

    expect(result).toEqual([LanguageLevel.ADVANCED, LanguageLevel.NATIVE]);
  });

  it('should respect only maxLevel when minLevel not provided', () => {
    const result = getLanguageLevelsFromLevel({
      maxLevel: LanguageLevel.INTERMEDIATE,
    });

    expect(result).toEqual([
      LanguageLevel.ELEMENTARY,
      LanguageLevel.PRE_INTERMEDIATE,
      LanguageLevel.INTERMEDIATE,
    ]);
  });

  it('should return empty array when minLevel is higher than maxLevel', () => {
    const result = getLanguageLevelsFromLevel({
      minLevel: LanguageLevel.UPPER_INTERMEDIATE,
      maxLevel: LanguageLevel.PRE_INTERMEDIATE,
    });

    expect(result).toEqual([]);
  });
});
