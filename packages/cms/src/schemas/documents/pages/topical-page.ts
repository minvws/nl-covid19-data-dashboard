import { Rule } from '~/sanity';
import { localeStringValidation } from '../../../language/locale-validation';
export const topicalPage = {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Laat weekbericht zien',
      name: 'showWeeklyHighlight',
      type: 'boolean',
    },
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
      validation: (Rule: any) => [
        Rule.custom((value: any, context: any) => {
          if (context.document.showWeeklyHighlight) {
            return value.length === 2
              ? true
              : 'Als er een weekbericht geselecteerd is moet er 1 uitgelicht items toegevoegd zijn.';
          } else {
            return value.length === 3
              ? true
              : 'Als er geen weekbericht geselecteerd is moeten er 3 uitgelichte items toegevoegd zijn.';
          }
        }).warning(),
        Rule.required().unique().min(2).max(3),
      ],
    },
    {
      title: 'empty-for-toggle',
      name: 'empty',
      type: 'localeString',
      hidden: true,
    },
  ],
};
