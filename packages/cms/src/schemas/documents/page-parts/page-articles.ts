import { Rule } from '~/sanity';
import { whenNotAdministrator } from '../../../roles/when-not-administrator';
import { PAGE_IDENTIFIER_FIELDS } from '../../fields/page-identifier';

export const pageArticles = {
  title: 'Pagina Artikelen',
  name: 'pageArticles',
  type: 'document',
  fields: [
    ...PAGE_IDENTIFIER_FIELDS,
    {
      title: 'Artikel soort',
      name: 'articleKind',
      type: 'string',
      hidden: whenNotAdministrator,
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Maximum aantal artikelen',
      name: 'maxNumber',
      type: 'number',
      hidden: whenNotAdministrator,
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      title: 'Artikelen',
      name: 'articles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'article' } }],
      validation: (rule: Rule) =>
        rule.unique().custom((_: any, context: any) => {
          const max = context.parent?.maxNumber ?? 0;
          if (max > 0 && context.parent?.articles?.length > max) {
            return `Maximaal ${max} artikelen toegestaan`;
          }
          return true;
        }),
    },
  ],
};
