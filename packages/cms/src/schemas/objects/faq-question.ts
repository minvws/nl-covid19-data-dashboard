import { selectedLanguages$ } from '../../plugins/translate/datastore';
import { prepareLocalized } from '../../plugins/translate/prepareLocalized';

let selectedLanguage = 'nl';
selectedLanguages$.subscribe((selected: any[]) => {
  selectedLanguage = selected.length ? selected[0] : 'nl';
});

export default {
  title: 'Veelgestelde vraag',
  name: 'faqQuestion',
  type: 'object',
  fields: [
    { name: 'title', type: 'localeString', title: 'Titel' },
    { name: 'content', type: 'localeBlock', title: 'Inhoud' },
    {
      name: 'group',
      type: 'reference',
      to: [{ type: 'veelgesteldeVragenGroups' }],
      title: 'Groep',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'group.group',
    },
    prepare: prepareLocalized,
  },
};
