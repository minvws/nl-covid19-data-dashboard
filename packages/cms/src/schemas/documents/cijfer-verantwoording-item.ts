import { Rule } from '~/sanity';
import {
  localeStringValidation,
  localeValidation,
} from '../../language/locale-validation';

export const cijferVerantwoordingItem = {
  title: 'Cijferverantwoordingen',
  name: 'cijferVerantwoordingItem',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'group',
      type: 'reference',
      to: [{ type: 'cijferVerantwoordingGroups' }],
      title: 'Groep',
      validation: (Rule: Rule) => Rule.reset().required(),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
