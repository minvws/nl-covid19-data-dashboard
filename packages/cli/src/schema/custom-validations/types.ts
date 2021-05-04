export type CustomValidationFunction = (
  input: Record<string, { values: Record<string, unknown>[] }>
) => string[] | undefined;
