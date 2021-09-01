import { Rule } from '~/sanity';

export const HIGHLIGHTED_ARTICLES = {
  title: 'Uitgelichte artikelen',
  name: 'articles',
  type: 'array',
  of: [{ type: 'reference', to: { type: 'article' } }],
  validation: (rule: Rule) => rule.required().unique().max(2),
};
