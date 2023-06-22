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
  ],
  preview: {
    select: {
      title: 'group',
    },
    prepare: prepareLocalized,
  },
};
