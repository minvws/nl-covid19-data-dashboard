import { HIGHLIGHTED_ARTICLES } from '../../fields/highlighted-articles';

export const vaccinationsPage = {
  title: 'Vaccinaties pagina',
  name: 'vaccinationsPage',
  type: 'document',
  fieldsets: [{ title: 'Mijlpalen', name: 'milestones' }],
  fields: [
    {
      title: 'Pagina informatie',
      name: 'pageInfo',
      type: 'titleDescriptionBlock',
    },
    {
      title: 'Linkblok titel',
      name: 'linksTitle',
      type: 'localeString',
      description: "De titel boven het blok met 'Ook interessant' links",
    },
    {
      title: "'Ook interessant' links",
      description:
        'Maximaal 4 links naar interessante onderwerpen. Alleen de bovenste link wordt volledig getoond (inclusief plaatje en categorie), van de rest alleen de titel.',
      name: 'pageLinks',
      type: 'array',
      of: [{ type: 'decoratedLink' }],
      validation: (Rule: any) => Rule.required().min(1).max(4),
    },
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
      validation: (Rule: any) => Rule.max(3),
    },
    HIGHLIGHTED_ARTICLES,
  ],
};
