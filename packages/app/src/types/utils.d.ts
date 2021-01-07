/**
 * Get tuple of values of an interface or type.
 *
 * @example
 *   ValueOf<{ a: number; b: Foo }> == number | Foo
 */
type ValueOf<T> = T[keyof T];
