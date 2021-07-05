import { removeIdFromKeys } from '@corona-dashboard/common';
import enRaw from './en_export.json';
import nlRaw from './nl_export.json';
import { SiteText } from './site-text';

const hasIdsInKeys = Object.keys(nlRaw).some((x) => x.includes('__@'));

const nl = removeIdsFromKeys(nlRaw);
const en = removeIdsFromKeys(enRaw);

export const languages = { nl, en };

export type { SiteText } from './site-text';
export type Languages = typeof languages;
export type LanguageKey = keyof Languages;

function removeIdsFromKeys<T>(obj: T) {
  return (hasIdsInKeys ? removeIdFromKeys(obj) : obj) as unknown as SiteText;
}
