import en from './en.json';
import nl from './nl.json';

export type TNLLocale = typeof nl;
export type TENLocale = typeof en;

export type TLanguages = {
  nl: TNLLocale;
  en: TENLocale;
};

export type TALLLanguages = TNLLocale | TENLocale;
export type TLanguageKey = keyof TLanguages;

const languages: TLanguages = { en, nl } as const;

const targetLanguage: TLanguageKey =
  (process.env.NEXT_PUBLIC_LOCALE as TLanguageKey) || 'nl';
const dictionary: TALLLanguages = languages[targetLanguage];

export default dictionary;
