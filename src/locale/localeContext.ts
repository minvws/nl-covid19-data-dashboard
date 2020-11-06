import React from 'react';

export type TLocale = Record<string, any>;
export interface ILocale {
  siteText: TLocale;
}

interface ContextProps {
  locale: string;
  siteText: TLocale;
}

export default React.createContext<ContextProps>({
  locale: `${process.env.NEXT_PUBLIC_LOCALE}`,
  siteText: {},
});
