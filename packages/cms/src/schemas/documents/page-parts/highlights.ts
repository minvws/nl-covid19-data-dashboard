import { BsFileEarmarkText, BsNewspaper } from 'react-icons/bs';
import { ValidationContext, defineArrayMember, defineField, defineType } from 'sanity';
import { isDefined } from 'ts-is-present';
import { isAdmin } from '../../../studio/roles';
import { localeStringValidation } from '../../../studio/validation/locale-validation';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';
import { isArticleValidationContextParent } from '../../utils/articles';

export const highlights = defineType({
  title: 'Uitgelichte items',
  name: 'pageHighlightedItems',
  type: 'document',
  icon: BsNewspaper,
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
    defineField({
      title: 'Minimum aantal items',
      name: 'minNumber',
      type: 'number',
      hidden: ({ currentUser }) => !isAdmin(currentUser),
      fieldset: 'highlightConfiguration',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      title: 'Maximum aantal items',
      name: 'maxNumber',
      type: 'number',
      hidden: ({ currentUser }) => !isAdmin(currentUser),
      fieldset: 'highlightConfiguration',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      title: 'Laat weekbericht zien',
      name: 'showWeeklyHighlight',
      type: 'boolean',
    }),
    defineField({
      title: 'Uitgelichte items',
      name: 'highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: BsFileEarmarkText,
          fields: [
            defineField({
              title: 'Titel',
              name: 'title',
              type: 'localeString',
              validation: localeStringValidation((rule) => rule.required()),
            }),
            defineField({
              title: 'Categorie',
              name: 'category',
              type: 'localeString',
              validation: localeStringValidation((rule) => rule.required()),
            }),
            defineField({
              name: 'href',
              type: 'localeString',
              title: 'Link naar pagina',
              validation: (rule) => rule.required(),
            }),
            defineField({
              title: 'Afbeelding',
              name: 'cover',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  title: 'Alternatieve tekst (toegankelijkheid)',
                  name: 'alt',
                  type: 'localeString',
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.nl',
              date: 'publicationDate',
              media: 'cover',
            },
            prepare({ title, date, media }) {
              return {
                title,
                subtitle: new Date(date).toLocaleString(),
                media,
              };
            },
          },
        }),
      ],
      validation: (rule) => [
        rule
          .custom((value: unknown, context: ValidationContext) => {
            const parent = context.parent;
            if (!parent) return true;

            const isParent = isArticleValidationContextParent(parent);
            if (!isParent) return true;

            const valueIsArray = Array.isArray(value);
            if (!valueIsArray) return true;

            const max = parent.maxNumber ?? 2;
            if (context.document?.showWeeklyHighlight) {
              return value.length === max - 1 ? true : `Als er een weekbericht geselecteerd is moet er ${max - 1} uitgelicht item(s) toegevoegd zijn.`;
            } else {
              return value.length === max ? true : `Als er geen weekbericht geselecteerd is moeten er ${max} uitgelichte item(s) toegevoegd zijn.`;
            }
          })
          .warning(),
        rule
          .required()
          .unique()
          .custom((_, context: ValidationContext) => {
            const parent = context.parent;
            if (!parent) return true;

            const isParent = isArticleValidationContextParent(parent);
            if (!isParent) return true;

            const { minNumber: min, maxNumber: max, articles } = parent;
            if (isDefined(max) && articles?.length > max) return `Maximaal ${max} artikelen toegestaan`;
            if (isDefined(min) && articles?.length < min) return `Minstens ${min} artikel(en) verplicht`;

            return true;
          }),
      ],
    }),
  ],
});
