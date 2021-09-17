import { Rule } from '~/sanity';

export const PAGE_LINKS = {
  title: "'Ook interessant' links",
  description: 'Maximaal 4 links naar interessante onderwerpen.',
  name: 'pageLinks',
  type: 'array',
  of: [{ type: 'link' }],
  validation: (rule: Rule) => rule.required().min(1).max(4),
};
