import {
  getLastFilledValue,
  Metric,
  MetricKeys,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components/bar-scale';
import { useIntl } from '~/intl';
import { AllLanguages } from '~/locale';
import { assert } from '~/utils/assert';
import {
  DataScope,
  getMetricConfig,
  metricContainsPartialData,
} from '../../metric-config';
import { Box } from '../base';

interface SidebarBarScaleProps<T> {
  scope: DataScope;
  data: T;
  localeTextKey: keyof AllLanguages;
  metricName: MetricKeys<T>;
  metricProperty: string;
}

export function SidebarBarScale<T>({
  data,
  scope,
  metricName,
  metricProperty,
  localeTextKey,
}: SidebarBarScaleProps<T>) {
  const { siteText } = useIntl();

  const text = siteText[localeTextKey];
  /**
   * @TODO this is still a bit messy due to improper typing. Not sure how to
   * fix this easily. The getLastFilledValue function is now strongly typed on
   * a certain metric but here we don't have that type as input.
   */
  const lastValue = metricContainsPartialData(metricName as string)
    ? getLastFilledValue((data[metricName] as unknown) as Metric<unknown>)
    : get(data, [metricName as string, 'last_value']);
  const propertyValue = lastValue && lastValue[metricProperty];

  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  const uniqueId = [
    'sidebar-bar-scale',
    scope,
    metricName,
    metricProperty,
  ].join(':');

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

  const config = getMetricConfig(
    scope,
    (metricName as unknown) as string,
    metricProperty
  );

  assert(
    config.barScale,
    `Missing configuration for bar scale metric at ${[
      scope,
      metricName,
      metricProperty,
      'barScale',
    ]
      .filter(isDefined)
      .join(':')}`
  );

  assert(
    typeof text === 'object' &&
      'barscale_screenreader_text' in text &&
      text.barscale_screenreader_text,
    `Missing screen reader text at ${String(
      localeTextKey
    )}.barscale_screenreader_text`
  );

  /**
    @TODO refactor BarScale and remove these ugly css hacks which were part of
    the metric-wrapper class.
    */
  return (
    <Box height="3.5rem" mt="-1.25em">
      <BarScale
        min={config.barScale.min}
        max={config.barScale.max}
        signaalwaarde={config.barScale.signaalwaarde}
        screenReaderText={text.barscale_screenreader_text}
        value={propertyValue}
        id={uniqueId}
        gradient={config.barScale.gradient}
      />
    </Box>
  );
}
