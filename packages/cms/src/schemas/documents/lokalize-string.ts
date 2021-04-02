/**
 * A lokalizeString type is referenced by a lokalizeSubject. There can be any number of
 * texts grouped under a subject. Each has a path which corresponds with the
 * JSON path from the root-level key (subject).
 *
 * The text for both EN and NL are stored in a localeString.
 */

export const lokalizeString = {
  name: 'lokalizeString',
  type: 'document',
  title: 'String',
  fields: [
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
      type: 'localeString',
    },
  ],
  preview: {
    select: {
      title: 'path',
      subtitle: 'text.nl',
    },
  },
};
