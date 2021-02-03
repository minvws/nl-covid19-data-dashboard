export const HIGHLIGHTED_ARTICLE = {
  title: 'Uitgelichte artikelen',
  name: 'articles',
  type: 'array',
  of: [{ type: 'reference', to: { type: 'article' } }],
  validation: (Rule) => Rule.required().unique().max(2),
};
