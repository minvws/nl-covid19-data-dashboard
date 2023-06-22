import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { whenNotAdministrator } from '../../../roles/when-not-administrator';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-identifier-reference-fields';

export const pageArticles = {
  title: 'Pagina Artikelen',
  name: 'pageArticles',
  type: 'document',
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
    {
      title: 'Minimum aantal artikelen',
      name: 'minNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'articleConfiguration',
    },
    {
      title: 'Maximum aantal artikelen',
      name: 'maxNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      fieldset: 'articleConfiguration',
    },
    {
      title: 'Artikelen',
      name: 'articles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'article' } }],
      validation: (rule: Rule) =>
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
    },
  ],
};
