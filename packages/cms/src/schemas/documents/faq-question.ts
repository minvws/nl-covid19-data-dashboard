import { Rule } from '~/sanity';
import { localeStringValidation, localeValidation } from '../../language/locale-validation';
import { selectedLanguages$ } from '../../plugins/translate/datastore';
import { prepareLocalized } from '../../plugins/translate/prepare-localized';

let selectedLanguage = 'nl';
selectedLanguages$.subscribe((selected: any[]) => {
  selectedLanguage = selected.length ? selected[0] : 'nl';
});

export const faqQuestion = {
  title: 'Veelgestelde vraag',
  name: 'faqQuestion',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'group',
      type: 'reference',
      to: [{ type: 'veelgesteldeVragenGroups' }],
      title: 'Groep',
      validation: (Rule: Rule) => Rule.reset().required(),
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
