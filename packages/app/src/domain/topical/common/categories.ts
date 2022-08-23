export const articleCategory = [
  '__alles',
  'vaccinaties',
  'besmettingen',
  'sterfte',
  'ziekenhuizen',
  'kwetsbare_groepen',
  'vroege_indicatoren',
  'gedrag',
] as const;

export type ArticleCategoryType = typeof articleCategory[number];
