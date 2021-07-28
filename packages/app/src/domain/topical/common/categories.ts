export const categories = [
  'vaccinaties',
  'infecties',
  'sterfte',
  'ziekenhuizen',
  'kwetsbare_groepen',
  'vroege_indicatoren',
  'gedrag',
] as const;
export type CategoriesTypes = typeof categories[number];

export const categoryAll = 'alles';

export const allCategories = [categoryAll, ...categories] as unknown as (
  | CategoriesTypes
  | typeof categoryAll
)[];

export type AllCategoriesTypes = typeof allCategories[number];
