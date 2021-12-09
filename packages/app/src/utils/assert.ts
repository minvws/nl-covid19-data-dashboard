/**
 * Throws an error if the given condition is not met
 */
export function assert(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
