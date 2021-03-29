import { createContext } from 'react';
import { languages } from '~/locale';

export const IntlContext = createContext(languages['nl']);

export { useIntl } from './hooks/use-intl';
