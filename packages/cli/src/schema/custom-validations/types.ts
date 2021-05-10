export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type CustomValidationFunction = (
  input: Record<string, JSONValue>
) => string[] | undefined;
