export type Option<T extends string> = {
  value: T;
  content?: React.ReactNode;
  label: string;
};
