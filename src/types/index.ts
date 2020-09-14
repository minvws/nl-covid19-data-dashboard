// https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/
// eslint-disable-next-line @typescript-eslint/ban-types
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};
