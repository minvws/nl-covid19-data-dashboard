import { Rule } from '~/sanity';
import { localeStringValidation } from '../../language/locale-validation';

export const decoratedLink = {
  type: 'object',
  title: 'Een link voorzien van een image, categorie en label',
  name: 'decoratedLink',
  preview: {
    select: {
      title: 'title.nl',
    },
  },
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      title: 'Categorie',
      name: 'category',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link naar pagina',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Afbeelding',
      name: 'cover',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          title: 'Alternatieve tekst (toegankelijkheid)',
          name: 'alt',
          type: 'localeString',
        },
      ],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
