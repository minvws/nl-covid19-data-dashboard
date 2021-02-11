/** This file is meant to trick TypeScript. We're using a webpack plugin to
 * rewrite some imports based on desired locale. This file just exports the
 * type from the NL file so all types still work.
 *
 * We still export type TALLLanguages = TNLLocale | TENLocale here because it validates key equality
 * in TS
 *
 */
import locale from './nl.json';

export type Locale = typeof locale;

import en from './en.json';
import nl from './nl.json';

export type NLLocale = typeof nl;
export type ENLocale = typeof en;

export type Languages = {
  nl: NLLocale;
  en: ENLocale;
};

export type AllLanguages = NLLocale | ENLocale;

export type LanguageKey = keyof Languages;
const languages: Languages = { en, nl } as const;

export const targetLanguage: LanguageKey =
  (process.env.NEXT_PUBLIC_LOCALE as LanguageKey) || 'nl';
const dictionary: AllLanguages = languages[targetLanguage];

export default dictionary;
