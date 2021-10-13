import { ChartConfiguration } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { ChartConfigurationInput } from '../../components';

export const Chart = {
  title: 'Dashboard Grafiek',
  name: 'chart',
  type: 'object',
  fields: [
    {
      name: 'config',
      type: 'string',
      title: 'Configuratie',
      inputComponent: ChartConfigurationInput,
    },
  ],
  preview: {
    select: {
      config: 'config',
    },
    prepare({ config }: { config: string }) {
      if (isDefined(config)) {
        const cf: ChartConfiguration = JSON.parse(config);
        return {
          title: `${cf.code ?? cf.area}_${cf.metricName}_${cf.timeframe}`,
          subtitle: cf.metricPropertyConfigs
            .map((x) => x.propertyName)
            .join(', '),
        };
      }
      return {
        title: 'Undefined',
      };
    },
  },
};
