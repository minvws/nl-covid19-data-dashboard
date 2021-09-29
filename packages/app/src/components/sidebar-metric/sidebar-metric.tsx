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
import { assert } from '~/utils/assert';
import { SidebarKpiValue } from './sidebar-kpi-value';
interface SidebarMetricProps<T extends { difference: unknown }> {
  data: T;
  metricName: MetricKeys<T>;
  /**
   * Make metric property optional for odd case where we do not show a metric.
   * Currently only behavior is doing that.
   */
  metricProperty?: string;
  localeTextKey: keyof SiteText;
  differenceKey?: DifferenceKey;
  annotationKey?: string;
  showDateOfInsertion?: boolean;
  hideDate?: boolean;
}

const metricNamesHoldingPartialData = ['infectious_people', 'reproduction'];

export function SidebarMetric<T extends { difference: unknown }>({
  data,
  metricName,
  metricProperty,
  localeTextKey,
  differenceKey,
  annotationKey,
}: SidebarMetricProps<T>) {
  const { siteText } = useIntl();

  /**
   * @TODO this is still a bit messy due to improper typing. Not sure how to
   * fix this easily. The getLastFilledValue function is now strongly typed on
   * a certain metric but here we don't have that type as input.
   */
  const lastValue = metricNamesHoldingPartialData.includes(metricName as string)
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
    return <SidebarKpiValue title={title} />;
  }

  return (
    <Box>
      <SidebarKpiValue
        title={title}
        value={propertyValue}
        difference={differenceValue}
        valueAnnotation={valueAnnotation}
      />
    </Box>
  );
}
