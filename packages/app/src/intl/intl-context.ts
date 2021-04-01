import { createContext } from 'react';
import { languages } from '~/locale';
import { IntlContextProps } from './hooks/use-intl';

export const IntlContext = createContext<IntlContextProps>({
  siteText: languages['nl'],
  locale: 'nl',
  formatNumber: () => {
    throw new Error('Init format function should not be called');
  },
  formatPercentage: () => {
    throw new Error('Init format function should not be called');
  },
  formatDate: () => {
    throw new Error('Init format function should not be called');
  },
  formatDateFromSeconds: () => {
    throw new Error('Init format function should not be called');
  },
  formatDateFromMilliseconds: () => {
    throw new Error('Init format function should not be called');
  },
  formatRelativeDate: () => {
    throw new Error('Init format function should not be called');
  },
  formatDateSpan: () => {
    throw new Error('Init format function should not be called');
  },
});
