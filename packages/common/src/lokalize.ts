import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import mapKeys from 'lodash/mapKeys';

/**
 * The id prefix is a string which will join a lokalize key with its sanity ID.
 * This string will be used to extract an id from a lokalize key.
 */
export const ID_PREFIX = '__@__';

/**
 * Creates a flat structure from which both language JSON files are built.
 */
export function createFlatTexts(
  documents: LokalizeText[],
  appendDocumentIdToKey = false
) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const published = documents.filter((x) => !x._id.startsWith('drafts.'));
  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));

  /**
   * First write all published document texts
   */
  for (const document of published) {
    const { jsonKey, localeText } = parseLocaleTextDocument(
      document,
      appendDocumentIdToKey
    );

    nl[jsonKey] = localeText.nl;
    en[jsonKey] = localeText.en;
  }

  /**
   * Then walk through draft documents and overwrite published texts with their
   * draft version.
   */
  for (const document of drafts) {
    const { jsonKey, localeText } = parseLocaleTextDocument(
      document,
      appendDocumentIdToKey
    );

    nl[jsonKey] = localeText.nl;
    en[jsonKey] = localeText.en;
  }

  return { nl, en };
}

export function parseLocaleTextDocument(
  document: LokalizeText,
  appendDocumentIdToKey = false
) {
  /**
   * Paths inside the `__root` subject should be placed in the
   * root of the exported json.
   */
  const jsonKey =
    document.key.replace('__root.', '') +
    (appendDocumentIdToKey ? ID_PREFIX + document._id : '');

  const nl = document.should_display_empty
    ? ''
    : document.text?.nl?.trim() || '';

  /**
   * Fall back to Dutch texts if English is missing.
   */
  const en = document.should_display_empty
    ? ''
    : document.text?.en?.trim() || nl;

  return { jsonKey, localeText: { nl, en } };
}

export function removeIdsFromKeys(data: Record<string, string>) {
  return mapKeys(data, (_value, key) => key.split(ID_PREFIX)[0]);
}
