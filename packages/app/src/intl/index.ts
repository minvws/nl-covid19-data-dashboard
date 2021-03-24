import { createContext } from 'react';
import { EnLocale, languages, NlLocale } from '~/locale';

export const IntlContext = createContext<NlLocale | EnLocale>(languages['nl']);

export { useIntl } from './hooks/useIntl';
