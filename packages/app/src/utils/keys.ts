// typesafe replacement for Object.keys() which doesn't infer more complex types for object keys correctly
export function keys<O extends object>(o: O): Array<keyof O> {
  return Object.keys(o) as Array<keyof O>;
}
