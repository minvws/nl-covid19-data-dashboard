import { BsBraces, BsCardImage, BsLink, BsListOl, BsListUl, BsPaperclip, BsTypeBold, BsTypeItalic, BsTypeUnderline } from 'react-icons/bs';
import { StringRule, UrlRule, defineArrayMember, defineField } from 'sanity';

export const richContentFields = [
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
      { title: 'Bullet', value: 'bullet', icon: BsListUl },
      { title: 'Numbered', value: 'number', icon: BsListOl },
    ],
    marks: {
      // Only allow these decorators
      decorators: [
        { title: 'Strong', value: 'strong', icon: BsTypeBold },
        { title: 'Emphasis', value: 'em', icon: BsTypeItalic },
        { title: 'Underline', value: 'u', icon: BsTypeUnderline },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          icon: BsLink,
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule: UrlRule) =>
                rule
                  .required()
                  .uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto'],
                  })
                  .error('URL is verplicht'),
            }),
          ],
        },
        {
          name: 'inlineAttachment',
          type: 'file',
          title: 'Bestand uploaden',
          icon: BsPaperclip,
        },
        {
          name: 'richContentVariable',
          type: 'object',
          title: 'Rich content variable',
          icon: BsBraces,
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
    icon: BsCardImage,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternatieve tekst (toegankelijkheid)',
        type: 'string',
        validation: (rule: StringRule) => rule.required().error('Alt text is verplicht'),
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
