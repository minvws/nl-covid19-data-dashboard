import { isDefined } from 'ts-is-present';
import { assert } from './assert';

const curlyBracketRegex = /\{\{(.+?)\}\}/g;

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
 * @param variables - An object with keys representing any variable available for replacement.
 */

export function replaceVariablesInText(
  translation: string,
  variables: { [key: string]: string | number | undefined }
) {
  assert(
    isDefined(translation),
    `Missing a locale text with placeholders for: ${Object.keys(variables).join(
      ','
    )}`
  );

  return translation.replace(curlyBracketRegex, (_string, variableName) => {
    const trimmedName = variableName.trim();
    if (trimmedName in variables) {
      return (variables[trimmedName] ?? '').toString();
    }
    throw new Error(
      `No value was supplied for placeholder ${trimmedName} in ${Object.keys(
        variables
      ).join(',')}. Text: ${translation}`
    );
  });
}
