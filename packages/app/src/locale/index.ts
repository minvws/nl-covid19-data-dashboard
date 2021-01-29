import localefile from './APP_TARGET';

export type TLocale = typeof localefile;

export type TLanguages = {
  nl: TLocale;
  en: TLocale;
};

export type TALLLanguages = TLocale;
export type TLanguageKey = keyof TLanguages;

export const targetLanguage: TLanguageKey =
  (process.env.NEXT_PUBLIC_LOCALE as TLanguageKey) || 'nl';

const dictionary: TLocale = localefile;

export default dictionary;
