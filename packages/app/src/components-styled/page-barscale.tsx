import {
  getLastFilledValue,
  Metric,
  MetricKeys,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components-styled/bar-scale';
import siteText, { Locale } from '~/locale/index';
import { assert } from '~/utils/assert';
import {
  DataScope,
  getMetricConfig,
  metricContainsPartialData,
} from '../metric-config';
import { Box } from './base';
import { DifferenceIndicator } from './difference-indicator';

/**
 * This component originated from SidebarBarScale, but is used on pages and
 * adds the ability to show the difference as well as things like signaalwaarde.
 *
 * I think we can come up with a better name, maybe later.
 */
interface PageBarScaleProps<T> {
  scope: DataScope;
  data: T;
  localeTextKey: keyof Locale;
  metricName: MetricKeys<T>;
  metricProperty: string;
  differenceKey?: string;
  differenceStaticTimespan?: string;
  differenceFractionDigits?: number;
}

export function PageBarScale<T>({
  data,
  scope,
  metricName,
  metricProperty,
  localeTextKey,
  differenceKey,
  differenceStaticTimespan,
  differenceFractionDigits,
}: PageBarScaleProps<T>) {
  const text = siteText[localeTextKey] as Record<string, string>;

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
  const uniqueId = ['page-bar-scale', scope, metricName, metricProperty].join(
    ':'
  );

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
    text.barscale_screenreader_text,
    `Missing screen reader text at ${localeTextKey}.barscale_screenreader_text`
  );

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

  return (
    <Box spacing={2} mb={3}>
      <BarScale
        min={config.barScale.min}
        max={config.barScale.max}
        signaalwaarde={config.barScale.signaalwaarde}
        screenReaderText={text.barscale_screenreader_text}
        value={propertyValue}
        id={uniqueId}
        gradient={config.barScale.gradient}
        showValue
        showAxis
      />
      {differenceKey && (
        <DifferenceIndicator
          value={differenceValue}
          isDecimal={config.isDecimal}
          staticTimespan={differenceStaticTimespan}
          differenceFractionDigits={differenceFractionDigits}
        />
      )}
    </Box>
  );
}
