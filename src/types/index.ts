// https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/
// Slightly altered version of the WithChildren type found in source
// Added the {} in order for it to allow multiple children, simply wrapping it in a Fragment didn't work
// eslint-disable-next-line
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};
