import { LokalizeText } from '@corona-dashboard/app/src/types/cms';

export function createFlatTexts(
  documents: LokalizeText[],
  { warn }: { warn?: boolean } = {}
) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));
  const published = documents.filter((x) => !x._id.startsWith('drafts.'));

  /**
   * First write all published document texts
   */
  for (const document of published) {
    const { key, localeText } = parseLocaleTextDocument(document, { warn });
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  /**
   * Then walk through draft documents and overwrite published texts with their
   * draft version.
   */
  for (const document of drafts) {
    const { key, localeText } = parseLocaleTextDocument(document, { warn });
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  return { nl, en };
}

export function parseLocaleTextDocument(
  document: LokalizeText,
  { warn }: { warn?: boolean } = {}
) {
  /**
   * paths inside the `__root` subject should be placed under the path
   * in the root of the exported json
   */
  const key =
    document.subject === '__root'
      ? document.path
      : `${document.subject}.${document.path}`;

  const nl = document.display_empty ? '' : document.text.nl?.trim() || '';
  const en = document.display_empty
    ? ''
    : /**
       * Here make an automatic fallback to Dutch texts if English is missing.
       */
      document.text.en?.trim() || nl;

  if (warn && !document.text.en?.trim()) {
    console.warn('Missing english translation for path:', document.search_key);
  }

  return { key, localeText: { nl, en } };
}
