/**
 * A Lokalize Subject corresponds to one of the root-level keys that where
 * originally used in Lokalize. It contains a list of references to LokalizeText
 * instances that each contain info about the object path and the EN and NL
 * translations of that string.
 *
 * Translations are grouped under a subject, so that we can display them nicely
 * in the interface and have all translations sorted by path.
 */

/**
 * Using named export we can write the code more in-line with the app package
 * style and also create barrel files to clean up the imports (bundle size
 * is not an issue here), so I think we should convert other files in this
 * repo to use named exports where possible.
 */
import { FaLanguage } from 'react-icons/fa';

export const lokalizeSubject = {
  name: 'lokalizeSubject',
  type: 'document',
  title: 'Lokalize',
  icon: FaLanguage,
  fields: [
    {
      title: 'Key',
      name: 'key',
      type: 'string',
      /**
       * This key is filled with the root-level JSON key at import, but could be
       * changed later after we kill Lokalize. It allows us to rename the keys
       * we have, which should make it easier to keep things clean.
       */
      description:
        'A unique snake-cased key that will form the root-level JSON key.',
    },
    {
      title: 'Texts',
      name: 'texts',
      type: 'array',
      description:
        'A list of all strings under the subject key, sorted by their path field',
      /**
       * We can support multiple types for accommodating short and long texts.
       */
      of: [{ type: 'lokalizeText' }],
    },
  ],
  preview: {
    select: {
      title: 'key',
    },
  },
  orderings: [
    {
      title: 'Alfabetisch',
      name: 'keyAsc',
      by: [{ field: 'key', direction: 'asc' }],
    },
  ],
};
