import {
  DifferenceKey,
  getLastFilledValue,
  Metric,
  MetricKeys,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import {
  DataScope,
  getMetricConfig,
  metricContainsPartialData,
} from '~/metric-config';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SidebarBarScale } from './sidebar-barscale';
import { SidebarKpiValue } from './sidebar-kpi-value';

interface SidebarMetricProps<T extends { difference: unknown }> {
  scope: DataScope;
  data: T;
  metricName: MetricKeys<T>;
  /**
   * Make metric property optional for odd case where we do not show a metric.
   * Currently only behavior is doing that.
   */
  metricProperty?: string;
  localeTextKey: keyof SiteText;
  differenceKey?: DifferenceKey;
  showBarScale?: boolean;
  annotationKey?: string;
  showDateOfInsertion?: boolean;

  /**
   * Sometimes the barscale is not showing the same metric. Also since data
   * is not properly unified yet, the bar scale can point to both a different
   * metric name and metric property.
   */
  altBarScaleMetric?: {
    metricName: MetricKeys<T>;
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
  showDateOfInsertion,
}: SidebarMetricProps<T>) {
  const { siteText, formatDateFromSeconds } = useIntl();

  /**
   * @TODO this is still a bit messy due to improper typing. Not sure how to
   * fix this easily. The getLastFilledValue function is now strongly typed on
   * a certain metric but here we don't have that type as input.
   */
  const lastValue = metricContainsPartialData(metricName as string)
    ? getLastFilledValue(data[metricName] as unknown as Metric<unknown>)
    : get(data, [metricName as string, 'last_value']);

  const propertyValue = metricProperty && lastValue?.[metricProperty];

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
  const text = siteText[localeTextKey];
  const title =
    (typeof text === 'object' && 'kpi_titel' in text && text.kpi_titel) ||
    (typeof text === 'object' && 'titel_kpi' in text && text.titel_kpi);

  assert(
    title,
    `Sidebar metric expects a title at ${String(
      localeTextKey
    )}.kpi_titel or ${String(localeTextKey)}.titel_kpi`
  );

  const config = getMetricConfig(
    scope,
    metricName as unknown as string,
    metricProperty
  );

  let description = '';

  try {
    if (showDateOfInsertion) {
      description = replaceVariablesInText(commonText.dateOfInsertion, {
        dateOfInsertion: formatDateFromSeconds(
          lastValue.date_of_insertion_unix,
          'medium'
        ),
      });
    } else {
      description =
        'date_unix' in lastValue
          ? replaceVariablesInText(commonText.dateOfReport, {
              dateOfReport: formatDateFromSeconds(
                lastValue.date_unix,
                'medium'
              ),
            })
          : replaceVariablesInText(commonText.dateRangeOfReport, {
              startDate: formatDateFromSeconds(
                lastValue.date_start_unix,
                'axis'
              ),
              endDate: formatDateFromSeconds(lastValue.date_end_unix, 'axis'),
            });
    }
  } catch (err) {
    throw new Error(
      `Failed to format description for ${metricName}:${metricProperty}, likely due to a timestamp week/day configuration mismatch. Error: ${err.message}`
    );
  }

  const differenceValue = differenceKey
    ? get(data, ['difference', differenceKey as unknown as string])
    : undefined;

  if (differenceKey) {
    /**
     * If you pass in a difference key, it should exist
     */
    assert(
      isDefined(differenceValue),
      `Missing value for difference:${String(differenceKey)}`
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
    return <SidebarKpiValue title={title} description={description} />;
  }

  return (
    <Box>
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
