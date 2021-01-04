import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScale } from '~/components/barScale';
import { MetricKeys } from '~/components/choropleth/shared';
import siteText, { TALLLanguages } from '~/locale/index';
import { assert } from '~/utils/assert';
import { DataScope, getMetricConfig } from '../../metric-config';
import { Box } from '../base';

interface SidebarBarScaleProps<T> {
  scope: DataScope;
  data: T;
  localeTextKey: keyof TALLLanguages;
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
    text.barscale_screenreader_text,
    `Missing screen reader text at ${localeTextKey}.barscale_screenreader_text`
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
