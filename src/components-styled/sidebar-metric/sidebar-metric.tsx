import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { MetricKeys } from '~/components/choropleth/shared';
import siteText, { TALLLanguages } from '~/locale/index';
import { DataScope, getMetricConfig } from '~/metric-config';
import { assert } from '~/utils/assert';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SidebarBarScale } from './sidebar-barscale';
import { SidebarKpiValue } from './sidebar-kpi-value';

interface SidebarMetricProps<T extends { difference: unknown }> {
  scope: DataScope;
  data: T;
  metricName: ValueOf<MetricKeys<T>>;
  /**
   * Make metric property optional for odd case where we do not show a metric.
   * Currently only behavior is doing that.
   */
  metricProperty?: string;
  localeTextKey: keyof TALLLanguages;
  differenceKey?: string;
  showBarScale?: boolean;
  annotationKey?: string;

  /**
   * Sometimes the barscale is not showing the same metric. Also since data
   * is not properly unified yet, the bar scale can point to both a different
   * metric name and metric property.
   */
  altBarScaleMetric?: {
    metricName: ValueOf<MetricKeys<T>>;
    metricProperty: string;
  };
}

export function SidebarMetric<T extends { difference: unknown }>({
  scope,
  data,
  metricName,
  metricProperty,
  localeTextKey,
  differenceKey,
  showBarScale,
  annotationKey,
  altBarScaleMetric,
}: SidebarMetricProps<T>) {
  const lastValue = get(data, [
    (metricName as unknown) as string,
    'last_value',
  ]);
  const propertyValue =
    metricProperty && lastValue && lastValue[metricProperty];

  if (metricProperty) {
    assert(
      isDefined(propertyValue),
      `Missing value for metric property ${[
        metricName,
        'last_value',
        metricProperty,
      ]
        .filter(isDefined)
        .join(':')}`
    );
  }

  const commonText = siteText.common.metricKPI;

  /**
   * Because the locale files are not consistent in using kpi_titel and titel_kpi
   * we support both but kpi_titel has precedence.
   *
   * @TODO this should really be called sidebar_metric_description or something
   * as it's not a title at all.
   */
  const title =
    get(siteText, [localeTextKey, 'kpi_titel']) ||
    get(siteText, [localeTextKey, 'titel_kpi']);

  assert(title, `Missing title at ${localeTextKey}.kpi_titel`);

  const config = getMetricConfig(
    scope,
    (metricName as unknown) as string,
    metricProperty
  );

  let description = '';

  try {
    description = config.isWeeklyData
      ? replaceVariablesInText(commonText.dateRangeOfReport, {
          startDate: formatDateFromSeconds(lastValue.week_start_unix, 'axis'),
          endDate: formatDateFromSeconds(lastValue.week_end_unix, 'axis'),
        })
      : replaceVariablesInText(commonText.dateOfReport, {
          dateOfReport: formatDateFromSeconds(
            lastValue.date_of_report_unix,
            'medium'
          ),
        });
  } catch (err) {
    throw new Error(
      `Failed to format description for ${metricName}:${metricProperty}, likely due to a timestamp week/day configuration mismatch. Error: ${err.message}`
    );
  }

  const differenceValue = differenceKey
    ? get(data, ['difference', (differenceKey as unknown) as string])
    : undefined;

  if (differenceKey) {
    /**
     * If you pass in a difference key, it should exist
     */
    assert(
      isDefined(differenceValue),
      `Missing value for difference:${differenceKey}`
    );
  }

  const valueAnnotation = annotationKey
    ? get(siteText, ['waarde_annotaties', annotationKey])
    : undefined;

  if (annotationKey) {
    /**
     * If you pass in an annotation key, it should exist
     */
    assert(
      valueAnnotation,
      `Missing value annotation at waarde_annotaties:${annotationKey}`
    );
  }

  if (!metricProperty) {
    return (
      <Box mx={'2.5rem'}>
        <SidebarKpiValue title={title} description={description} />
      </Box>
    );
  }

  return (
    <Box spacing={1} mx={'2.5rem'}>
      <SidebarKpiValue
        title={title}
        value={propertyValue}
        isPercentage={config.isPercentage}
        description={description}
        difference={differenceValue}
        valueAnnotation={valueAnnotation}
      />
      {showBarScale && (
        <SidebarBarScale
          data={data}
          scope={scope}
          localeTextKey={localeTextKey}
          metricName={
            altBarScaleMetric ? altBarScaleMetric.metricName : metricName
          }
          metricProperty={
            altBarScaleMetric
              ? altBarScaleMetric.metricProperty
              : metricProperty
          }
        />
      )}
    </Box>
  );
}
