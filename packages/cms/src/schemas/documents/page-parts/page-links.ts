import { Rule } from '~/sanity';
import { whenNotAdministrator } from '../../../roles/when-not-administrator';
import { PAGE_IDENTIFIER_FIELDS } from '../../fields/page-identifier-fields';

export const pageLinks = {
  title: "'Ook interessant' links",
  name: 'pageLinks',
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
      title: "'Ook interessant' links",
      description: 'Links naar interessante onderwerpen.',
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (rule: Rule) =>
        rule
          .unique()
          .min(1)
          .custom((_: any, context: any) => {
            const max = context.parent?.maxNumber ?? 0;
            if (max > 0 && context.parent?.links?.length > max) {
              return `Maximaal ${max} links toegestaan`;
            }
            return true;
          }),
    },
  ],
};
