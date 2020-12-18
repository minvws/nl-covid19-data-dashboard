import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components/barScale';
import { MetricKeys } from '~/components/choropleth/shared';
import siteText, { TALLLanguages } from '~/locale/index';
import { assert } from '~/utils/assert';
import { DataScope, getMetricConfig } from '../metric-config';
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
  localeTextKey: keyof TALLLanguages;
  metricName: ValueOf<MetricKeys<T>>;
  metricProperty: string;
  differenceKey?: string;
}

export function PageBarScale<T>({
  data,
  scope,
  metricName,
  metricProperty,
  localeTextKey,
  differenceKey,
}: PageBarScaleProps<T>) {
  const text = siteText[localeTextKey] as Record<string, string>;
  const lastValue = get(data, [
    (metricName as unknown) as string,
    'last_value',
  ]);
  const propertyValue = lastValue && lastValue[metricProperty];

  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  const uniqueId = ['sidebar', scope, metricName, metricProperty].join(':');

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
    <Box spacing={2}>
      <BarScale
        min={config.barScale.min}
        max={config.barScale.max}
        signaalwaarde={config.barScale.signaalwaarde}
        screenReaderText={text.barscale_screenreader_text}
        value={propertyValue}
        id={uniqueId}
        rangeKey={config.barScale.rangesKey}
        gradient={config.barScale.gradient}
        showValue={true}
        showAxis={true}
      />
      {differenceKey && (
        <DifferenceIndicator
          value={differenceValue}
          isDecimal={config.isDecimal}
        />
      )}
    </Box>
  );
}
