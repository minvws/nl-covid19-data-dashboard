import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { localeStringValidation } from '../../../language/locale-validation';
import { whenNotAdministrator } from '../../../roles/when-not-administrator';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-identifier-reference-fields';

export const pageHighlightedItems = {
  title: 'Uitgelichte items',
  name: 'pageHighlightedItems',
  type: 'document',
  fieldsets: [
    PAGE_IDENTIFIER_REFERENCE_FIELDSET,
    {
      title: 'Highlights Configuratie',
      name: 'highlightConfiguration',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    ...PAGE_IDENTIFIER_REFERENCE_FIELDS,
    {
      title: 'Minimum aantal items',
      name: 'minNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'highlightConfiguration',
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      title: 'Maximum aantal items',
      name: 'maxNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'highlightConfiguration',
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
          const max = context.parent?.maxNumber ?? 2;
          if (context.document.showWeeklyHighlight) {
            return value.length === max - 1 ? true : `Als er een weekbericht geselecteerd is moet er ${max - 1} uitgelicht item(s) toegevoegd zijn.`;
          } else {
            return value.length === max ? true : `Als er geen weekbericht geselecteerd is moeten er ${max} uitgelichte item(s) toegevoegd zijn.`;
          }
        }).warning(),
        Rule.required()
          .unique()
          .custom((_: any, context: any) => {
            const min = context.parent?.minNumber;
            const max = context.parent?.maxNumber;
            if (isDefined(max) && context.parent?.articles?.length > max) {
              return `Maximaal ${max} artikelen toegestaan`;
            }
            if (isDefined(min) && context.parent?.articles?.length < min) {
              return `Minstens ${min} artikel(en) verplicht`;
            }
            return true;
          }),
      ],
    },
  ],
};
