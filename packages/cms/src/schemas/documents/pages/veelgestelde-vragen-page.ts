import { Rule } from '~/sanity';

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
      name: 'groupLeft',
      type: 'array',
      title: 'Groepen Links',
      validation: (Rule: Rule) => Rule.reset().required(),
      of: [{ type: 'reference', to: { type: 'veelgesteldeVragenGroups' } }],
    },
    {
      name: 'groupRight',
      type: 'array',
      title: 'Groepen Rechts',
      validation: (Rule: Rule) => Rule.reset().required(),
      of: [{ type: 'reference', to: { type: 'veelgesteldeVragenGroups' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
