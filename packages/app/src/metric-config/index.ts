import { assert } from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { BarScaleConfig } from './common';
import { nl } from './nl';

/**
 * This configuration declares properties about data to be used by various
 * display components to know how the data should be rendered.
 *
 * By having a global declaration like this, we can keep an overview and prevent
 * a lot of the specialized components we now use to render everything.
 */

/**
 * The data is scoped at nl/vr/gm, because we can not assume that the same
 * things like min/max/gradients apply everywhere for the same KPI.
 */
const metricConfig = {
  nl,
} as const;

type DataScope = keyof typeof metricConfig;

type MetricName = keyof typeof metricConfig[DataScope];

type KeysOfUnion<T> = T extends T ? keyof T : never;

/**
 * Special bar scale getter, so the assert is centralized.
 * Ideally typescript can check the structure of the config on compile, which
 * would make the assert unnecessary & provide nice autocompletion. However,
 * there seems to be no way of enforcing the structure of the config and
 * strictly typing it to the actual supplied config at the same time.
 */
export function getBarScaleConfig<S extends DataScope, K extends MetricName>(
  scope: S,
  metricName: K,
  metricProperty?: KeysOfUnion<typeof metricConfig[S][K]>
) {
  const config = get(
    metricConfig,
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
