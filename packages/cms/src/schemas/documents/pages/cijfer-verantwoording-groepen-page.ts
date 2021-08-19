import { prepareLocalized } from '../../../plugins/translate/prepare-localized';

export const cijferVerantwoordingGroups = {
  name: 'cijferVerantwoordingGroups',
  type: 'document',
  title: 'Cijfer verantwoording groepen',
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
