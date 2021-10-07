import { ChartConfiguration } from '@corona-dashboard/common';
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
      chart: 'chart',
    },
    prepare({ title, chart }: { title: string; chart: any }) {
      const cf: ChartConfiguration = JSON.parse(chart.config);
      return {
        title,
        subtitle: `${cf.code ?? cf.area}_${cf.metricName}_${cf.timeframe}`,
      };
    },
  },
};
