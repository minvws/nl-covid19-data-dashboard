import {
  ChartConfiguration,
  PartialChartConfiguration,
} from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
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
      validation: (rule: Rule) =>
        rule.required().custom((x: any) => isValid(x)),
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

function isValid(chart: any) {
  if (!isDefined(chart.config)) {
    return {
      message: 'Chart config is undefined',
    };
  }
  const chartConfig = JSON.parse(chart.config) as PartialChartConfiguration;
  if (!isDefined(chartConfig)) {
    return {
      message: 'Chart config is undefined',
    };
  }

  const errors: string[] = [];

  if (!hasValue(chartConfig.accessibilityKey)) {
    errors.push('Accessibility Key is verplicht');
  }
  if (!hasValue(chartConfig.sourceKey)) {
    errors.push('Source key is verplicht');
  }
  if (!hasValue(chartConfig.area)) {
    errors.push('Gebied is verplicht');
  }
  if (!hasValue(chartConfig.metricName)) {
    errors.push('Metriek naam is verplicht');
  }
  if (
    ['gm', 'vr'].includes(chartConfig.area ?? '') &&
    !isDefined(chartConfig.code)
  ) {
    errors.push(
      `${
        chartConfig.area === 'gm' ? 'Gemeente' : 'Veiligheidsregio'
      } is verplicht`
    );
  }

  if (!hasValue(chartConfig.timeframe)) {
    errors.push('Timeframe (Toon alles/Toon laatste 5 weken) is verplicht');
  }
  if ((chartConfig.metricPropertyConfigs?.length ?? 0) === 0) {
    errors.push('Er moet minstens 1 metriek property geselecteerd zijn');
  }
  if (
    !chartConfig.metricPropertyConfigs?.every((x) => x.labelKey?.length > 0)
  ) {
    errors.push('Iedere metriek property heeft een geldige label key nodig');
  }

  return errors.length ? errors.join(', ') : true;
}

function hasValue(value: string | undefined) {
  return value?.length ?? 0 > 0;
}
