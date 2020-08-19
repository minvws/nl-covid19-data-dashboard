// https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/
export type WithChildren<T = Record<string, unknown>> = T & {
  children?: React.ReactNode;
};
