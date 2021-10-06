import { Rule } from '~/sanity';

export const chartConfiguration = {
  title: 'Grafiek configuratie',
  name: 'chartConfiguration',
  type: 'document',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Configuratie',
      name: 'chart',
      type: 'chart',
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: string }) {
      return {
        title,
      };
    },
  },
};
