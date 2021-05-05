export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONType = Record<string, JSONValue>;

export type CustomValidationFunction = (
  input: JSONType
) => string[] | undefined;
