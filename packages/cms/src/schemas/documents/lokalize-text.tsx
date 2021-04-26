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
      validation: (Rule: any) =>
        /**
         * Only NL is required. For EN we use NL as a fallback when exporting.
         */
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required().warning(),
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
      title: 'path',
      subtitle: 'text.nl',
    },
  },
};
