// https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/
// eslint-disable-next-line
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};
