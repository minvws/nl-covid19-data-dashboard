import { defineField, defineType } from 'sanity';
import { supportedLanguages } from '../../studio/i18n';
import { BsCardImage } from 'react-icons/bs';

export const image = defineType({
  name: 'localeImage',
  type: 'object',
  title: 'Locale Image Content',
  fields: supportedLanguages.map(({ title, id }) =>
    defineField({
      title,
      name: id,
      type: 'image',
      icon: BsCardImage,
      initialValue: {
        isFullWidth: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatieve tekst (toegankelijkheid)',
          type: 'string',
          validation: (rule) => rule.required().error('Alt text is verplicht'),
        }),
        defineField({
          name: 'isFullWidth',
          title: 'Afbeelding breed weergeven?',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'caption',
          title: 'Onderschrift',
          type: 'text',
        }),
      ],
    })
  ),
});
