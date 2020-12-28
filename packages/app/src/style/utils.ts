import { ResponsiveValue } from 'styled-system';

const responsiveKeys = ['_', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Styled-system's `css()` function does not support responsive object notation.
 * This utility will transform a responsive style object notation to its array
 * equivalent.
 *
 * input: `{ _: 2, md: 4, xl: 6 }`
 * output: `[2, undefined, undefined, 4, undefined, 6]`
 *
 */
export function asResponsiveArray<T>(
  value: ResponsiveValue<T>
): ResponsiveValue<T> {
  return isStyleObject(value) ? createArrayValue(value) : value;
}

type StyleObject<T> = Record<typeof responsiveKeys[number], T>;

function isStyleObject<T>(value: ResponsiveValue<T>): value is StyleObject<T> {
  return !Array.isArray(value) && value !== null && typeof value === 'object';
}

function createArrayValue<T>(value: StyleObject<T>) {
  return responsiveKeys.map((key) => value[key]) as ResponsiveValue<T>;
}
