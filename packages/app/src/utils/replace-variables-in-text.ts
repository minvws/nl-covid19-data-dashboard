import { DataFormatters } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { assert } from './assert';

/**
 * When lokalize hot reload is enabled we will render "[#ERROR {{key}}]"
 * instead of throwing an error when there's a validation error.
 */
export const shouldValidate =
  typeof window === 'undefined' || process.env.NEXT_PUBLIC_PHASE !== 'develop';

const curlyBracketRegex = /\{\{(.+?)\}\}/g;

/**
 * Utility that accepts a translation string with placeholders
 * for variables. For example:
 * "An example placeholder string with {{type}} brackets"
 * Where everything between curly brackets is accepted as a placeholder
 * for a variable. The second argument is an object with keys representing
 * the string between curly brackets. In this case it would be:
 * { type: 'curly' }
 *
 * - If a specific variable is NOT given, it will replace it with an empty string.
 * - If no translation is given, an empty string will be returned.
 *
 * Formatting commands are supported in this way:
 * "An example placeholder string with {{count, formatNumber}} {{type}} brackets".
 * When { count: 10000, type: 'curly' } is passed in and a valid DataFormatters object
 * is also provided, this will eventually be rendered like so:
 * "An example placeholder string with 10.000 curly brackets".
 *
 * @param translation - Translation string with curly brackets for variables.
 * @param variables - An object with keys representing any variable available for replacement.
 * @param formatters - Optional list of formatters that can be referenced by commands
 */
export function replaceVariablesInText(
  translation: string,
  variables: Record<
    string,
    string | number | undefined | Record<string, string | number | undefined>
  >,
  formatters?: DataFormatters
) {
  if (shouldValidate) {
    assert(
      isDefined(translation),
      `[${
        replaceVariablesInText.name
      }] Missing a locale text with placeholders for: ${Object.keys(
        variables
      ).join(',')} in: "${translation}"`
    );
  }
  const formatterNames = isDefined(formatters) ? Object.keys(formatters) : [];

  return translation.replace(
    curlyBracketRegex,
    (_string, variableName: string) => {
      const trimmedValue = variableName.trim();
      const [trimmedName, command, commandArgument] = trimmedValue
        .split(',')
        .map((x) => x.trim());

      if (isDefined(command)) {
        switch (true) {
          case command === 'plural': {
            return executePluralize(
              variables,
              trimmedName,
              translation,
              commandArgument
            );
          }
          case formatterNames.includes(command): {
            return executeFormat(
              variables,
              trimmedName,
              translation,
              (formatters as DataFormatters)[
                command as unknown as keyof DataFormatters
              ] as (value: unknown) => string
            );
          }
          default: {
            throw new Error(`Unknown command encountered: ${command}`);
          }
        }
      }
      if (trimmedName in variables) {
        return (variables[trimmedName] ?? '').toString();
      }

      if (!shouldValidate) {
        return `[#ERROR {{${trimmedName}}}]`;
      }

      throw new Error(
        `No value was supplied for placeholder ${trimmedName} in ${Object.keys(
          variables
        ).join(',')}. Text: ${translation}`
      );
    }
  );
}

function executeFormat(
  variables: Record<
    string,
    string | number | Record<string, string | number | undefined> | undefined
  >,
  trimmedName: string,
  translation: string,
  formatter: (value: unknown) => string
) {
  if (!isDefined(variables[trimmedName])) {
    throw new Error(
      `No value was supplied for command number value ${trimmedName} in ${Object.keys(
        variables
      ).join(',')}. Text: ${translation}`
    );
  }

  return formatter(variables[trimmedName]);
}

function executePluralize(
  variables: Record<
    string,
    string | number | Record<string, string | number | undefined> | undefined
  >,
  trimmedName: string,
  translation: string,
  commandArgument: string
) {
  if (!isDefined(variables[trimmedName])) {
    throw new Error(
      `No value was supplied for command count value ${trimmedName} in ${Object.keys(
        variables
      ).join(',')}. Text: ${translation}`
    );
  }
  if (!isDefined(variables[commandArgument])) {
    throw new Error(
      `No value was supplied for plural command argument ${commandArgument} in ${Object.keys(
        variables
      ).join(',')}. Text: ${translation}`
    );
  }
  return pluralize(
    variables[trimmedName] as number,
    variables[commandArgument] as { plural: string; singular: string }
  );
}

function pluralize(
  count: number,
  pluralizeOptions: { plural: string; singular: string }
) {
  if (count === 1) {
    return pluralizeOptions.singular;
  }
  return pluralizeOptions.plural;
}
