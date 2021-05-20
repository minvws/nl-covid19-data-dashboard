import nl from './nl_export.json';
import en from './en_export.json';

type NlLocale = typeof nl;
type EnLocale = typeof en;

export type Languages = {
  nl: NlLocale;
  en: EnLocale;
};

export type SiteText = NlLocale | EnLocale;

export type LanguageKey = keyof Languages;

export const languages = {
  nl,
  en,
};
