import { KpiConfiguration } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { KpiConfigurationInput } from '../../components';

export const Kpi = {
  title: 'Dashboard KPI',
  name: 'dashboardKpi',
  type: 'object',
  fields: [
    {
      name: 'config',
      type: 'string',
      title: 'Configuratie',
      inputComponent: KpiConfigurationInput,
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      config: 'config',
    },
    prepare({ config }: { config: string }) {
      if (isDefined(config)) {
        const cf: KpiConfiguration = JSON.parse(config);
        return {
          title: `${cf.area}_${cf.metricName}`,
          subtitle: cf.metricProperty,
        };
      }
      return {
        title: 'Undefined',
      };
    },
  },
};
