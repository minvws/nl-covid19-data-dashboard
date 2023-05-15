import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen pagina',
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    }),
    defineField({
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    }),
    defineField({
      name: 'questions',
      type: 'array',
      title: 'Vragen',
      description: 'Je kan veel gestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen',
      of: [{ type: 'reference', to: { type: 'faqQuestion' } }],
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
