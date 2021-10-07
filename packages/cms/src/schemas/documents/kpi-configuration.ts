import { KpiConfiguration } from '@corona-dashboard/common';
import { Rule } from '~/sanity';

export const kpiConfiguration = {
  title: 'KPI configuratie',
  name: 'kpiConfiguration',
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
      name: 'kpi',
      type: 'dashboardKpi',
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      kpi: 'kpi',
    },
    prepare({ title, kpi }: { title: string; kpi: any }) {
      const cf: KpiConfiguration = JSON.parse(kpi.config);
      return {
        title,
        subtitle: `${cf.code ?? cf.area}_${cf.metricName}_${cf.metricProperty}`,
      };
    },
  },
};
