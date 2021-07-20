import { createContext } from 'react';
import { IntlContextProps } from './hooks/use-intl';

export const IntlContext = createContext<IntlContextProps>(
  undefined as unknown as IntlContextProps
);
