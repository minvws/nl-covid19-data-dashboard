import { LokalizeText } from '@corona-dashboard/app/src/types/cms';
import { flatten, unflatten } from 'flat';
import mapKeys from 'lodash/mapKeys';

/**
 * Create a flat structure from which the JSON is rebuilt. Here we filter out
 * any deleted keys from the mutations file, so that any  deletions that
 * happened locally in your branch (but are not committed to the dataset yet)
 * are stripped from the output and your feature code sees the correct dataset
 * as it will be after merging the branch.
 */
export function createFlatTexts({
  documents,
  deletedKeys = [],
  appendDocumentIdToKey = false,
}: {
  documents: LokalizeText[];
  deletedKeys?: string[];
  appendDocumentIdToKey?: boolean;
}) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const published = documents.filter((x) => !x._id.startsWith('drafts.'));
  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));

  /**
   * First write all published document texts
   */
  for (const document of published) {
    if (deletedKeys.includes(document.key)) continue;

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
    if (deletedKeys.includes(document.key)) continue;

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
   * Paths inside the `__root` subject should be placed under the path in the
   * root of the exported json
   */
  const jsonKey =
    (document.subject === '__root' ? document.path : document.key) +
    (appendDocumentIdToKey ? `__@${document._id}` : '');

  const nl = document.should_display_empty
    ? ''
    : document.text.nl?.trim() || '';
  const en = document.should_display_empty
    ? ''
    : /**
       * Here make an automatic fallback to Dutch texts if English is missing.
       */
      document.text.en?.trim() || nl;

  return { jsonKey, localeText: { nl, en } };
}

export function removeIdFromKeys<T>(data: T) {
  return unflatten(
    mapKeys(
      flatten(data) as Record<string, string>,
      (_value, key) => key.split('__@')[0]
    ),
    { object: true }
  ) as T;
}
