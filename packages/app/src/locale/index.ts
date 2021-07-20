import { ID_PREFIX, removeIdsFromKeys } from '@corona-dashboard/common';
import enRaw from './en_export.json';
import nlRaw from './nl_export.json';
import { SiteText } from './site-text';

const hasIdsInKeys = JSON.stringify(nlRaw).includes(ID_PREFIX);

const nl = cleanRaw<SiteText>(nlRaw);
const en = cleanRaw<SiteText>(enRaw);

export const languages = { nl, en };

export type { SiteText } from './site-text';
export type Languages = typeof languages;
export type LanguageKey = keyof Languages;

function cleanRaw<T>(obj: Record<string, unknown>) {
  return (hasIdsInKeys ? removeIdsFromKeys(obj) : obj) as unknown as T;
}
