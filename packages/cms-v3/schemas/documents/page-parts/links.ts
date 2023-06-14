import { BsLink } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { isAdmin } from '../../../studio/roles';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';

export const links = defineType({
  title: "'Ook interessant' links",
  name: 'pageLinks',
  type: 'document',
  icon: BsLink,
  fieldsets: [
    PAGE_IDENTIFIER_REFERENCE_FIELDSET,
    {
      title: 'Links Configuratie',
      name: 'linksConfiguration',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    ...PAGE_IDENTIFIER_REFERENCE_FIELDS,
    defineField({
      title: 'Maximum aantal links',
      name: 'maxNumber',
      type: 'number',
      hidden: ({ currentUser }) => !isAdmin(currentUser),
      fieldset: 'linksConfiguration',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "'Ook interessant' links",
      description: 'Links naar interessante onderwerpen.',
      name: 'links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) =>
        rule
          .unique()
          .min(1)
          // TODO: properly type this
          .custom((_: any, context: any) => {
            const max = context.parent?.maxNumber ?? 0;
            if (max > 0 && context.parent?.links?.length > max) {
              return `Maximaal ${max} links toegestaan`;
            }
            return true;
          }),
    }),
  ],
});
