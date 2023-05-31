import { prepareLocalized } from '../../../plugins/translate/prepare-localized';

export const veelgesteldeVragenGroups = {
  name: 'veelgesteldeVragenGroups',
  type: 'document',
  title: 'Veelgestelde vragen groepen',
  fields: [
    {
      name: 'group',
      type: 'localeString',
      title: 'Groepsnaam',
    },
    {
      name: 'questions',
      type: 'array',
      title: 'Vragen',
      description: 'Je kan veel gestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen',
      of: [{ type: 'reference', to: { type: 'faqQuestion' } }],
    },
  ],
  preview: {
    select: {
      title: 'group',
    },
    prepare: prepareLocalized,
  },
};
