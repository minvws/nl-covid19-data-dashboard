import { selectedLanguages$ } from '../../../plugins/translate/datastore';
import { prepareLocalized } from '../../../plugins/translate/prepareLocalized';

let selectedLanguage = 'nl';
selectedLanguages$.subscribe((selected) => {
  selectedLanguage = selected.length ? selected[0] : 'nl';
});

export default {
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
