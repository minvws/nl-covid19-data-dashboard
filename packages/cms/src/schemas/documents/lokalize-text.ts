/**
 * A lokalizeText type is referenced by a lokalizeSubject. There can be any number of
 * texts grouped under a subject. Each has a path which corresponds with the
 * JSON path from the root-level key (subject).
 *
 * The text for both EN and NL are stored in a localeText.
 *
 * This is the multi-line version of lokalizeString. Not sure if we need it but
 * seeing if this is useful...
 */

export const lokalizeText = {
  name: 'lokalizeText',
  type: 'document',
  title: 'Text',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      title: 'Onderwerp',
      name: 'subject',
      type: 'string',
      // description: 'Data path in dot notation from JSON root-level subject.',
      /**
       * This could be made editable later after we killed Lokalize. It would
       * allow us to clean up the used names.
       */
      readOnly: true,
    },
    {
      title: 'Pad',
      name: 'path',
      type: 'string',
      description: 'Data path in dot notation from JSON root-level subject.',
      /**
       * This could be made editable later after we killed Lokalize. It would
       * allow us to clean up the used names.
       */
      readOnly: true,
    },
    {
      title: 'Text',
      name: 'text',
      type: 'localeText',
      validation: (Rule: any) =>
        /**
         * Only NL is required. For EN we use NL as a fallback when exporting.
         */
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset(),
        }),
    },
  ],
  preview: {
    select: {
      title: 'path',
      subtitle: 'text.nl',
    },
  },
};
