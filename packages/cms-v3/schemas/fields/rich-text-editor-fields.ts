import { MdAttachFile, MdLink } from 'react-icons/md';
import { StringRule, UrlRule, defineArrayMember, defineField } from 'sanity';

export const richTextEditorFields = [
  defineArrayMember({
    type: 'block',

    // Only allow these block styles
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      // Only allow these decorators
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
        { title: 'Underline', value: 'u' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          icon: MdLink,
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule: UrlRule) =>
                rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto'],
                }),
            }),
          ],
        },
        {
          name: 'inlineAttachment',
          type: 'file',
          title: 'Bestand uploaden',
          icon: MdAttachFile,
        },
        {
          name: 'richContentVariable',
          type: 'object',
          title: 'Rich content variable',
          fields: [
            defineField({
              name: 'Variable naam',
              type: 'string',
              title: 'variableName',
              hidden: true,
            }),
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    initialValue: {
      isFullWidth: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternatieve tekst (toegankelijkheid)',
        type: 'string',
        validation: (rule: StringRule) => rule.required(),
      }),
      defineField({
        name: 'isFullWidth',
        title: 'Afbeelding breed weergeven?',
        type: 'boolean',
      }),
      defineField({
        name: 'caption',
        title: 'Onderschrift',
        type: 'text',
      }),
    ],
  }),
  defineArrayMember({
    type: 'inlineCollapsible',
    title: 'Inklapbaar blok',
  }),
];
