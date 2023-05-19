import { BsNewspaper } from 'react-icons/bs';
import { ConditionalProperty, defineArrayMember, defineField, defineType } from 'sanity';
import { isDefined } from 'ts-is-present';
import { whenNotAdministrator } from '../../../studio/roles';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';

export const articles = defineType({
  title: 'Pagina Artikelen',
  name: 'pageArticles',
  type: 'document',
  icon: BsNewspaper,
  fieldsets: [
    PAGE_IDENTIFIER_REFERENCE_FIELDSET,
    {
      title: 'Artikel Configuratie',
      name: 'articleConfiguration',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    ...PAGE_IDENTIFIER_REFERENCE_FIELDS,
    defineField({
      title: 'Minimum aantal artikelen',
      name: 'minNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'articleConfiguration',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      title: 'Maximum aantal artikelen',
      name: 'maxNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'articleConfiguration',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      title: 'Artikelen',
      name: 'articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'article' } })],
      validation: (rule) =>
        // TODO: see if this can be typed properly
        rule.unique().custom((_: any, context: any) => {
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
    }),
  ],
});
