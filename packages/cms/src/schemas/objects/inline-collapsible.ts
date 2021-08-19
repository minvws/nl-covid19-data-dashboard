import { Rule } from '~/sanity';

export const inlineCollapsible = {
  title: 'Inklapbare titel en inhoud',
  name: 'inlineCollapsible',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'content',
      type: 'inlineBlock',
      title: 'Inhoud',
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
