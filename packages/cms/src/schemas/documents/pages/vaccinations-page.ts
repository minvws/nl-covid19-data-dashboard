import { HIGHLIGHTED_ARTICLES } from '../fields/highlighted-articles';

export default {
  title: 'Vaccinaties pagina',
  name: 'vaccinationsPage',
  type: 'document',
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
      name: 'milestones',
      type: 'array',
      title: 'Mijlpalen',
      description:
        'Je kan hier mijlpalen toevoegen, de laatste zal uitgelicht worden',
      of: [{ type: 'milestone', direction: 'asc' }],
      options: {
        sortable: false
      }
    },
    {
      name: 'expected',
      type: 'array',
      title: 'Verwacht',
      description:
        'Je kan hier mijlpalen toevoegen, de laatste zal uitgelicht worden',
      of: [{ type: 'localeString' }],
    },
    HIGHLIGHTED_ARTICLES,
  ]
};
