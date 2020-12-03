/**
 * This configuration declares properties about data to be used by various
 * display components to know what how the data should be rendered.
 *
 * By having a global declaration like this, we can keep an overview and prevent
 * a lot of the specialized components we now use to render everything.
 *
 * @TODO move this to a top-level location
 */

type DataConfig = {
  isPercentage?: boolean;
  isWeeklyData?: boolean;
  barScale: BarScaleConfig;
};

type BarScaleConfig = {
  min: number;
  max: number;
  signaalwaarde: number;
  gradient: { color: string; value: number }[];
};

/**
 * The data is scoped at nl/vr/gm, because we can not assume that the same
 * things like min/max/gradients apply everywhere for the same KPI.
 */
type Scope = 'nl' | 'vr' | 'gm';

const dataConfig: Record<Scope, Record<string, Record<string, DataConfig>>> = {
  nl: {
    intake_hospital_ma: {
      moving_average_hospital: {
        barScale: {
          min: 0,
          max: 100,
          signaalwaarde: 40,
          gradient: [
            {
              color: '#69c253',
              value: 0,
            },
            {
              color: '#D3A500',
              value: 40,
            },
            {
              color: '#f35065',
              value: 90,
            },
          ],
        },
      },
    },
  },
  vr: {},
  gm: {},
};

import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';

export function getDataConfig(metricName: string, metricProperty: string) {
  const config = get(dataConfig, [metricName, metricProperty]);

  assert(
    config,
    `Missing configuration for bar scale metric ${[metricName, metricProperty]
      .filter(isDefined)
      .join(':')}`
  );

  return config as DataConfig;
}
