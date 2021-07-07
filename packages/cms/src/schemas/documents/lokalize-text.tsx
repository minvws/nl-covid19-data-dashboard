import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';

/**
 * A text coming from the original Lokalize JSON structure is split into a
 * subject (the first name in the path) and the remaining JSON path. This way it
 * is easy to group and list the documents.
 *
 * The key is added with :: notation for easy access to the search function in
 * both Lokalize and Sanity.
 */
export const lokalizeText = {
  name: 'lokalizeText',
  type: 'document',
  title: 'Text',
  fields: [
    {
      title: 'Key',
      name: 'key',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Onderwerp',
      name: 'subject',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Pad',
      name: 'path',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Text',
      name: 'text',
      type: 'localeText',
      options: {
        ignoreLanguageSwitcher: true,
      },
      validation: (rule: Rule) =>
        /**
         * Only NL is required. For EN we use NL as a fallback when exporting.
         */
        rule.fields({
          nl: (rule) => rule.required().custom(validateTextPlaceholders),
          en: (rule) => [
            rule.required().warning(),
            rule.custom(validateTextPlaceholders),
          ],
        }),
    },
    {
      title: 'Toon als lege tekst',
      name: 'should_display_empty',
      type: 'boolean',
    },
    {
      name: 'is_newly_added',
      type: 'boolean',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'publish_count',
      type: 'number',
      readOnly: true,
      hidden: true,
    },
  ],
  preview: {
    select: {
      /**
       * The key field works probably a little better for the searching results
       * list, but the path field is cleaner when browsing texts because it
       * avoids a lot of string duplication.
       */
      title: 'key',
      subtitle: 'text.nl',
    },
  },
};

/**
 * A valid placeholder is considered to look like ``{{placeholderName}}``.
 * This validator looks for mistakes such as ``{placeHolderName}}`` or
 * ``{{placeHolderName}}}``.
 */
function validateTextPlaceholders(text = '') {
  const faultyVariables = [...(text.matchAll(/{+[^}]+}+/g) as any)]
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return;
    })
    .filter(isDefined);

  return faultyVariables.length > 0
    ? `De volgende variabelen zijn niet juist geformatteerd: ${faultyVariables
        .map((x) => `"${x}"`)
        .join(', ')}`
    : true;
}
