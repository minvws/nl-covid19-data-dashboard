import {
  KpiConfiguration,
  PartialKpiConfiguration,
} from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
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
      validation: (rule: Rule) =>
        rule.required().custom((x: any) => isValid(x)),
    },
  ],
  preview: {
    select: {
      title: 'title',
      kpi: 'kpi',
    },
    prepare({ title, kpi }: { title: string; kpi: any }) {
      try {
        const cf: KpiConfiguration = JSON.parse(kpi.config);
        return {
          title,
          subtitle: `${cf.code ?? cf.area}_${cf.metricName}_${
            cf.metricProperty
          }`,
        };
      } catch (e) {
        return {
          title: title?.length ? title : 'Untitled',
        };
      }
    },
  },
};

function isValid(kpi: any) {
  if (!isDefined(kpi.config)) {
    return {
      message: 'Chart config is undefined',
    };
  }
  try {
    const kpiConfig = JSON.parse(kpi.config) as PartialKpiConfiguration;
    if (!isDefined(kpiConfig)) {
      return {
        message: 'Chart config is undefined',
      };
    }

    const errors: string[] = [];
    if (!hasValue(kpiConfig.area)) {
      errors.push('Gebied is verplicht');
    }
    if (!hasValue(kpiConfig.metricName)) {
      errors.push('Metriek naam is verplicht');
    }
    if (!hasValue(kpiConfig.metricProperty)) {
      errors.push('Metriek waarde is verplicht');
    }
    if (!hasValue(kpiConfig.icon)) {
      errors.push('Icoon is verplicht');
    }
    if (!hasValue(kpiConfig.sourceKey)) {
      errors.push('Source key is verplicht');
    }

    if (
      ['gm', 'vr'].includes(kpiConfig.area ?? '') &&
      !isDefined(kpiConfig.code)
    ) {
      errors.push(
        `${
          kpiConfig.area === 'gm' ? 'Gemeente' : 'Veiligheidsregio'
        } is verplicht`
      );
    }
    if (!hasValue(kpiConfig.titleKey)) {
      errors.push('Title key is verplicht');
    }
    if (
      hasValue(kpiConfig.differenceKey) &&
      !isDefined(kpiConfig.isMovingAverageDifference)
    ) {
      errors.push(
        'isMovingAverageDifference is verplicht als er een difference key geselecteerd is'
      );
    }

    return errors.length ? errors.join(', ') : true;
  } catch (e) {
    return ['kpi.config has an invalid value'];
  }
}

function hasValue(value: string | undefined) {
  return value?.length ?? 0 > 0;
}
