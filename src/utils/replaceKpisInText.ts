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
 *
 * @param translation - Translation string with curly brackets for variables.
 * @param kpis - An object with keys representing kpi object containing a value and class name available for replacement.
 */

export function replaceKpisInText(
  translation?: string | undefined | null,
  kpis?: Kpi[]
): string {
  const variables: { [key: string]: string | undefined } = {};
  kpis?.forEach((kpi) => {
    variables[kpi.name] = `<span class="${kpi.className || ''} inline-kpi">${
      kpi.value
    }</span>`;
  });

  return replaceVariablesInText(translation, variables);
}
