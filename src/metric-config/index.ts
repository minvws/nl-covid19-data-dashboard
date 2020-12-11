import { get } from 'lodash';
import { gm } from './gm';
import { nl } from './nl';
import { MetricConfig, NO_METRIC_PROPERTY } from './common';
import { vr } from './vr';

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
export type DataScope = 'nl' | 'vr' | 'gm';

const metricConfig = {
  nl,
  vr,
  gm,
} as const;

export function getMetricConfig(
  scope: DataScope,
  metricName: string,
  metricProperty = NO_METRIC_PROPERTY
) {
  /**
   * Fall back to an empty object so we don't have to specify empty objects in
   * the config file for properties that do not need a config. Since all
   * root-level properties in the MetricConfig are optional, an empty object is
   * still a valid configuration.
   */
  const config = get(metricConfig, [scope, metricName, metricProperty], {});

  return config as MetricConfig;
}
