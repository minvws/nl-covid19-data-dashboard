import { createElement } from 'react';
import { BsFileEarmark } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { LokalizeDocumentDescription } from '../../lokalize/components/lokalize-document-description';
import { validateLocaleTextPlaceholders } from '../../studio/validation/lokalize-variable-placeholder-validation';

/**
 * A text coming from the original Lokalize JSON structure is split into a
 * subject (the first name in the path) and the remaining JSON path. This way it
 * is easy to group and list the documents.
 *
 * The key is added with :: notation for easy access to the search function in
 * both Lokalize and Sanity.
 */
export const lokalizeText = defineType({
  name: 'lokalizeText',
  type: 'document',
  title: 'Lokalize tekst',
  icon: BsFileEarmark,
  fields: [
    defineField({
      title: 'Key',
      name: 'key',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      title: 'Onderwerp',
      name: 'subject',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      title: 'Text',
      name: 'text',
      description: createElement(LokalizeDocumentDescription),
      type: 'localeText',
      validation: (rule) => [
        rule.fields({
          nl: (rule) => rule.required(),
          en: (rule) => rule.required().warning(),
        }),

        rule.custom(validateLocaleTextPlaceholders),
      ],
    }),
    defineField({
      title: 'Toon als lege tekst',
      name: 'should_display_empty',
      type: 'boolean',
    }),
    defineField({
      name: 'is_newly_added',
      type: 'boolean',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'is_move_placeholder',
      type: 'boolean',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'publish_count',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      /**
       * The key field works probably a little better for the searching results
       * list, but the path field is cleaner when browsing texts because it
       * avoids a lot of string duplication.
       */
      key: 'key',
      subtitle: 'text.nl',
    },
    prepare({ key, subtitle }: Record<'key' | 'subtitle', string>) {
      const title = key.split('.').slice(3).join('.');
      return {
        title,
        subtitle,
      };
    },
  },
});
