export type Option<T extends string> = {
  value: T | undefined;
  content?: React.ReactNode;
  label: string;
};
