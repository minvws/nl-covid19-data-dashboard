// import { HIGHLIGHTED_ARTICLES } from '~/src/schemas/fields/highlighted-articles';

export const positiveTested = {
  name: 'positiveTested',
  type: 'document',
  title: 'Over dit dashboard',
  fields: [
    //
    {
      title: "'Ook interessant' links",
      description: 'Maximaal 4 links naar interessante onderwerpen.',
      name: 'pageLinks',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (Rule: any) => Rule.required().min(1).max(4),
    },
  ],
};
