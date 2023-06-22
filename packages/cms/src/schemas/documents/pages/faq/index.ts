import { createElement } from 'react';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { FaqQuestionsDescription } from '../../../../components/faq-questions-description';

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
      description: createElement(FaqQuestionsDescription),
      of: [defineArrayMember({ type: 'reference', to: { type: 'faqQuestion' } })],
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
