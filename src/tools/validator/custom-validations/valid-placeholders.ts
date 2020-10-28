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
export const validPlaceholders = (
  input: Record<string, unknown>,
  parentName?: string
): string[] | undefined => {
  const parentSuffix = parentName ? `${parentName}.` : '';

  const result = Object.entries(input)
    .flatMap(([propertyName, value]: [string, any]) => {
      if (typeof value === 'string') {
        const result = validatePlaceHolders(value);
        if (result.length) {
          return result.map(
            (placeholder) =>
              `Invalid placeholder '${placeholder}' found in ${parentSuffix}${propertyName}`
          );
        }
        return;
      }

      if (typeof value === 'object') {
        return validPlaceholders(value, `${parentSuffix}${propertyName}`);
      }
    })
    .filter(isDefined);

  return result.length ? result : undefined;
};

function validatePlaceHolders(text: string) {
  const matches = [...(text.matchAll(/({[^}]+[}]+)/g) as any)];

  return matches
    .map((matchInfo: string[]) => {
      const matched = matchInfo[0];
      const prefix = matched.substr(0, 2);
      const suffix = matched.substr(-2);
      const middle = matched.substr(2, matched.length - 4);
      if (prefix !== '{{' || suffix !== '}}' || middle.indexOf('{') > -1) {
        return matched;
      }
      return undefined;
    })
    .filter(isDefined);
}
