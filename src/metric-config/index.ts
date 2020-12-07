import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';
import { nl } from './nl';
import { vr } from './vr';
import { gm } from './gm';
import { BarScaleConfig, MetricConfig } from './types';

/**
 * This configuration declares properties about data to be used by various
 * display components to know how the data should be rendered.
 *
 * By having a global declaration like this, we can keep an overview and prevent
 * a lot of the specialized components we now use to render everything.
 *
 * @TODO move this to a top-level location
 */

/**
 * The data is scoped at nl/vr/gm, because we can not assume that the same
 * things like min/max/gradients apply everywhere for the same KPI.
 */
export type DataScope = 'nl' | 'vr' | 'gm';

const metricConfig: Record<
  DataScope,
  Record<string, Record<string, MetricConfig>>
> = {
  nl,
  vr,
  gm,
};

export function getDataConfig(
  scope: DataScope,
  metricName: string,
  metricProperty: string
) {
  /**
   * Fall back to an empty object so we don't have to specify empty objects in
   * the config file for properties that do not need a config.
   */
  const config = get(metricConfig, [scope, metricName, metricProperty], {});

  return config as MetricConfig;
}

/**
 * Because it is very common to want to get to the bar scale config, and also we
 * want to enforce the configuration is available, this specific function
 * grabs that config with an assertion.
 */
export function getDataBarScaleConfig(
  scope: DataScope,
  metricName: string,
  metricProperty: string
) {
  const config = get(metricConfig, [scope, metricName, metricProperty]);

  /**
   * @TODO The bar scale config should exist, but if it is common that the vr/gm
   * scales are the same as nl, then we can do a fallback here when the
   * configuration can't be found. Not sure yet if that is a good idea of asking
   * for trouble.
   */
  assert(
    config && config.barScale,
    `Missing configuration for bar scale metric at ${[
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
