import { createContext } from 'react';
import { languages } from '~/locale';

export const IntlContext = createContext({
  siteText: languages['nl'],
});

export { useIntl } from './hooks/useIntl';
