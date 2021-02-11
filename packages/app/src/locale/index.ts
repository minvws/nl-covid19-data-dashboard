import localefile from './APP_LOCALE';

export type Locale = typeof localefile;

export type Languages = {
  nl: Locale;
  en: Locale;
};

export type LanguageKey = keyof Languages;

export const targetLanguage: LanguageKey =
  (process.env.NEXT_PUBLIC_LOCALE as LanguageKey) || 'nl';

const dictionary: Locale = localefile;

export default dictionary;
