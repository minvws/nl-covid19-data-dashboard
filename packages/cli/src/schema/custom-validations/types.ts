export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONObject = Record<string, JSONValue>;

export type CustomValidationFunction = (
  input: JSONObject
) => string[] | undefined;
