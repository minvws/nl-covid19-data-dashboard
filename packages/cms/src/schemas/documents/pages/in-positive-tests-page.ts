import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';

export const in_positiveTestsPage = {
  title: 'Positieve testen Internationaal',
  name: 'in_positiveTestsPage',
  type: 'document',
  fields: [
    HIGHLIGHTED_ARTICLES,
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
