import { Rule } from '~/sanity';
import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';
import { PAGE_LINKS } from '../../fields/page-links';

export const vaccinationsPage = {
  title: 'Vaccinaties pagina',
  name: 'vaccinationsPage',
  type: 'document',
  fieldsets: [{ title: 'Mijlpalen', name: 'milestones' }],
  fields: [
    {
      title: 'Pagina informatie',
      name: 'pageDescription',
      type: 'localeBlock',
    },
    PAGE_LINKS,
    {
      fieldset: 'milestones',
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      fieldset: 'milestones',
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      fieldset: 'milestones',
      name: 'milestones',
      type: 'array',
      title: 'Mijlpalen',
      description:
        'Je kan hier mijlpalen toevoegen, de laatste zal uitgelicht worden. Ze worden op het dashboard op datum geordend van oud naar nieuw.',
      of: [{ type: 'milestone', direction: 'asc' }],
      options: {
        sortable: false,
      },
    },
    {
      fieldset: 'milestones',
      name: 'expected',
      type: 'array',
      title: 'Verwacht',
      description: 'Verwachte mijlpalen',
      of: [{ type: 'localeString' }],
      validation: (rule: Rule) => rule.max(3),
    },
    HIGHLIGHTED_ARTICLES,
  ],
};
