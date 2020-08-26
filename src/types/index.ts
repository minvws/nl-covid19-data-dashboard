// https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/
// Originally: type WithChildren<T = Record<string, unkonwn>>,
// this was changed to allow for the Collapse component (used in SewerWater and other files)
// to accept multiple children
// eslint-disable-next-line
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};
