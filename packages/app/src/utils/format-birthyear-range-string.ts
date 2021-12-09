import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

/**
 * Format the birth year range according to these rules:
 *
 * We could get 3 variants back from the data:
 * -2003, 2003-2006 and 2003-
 *
 * If the group includes a hyphen (-) at the start it is considered 2003 or earlier
 *
 * If the group includes a hyphen (-) at the end it is considered 2003 or later
 *
 * Otherwise the year will just be the full range with both birth years.
 */
export function formatBirthyearRangeString(
  birthyearRange: string,
  templates: {
    earlier: string;
    later: string;
    range: string;
  }
) {
  if (birthyearRange.indexOf('-') < 0) {
    throw new Error(
      'Invalid birthyearRange received. Valid values are: -<year>, <year>- or <year>-<year>'
    );
  }

  const splittedBirthyear = birthyearRange.split('-');

  switch (true) {
    case birthyearRange.startsWith('-'): {
      return replaceVariablesInText(templates.earlier, {
        birthyear: splittedBirthyear[1],
      });
    }
    case birthyearRange.endsWith('-'): {
      return replaceVariablesInText(templates.later, {
        birthyear: splittedBirthyear[0],
      });
    }
    default: {
      return replaceVariablesInText(templates.range, {
        birthyearStart: splittedBirthyear[0],
        birthyearEnd: splittedBirthyear[1],
      });
    }
  }
}
