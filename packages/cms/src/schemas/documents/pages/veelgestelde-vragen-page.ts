import React from 'react';
import { FrequentlyAskedQuestionsList } from '../../../components/frequently-asked-questions-list';

export const veelgesteldeVragen = {
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen pagina',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      name: 'questions',
      type: 'array',
      title: 'Vragen',
      description: React.createElement(FrequentlyAskedQuestionsList),
      of: [{ type: 'reference', to: { type: 'faqQuestion' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
