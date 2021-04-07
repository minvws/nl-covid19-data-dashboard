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
const SHORTEN_LENGTH = 100;

export const lokalizeText = {
  name: 'lokalizeText',
  type: 'document',
  title: 'Text',
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
      // readOnly: true,
    },
    {
      title: 'Text',
      name: 'text',
      type: 'localeText',
    },
  ],
  preview: {
    select: {
      title: 'path',
      subtitle: 'text.nl',
    },
    prepare(selection: { title: string; subtitle: string }) {
      const { title, subtitle } = selection;

      const shortSubtitle = subtitle.substr(0, SHORTEN_LENGTH);
      const shortLength = shortSubtitle.length;
      return {
        title,
        subtitle:
          /**
           * @TODO check if shortening is actually necessary because Sanity might
           * handle it already
           */
          shortLength === SHORTEN_LENGTH
            ? `${shortSubtitle}...`
            : shortSubtitle,
      };
    },
  },
};
