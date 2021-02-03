export const HIGHLIGHTED_ARTICLES = {
  title: 'Uitgelichte artikelen',
  name: 'articles',
  type: 'array',
  of: [{ type: 'reference', to: { type: 'article' } }],
  validation: (Rule) => Rule.required().unique().max(2),
};
