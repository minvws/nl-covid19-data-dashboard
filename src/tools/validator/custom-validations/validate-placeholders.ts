import { isDefined } from 'ts-is-present';
/**
 * This validation function loops recursively through all of the properties in the given input object
 * and for all string values extracts and validates any existing placeholders.
 *
 * A valid placeholder is considered to look like this ``{{placeholderName}}``. So this validator looks
 * for mistakes such as ``{placeHolderName}}`` or ``{{placeHolderName}}}``, for example.
 *
 * When such an occurrence is found an error message is generated indicating in which property
 * the error occurred along with the offending placeholder.
 *
 */
export const validatePlaceholders = (
  input: Record<string, unknown>,
  parentName?: string
): string[] | undefined => {
  const parentSuffix = parentName ? `${parentName}.` : '';

  const result = Object.entries(input)
    .flatMap(([propertyName, value]: [string, any]) => {
      if (typeof value === 'string') {
        const result = validate(value);
        if (result.length) {
          return result.map(
            (placeholder) =>
              `Invalid placeholder '${placeholder}' found in ${parentSuffix}${propertyName}`
          );
        }
        return;
      }

      if (typeof value === 'object') {
        return validatePlaceholders(value, `${parentSuffix}${propertyName}`);
      }
    })
    .filter(isDefined);

  return result.length ? result : undefined;
};

function validate(text: string) {
  const matches = [...(text.matchAll(/{+[^}]+}+/g) as any)];

  return matches
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return undefined;
    })
    .filter(isDefined);
}
