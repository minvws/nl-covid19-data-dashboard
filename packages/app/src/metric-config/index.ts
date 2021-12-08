import {
  assert,
  DataScopeKey,
  MetricKeys,
  MetricProperty,
  ScopedData,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScaleConfig, ScopedMetricConfigs } from './common';
import { nl } from './nl';

/**
 * This configuration declares properties about data to be used by various
 * display components to know how the data should be rendered. This way
 * components can stay clean since the logic for determining different render
 * strategies per metric stays out of the component and is centralized here.
 *
 * The metric configs follow the exact same structure as the data itself to make
 * it easy to find the configs for a certain metric.
 */
type MetricConfigs = {
  [key in DataScopeKey]?: ScopedMetricConfigs<ScopedData[key]>;
};

/**
 * The data is scoped at in/nl/vr/gm, because we can not assume that the same
 * things like min/max/gradients apply everywhere for the same KPI.
 */
export const metricConfigs: MetricConfigs = {
  nl,
};

/**
 * Special bar scale getter, so the assert is centralized.
 * Ideally typescript can check the structure of the config on compile, which
 * would make the assert unnecessary & provide nice autocompletion. However,
 * there seems to be no way of enforcing the structure of the config and
 * strictly typing it to the actual supplied config at the same time.
 */
export function getBarScaleConfig<
  S extends DataScopeKey,
  K extends MetricKeys<ScopedData[S]>
>(scope: S, metricName: K, metricProperty?: MetricProperty<ScopedData[S], K>) {
  const config = get(
    metricConfigs,
    metricProperty ? [scope, metricName, metricProperty] : [scope, metricName]
  );

  assert(
    config.barScale,
    `Missing metric configuration at ${[
      scope,
      metricName,
      metricProperty,
      'barScale',
    ]
      .filter(isDefined)
      .join(':')}`
  );

  return config.barScale as BarScaleConfig;
}
