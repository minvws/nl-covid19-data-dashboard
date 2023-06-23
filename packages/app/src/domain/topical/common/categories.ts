export const articleCategoryList = [
  '__alles',
  'knowledge',
  'news',
  'vaccinaties',
  'besmettingen',
  'sterfte',
  'ziekenhuizen',
  'kwetsbare_groepen',
  'vroege_indicatoren',
  'gedrag',
] as const;

export type ArticleCategoryType = typeof articleCategoryList[number];
