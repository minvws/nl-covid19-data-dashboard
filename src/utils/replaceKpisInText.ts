import { replaceVariablesInText } from './replaceVariablesInText';

interface Kpi {
  name: string;
  value: string;
  className?: string;
}

/**
 * Small utility that accepts a translation string with placeholders
 * for variabels. For example:
 * "An example placeholder string with {{type}} brackets"
 * Where everything between curly brackets is accepted as a placeholder
 * for a variable. The second argument is an object with keys representing
 * the string between curly brackets. In this case it would be:
 * { type: 'curly' }
 *
 * - If a specific variable is NOT given, it will replace it with an empty string.
 * - If no translation is given, an empty string will be returned.
 */

export function replaceKpisInText(translation: string, kpis: Kpi[]): string {
  const variables: { [key: string]: string } = kpis.reduce(
    (accumulator, kpi) => {
      return {
        ...accumulator,
        [kpi.name]: `<span class="${kpi.className || ''} inline-kpi">${
          kpi.value
        }</span>`,
      };
    },
    {}
  );

  return replaceVariablesInText(translation, variables);
}
