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

/**
 * We should probably replace all imports from src/locale with
 * this method as it allows us to switch between static and
 * dynamic rendering
 */
export function getDictionary(locale = 'nl') {
  const targetLanguage: TLanguageKey =
    (process.env.NEXT_PUBLIC_LOCALE as TLanguageKey) || locale;
  const dictionary: TALLLanguages = languages[targetLanguage];
  return dictionary;
}

const dictionary: TALLLanguages = languages[targetLanguage];

export default dictionary;
