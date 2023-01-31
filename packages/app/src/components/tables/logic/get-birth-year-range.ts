/**
 * Takes an age(group) string as an argument and returns a string of the birth year (range) for a give age(group).
 */
export const getBirthYearRange = (ageGroup: string): string => {
  const currentYear = new Date().getFullYear();
  const hasPlus = ageGroup.includes('_plus');
  const splitAgeKey = ageGroup.split(hasPlus ? ' ' : '_');
  const birthYearRange = splitAgeKey.map((key) => currentYear - parseInt(key, 10)).sort((a, b) => a - b);

  return hasPlus ? `-${birthYearRange}` : `${birthYearRange.at(0)}-${birthYearRange.at(1)}`;
};
