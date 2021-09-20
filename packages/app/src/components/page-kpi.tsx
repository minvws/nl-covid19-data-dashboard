import { MetricKeys } from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { KpiValue } from '~/components/kpi-value';
import { assert } from '~/utils/assert';
import { Box } from './base';
import { TileAverageDifference, TileDifference } from './difference-indicator';
/**
 * This component originated from SidebarBarScale, but is used on pages and
 * adds the ability to show the difference as well as things like signaalwaarde.
 *
 * I think we can come up with a better name, maybe later.
 */
interface PageKpieBaseProps<T> {
  data: T;
  metricName: MetricKeys<T>;
  metricProperty: string;
  differenceFractionDigits?: number;
  currentValue?: number;
  isMovingAverageDifference?: boolean;
  showOldDateUnix?: boolean;
}

type DifferenceProps =
  | {
      differenceKey?: never;
      isAmount?: boolean;
    }
  | {
      differenceKey: string;
      isAmount: boolean;
    };

type PageKpiProps<T> = PageKpieBaseProps<T> & DifferenceProps;

export function PageKpi<T>({
  data,
  metricName,
  metricProperty,
  differenceKey,
  differenceFractionDigits,
  isMovingAverageDifference,
  showOldDateUnix,
  isAmount,
}: PageKpiProps<T>) {
  /**
   * @TODO this is still a bit messy due to improper typing. Not sure how to
   * fix this easily. The getLastFilledValue function is now strongly typed on
   * a certain metric but here we don't have that type as input.
   */
  const lastValue = get(data, [metricName as string, 'last_value']);

  const propertyValue = lastValue && lastValue[metricProperty];

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

  const differenceValue = differenceKey
    ? get(data, ['difference', differenceKey as unknown as string])
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
    <Box spacing={0} mb={3}>
      <KpiValue absolute={propertyValue} />

      {isDefined(differenceKey) &&
        isDefined(isAmount) &&
        (isMovingAverageDifference ? (
          <TileAverageDifference
            value={differenceValue}
            isAmount={isAmount}
            maximumFractionDigits={differenceFractionDigits}
          />
        ) : (
          <TileDifference
            value={differenceValue}
            maximumFractionDigits={differenceFractionDigits}
            showOldDateUnix={showOldDateUnix}
            isAmount={isAmount}
          />
        ))}
    </Box>
  );
}
