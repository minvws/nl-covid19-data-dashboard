import { createContext } from 'react';

export const IntlContext = createContext({ messages: null as any });

export { useIntl } from './hooks/useIntl';
