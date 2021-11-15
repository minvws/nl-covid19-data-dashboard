import { Rule } from '~/sanity';

export const pageIdentifier = {
  name: 'pageIdentifier',
  type: 'document',
  title: 'Page Identifier',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'identifier',
      type: 'string',
      title: 'ID',
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
