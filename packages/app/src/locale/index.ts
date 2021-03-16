import nl from './nl.json';
import en from './en.json';

export type NLLocale = typeof nl;
export type ENLocale = typeof en;

export type Languages = {
  nl: NLLocale;
  en: ENLocale;
};

export type AllLanguages = NLLocale | ENLocale;

export const languages: Languages = { en, nl };
