import { Rule } from '~/sanity';
import { localeStringValidation } from '../../../language/locale-validation';
export const topicalPage = {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Uitgelichte items',
      name: 'highlights',
      type: 'array',
      of: [
        {
          type: 'object',
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
              name: 'label',
              type: 'localeString',
              title: 'Tekst in de link',
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
        },
      ],
      validation: (rule: Rule) => rule.required().unique().length(2),
    },
    {
      title: 'empty-for-toggle',
      name: 'empty',
      type: 'localeString',
      hidden: true,
    },
  ],
};
