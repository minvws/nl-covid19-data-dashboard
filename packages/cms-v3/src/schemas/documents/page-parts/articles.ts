import { BsNewspaper } from 'react-icons/bs';
import { ValidationContext, defineArrayMember, defineField, defineType } from 'sanity';
import { isDefined } from 'ts-is-present';
import { isAdmin } from '../../../studio/roles';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';
import { isArticleValidationContextParent } from '../../utils/articles';

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
      hidden: ({ currentUser }) => !isAdmin(currentUser),
      fieldset: 'articleConfiguration',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      title: 'Maximum aantal artikelen',
      name: 'maxNumber',
      type: 'number',
      hidden: ({ currentUser }) => !isAdmin(currentUser),
      fieldset: 'articleConfiguration',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      title: 'Artikelen',
      name: 'articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'article' } })],
      validation: (rule) =>
        rule.unique().custom((_, context: ValidationContext) => {
          const parent = context.parent;
          if (!parent) return true;

          const isParent = isArticleValidationContextParent(parent);
          if (!isParent) return true;

          const { minNumber: min, maxNumber: max, articles } = parent;
          if (isDefined(max) && articles?.length > max) return `Maximaal ${max} artikelen toegestaan`;
          if (isDefined(min) && articles?.length < min) return `Minstens ${min} artikel(en) verplicht`;

          return true;
        }),
    }),
  ],
});
