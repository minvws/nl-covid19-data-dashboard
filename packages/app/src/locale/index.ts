import nl from './nl_export.json';
import en from './en_export.json';

export type NlLocale = typeof nl;
export type EnLocale = typeof en;

export type Languages = {
  nl: NlLocale;
  en: EnLocale;
};

export type AllLanguages = NlLocale | EnLocale;

export type LanguageKey = keyof Languages;

export const languages = {
  nl,
  en,
};
