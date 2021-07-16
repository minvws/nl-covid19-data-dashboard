import { LokalizeText } from '@corona-dashboard/app/src/types/cms';

/**
 * The id prefix is a string which will join a lokalize key with its sanity ID.
 * This string will be used to extract an id from a lokalize key.
 */
export const ID_PREFIX = '__@__';

/**
 * Create a flat structure from which the JSON is rebuilt. Here we filter out
 * any deleted keys from the mutations file, so that any  deletions that
 * happened locally in your branch (but are not committed to the dataset yet)
 * are stripped from the output and your feature code sees the correct dataset
 * as it will be after merging the branch.
 */
export function createFlatTexts(
  documents: LokalizeText[],
  deletedKeys: string[] = []
) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const published = documents.filter((x) => !x._id.startsWith('drafts.'));
  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));

  /**
   * First write all published document texts
   */
  for (const document of published) {
    if (deletedKeys.includes(document.key)) continue;

    const { jsonKey, localeText } = parseLocaleTextDocument(document);

    nl[jsonKey] = localeText.nl;
    en[jsonKey] = localeText.en;
  }

  /**
   * Then walk through draft documents and overwrite published texts with their
   * draft version.
   */
  for (const document of drafts) {
    if (deletedKeys.includes(document.key)) continue;

    const { jsonKey, localeText } = parseLocaleTextDocument(document);

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
    document.key.replace('__root.', '') +
    (appendDocumentIdToKey ? ID_PREFIX + document._id : '');

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
