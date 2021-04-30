import { MdAttachFile } from 'react-icons/md';
import { supportedLanguages } from '../../language/supported-languages';

export default {
  name: 'localeRichContentBlock',
  type: 'object',
  title: 'Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [
      {
        type: 'block',

        // Only allow these block styles
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        lists: [],
        marks: {
          // Only allow these decorators
          decorators: [
            { title: 'Strong', value: 'strong' },
            { title: 'Emphasis', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'External link',
              fields: [
                {
                  name: 'href',
                  type: 'url',
                  title: 'URL',
                },
              ],
            },
            {
              name: 'inlineAttachment',
              type: 'file',
              title: 'Bestand uploaden',
              icon: MdAttachFile,
            },
          ],
        },
      },
      {
        type: 'image',
        fields: [
          {
            name: 'alt',
            title: 'Alternatieve tekst (toegankelijkheid)',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
            options: {
              isHighlighted: true,
            },
          },
          {
            name: 'isFullWidth',
            title: 'Afbeelding breed weergeven?',
            type: 'boolean',
          },
          {
            name: 'caption',
            title: 'Onderschrift',
            type: 'text',
          },
        ],
      },
      {
        type: 'collapsible',
        title: 'Inklapbaar blok',
      },
      // @TODO
      // {
      //   type: "lineChart"
      // }
    ],
  })),
};
