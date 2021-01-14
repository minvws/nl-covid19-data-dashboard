/**
 * Get tuple of values of an interface or type.
 *
 * @example
 *   ValueOf<{ a: number; b: Foo }> == number | Foo
 */
type ValueOf<T> = T[keyof T];

/**
 * Unwraps a Promise.
 *
 * @example
 *   Await<Promise<{ a: number }>> == { a: number }
 */
type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;
