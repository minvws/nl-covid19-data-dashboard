import { ID_PREFIX, removeIdsFromKeys } from '@corona-dashboard/common';
import { flatten, unflatten } from 'flat';
import enRaw from './en_export.json';
import nlRaw from './nl_export.json';
import { SiteText } from './site-text';

const hasIdsInKeys = JSON.stringify(nlRaw).includes(ID_PREFIX);

const nl = cleanText(nlRaw);
const en = cleanText(enRaw);

export const languages = { nl, en };

export type { SiteText } from './site-text';
export type Languages = typeof languages;
export type LanguageKey = keyof Languages;

function cleanText(rawText: Record<string, unknown>) {
  if (!hasIdsInKeys) {
    return rawText as unknown as SiteText;
  }

  const flatText = flatten(rawText) as Record<string, string>;
  const flatReplaced = removeIdsFromKeys(flatText);

  return unflatten(flatReplaced, { object: true }) as SiteText;
}
