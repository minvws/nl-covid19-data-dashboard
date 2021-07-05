import { removeIdFromKeys } from '@corona-dashboard/common';
import enRaw from './en_export.json';
import nlRaw from './nl_export.json';
import { SiteText } from './site-text';

const nl = removeIdsFromKeysIfDevelop(nlRaw);
const en = removeIdsFromKeysIfDevelop(enRaw);

export const languages = { nl, en };

export type { SiteText } from './site-text';
export type Languages = typeof languages;
export type LanguageKey = keyof Languages;

function removeIdsFromKeysIfDevelop<T>(obj: T) {
  return (process.env.NODE_ENV === 'production'
    ? obj
    : removeIdFromKeys(obj)) as unknown as SiteText;
}
