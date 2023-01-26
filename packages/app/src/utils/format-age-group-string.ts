import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

/**
 * Format the given age group string according to these rules:
 *
 * If the group includes a hyphen (-) it is considered to be a range and
 * therefore formatted using the group template which looks roughly like this:
 * '{{age_low}} tot {{age_high}} jaar'
 *
 * If the group contains a plus sign (+) it is considered to be a 'this value
 * and higher' value and is formatted like this: '{{age}} en ouder'
 *
 * If none of these checks return true the value is considered to display the
 * totals and simply returns the locale string for this.
 *
 * @param ageGroup
 * @param templates
 * @returns
 */

export const formatAgeGroupString = (ageGroup: string, templates: { oldest: string; group: string }) => {
  switch (true) {
    case ageGroup.includes('-'): {
      const [age_low, age_high] = ageGroup.split('-');
      return replaceVariablesInText(templates.group, {
        age_low,
        age_high,
      });
    }
    case ageGroup.includes('+'): {
      const age = ageGroup.replace('+', '');
      return replaceVariablesInText(templates.oldest, { age });
    }
    default: {
      throw new Error(`Invalid age group ${ageGroup}`);
    }
  }
};
