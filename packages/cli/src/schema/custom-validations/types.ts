export type CustomValidationFunction = (
  input: Record<string, any>
) => string[] | undefined;
