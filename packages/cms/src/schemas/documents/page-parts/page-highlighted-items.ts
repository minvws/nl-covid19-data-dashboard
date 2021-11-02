import { Rule } from '~/sanity';
import { localeStringValidation } from '../../../language/locale-validation';
import { whenNotAdministrator } from '../../../roles/when-not-administrator';
import { PAGE_IDENTIFIER_FIELDS } from '../../fields/page-identifier-fields';

export const pageHighlightedItems = {
  title: 'Uitgelichte items',
  name: 'pageHighlightedItems',
  type: 'document',
  fields: [
    ...PAGE_IDENTIFIER_FIELDS,
    {
      title: 'Maximum aantal links',
      name: 'maxNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      validation: (rule: Rule) => rule.required().min(1),
    },
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
              name: 'href',
              type: 'localeString',
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
            return value.length === 1
              ? true
              : 'Als er een weekbericht geselecteerd is moet er 1 uitgelicht items toegevoegd zijn.';
          } else {
            return value.length === 2
              ? true
              : 'Als er geen weekbericht geselecteerd is moeten er 2 uitgelichte items toegevoegd zijn.';
          }
        }).warning(),
        Rule.required().unique().min(1).max(2),
      ],
    },
  ],
};
