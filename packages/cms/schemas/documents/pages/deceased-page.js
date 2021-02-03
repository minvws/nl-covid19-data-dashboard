export default {
  title: 'Sterfte pagina',
  name: 'deceasedPage',
  type: 'document',
  fields: [
    {
      title: 'Uitgelichte artikelen',
      name: 'articles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'article' } }],
      validation: (Rule) => Rule.required().unique().max(2),
    },
  ],
};
