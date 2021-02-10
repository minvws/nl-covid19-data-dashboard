/**
 * Assert a condition and throw an error if it doesn't match. The condition
 * fails on all falsy values so including "" and 0.
 *
 * If you want to assert if something is defined write
 * `assert(isDefined([condition]), ...)`
 */
export function assert(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
