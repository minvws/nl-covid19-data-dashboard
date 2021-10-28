<<<<<<< HEAD
import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import hash from 'hash-sum';
import { isDefined } from 'ts-is-present';
<<<<<<<< HEAD:packages/app/src/components/page-kpi.tsx
=======
import {
  getLastFilledValue,
  Metric,
  MetricKeys,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
>>>>>>> develop
import { KpiValue } from '~/components/kpi-value';
import { assert } from '~/utils/assert';
import { Box } from './base';
import { TileAverageDifference, TileDifference } from './difference-indicator';

<<<<<<< HEAD
interface PageKpieBaseProps<T> {
=======
interface PageKpiBaseProps<T> {
>>>>>>> develop
  data: T;
  metricName: MetricKeys<T>;
  metricProperty: string;
  differenceFractionDigits?: number;
  currentValue?: number;
<<<<<<< HEAD
========
import { BarScale } from '~/components/bar-scale';
import { BarScaleConfig } from '~/metric-config/common';
import { Box } from './base';
import { TileAverageDifference, TileDifference } from './difference-indicator';

interface PageBarScaleBaseProps {
  value: number;
  config: BarScaleConfig;
  screenReaderText: string;
>>>>>>>> develop:packages/app/src/components/page-barscale.tsx
=======
>>>>>>> develop
  isMovingAverageDifference?: boolean;
  showOldDateUnix?: boolean;
}

type DifferenceProps =
  | {
<<<<<<< HEAD
      difference?: never;
      isAmount?: boolean;
    }
  | {
      difference: DifferenceInteger | DifferenceDecimal;
      isAmount: boolean;
    };

<<<<<<<< HEAD:packages/app/src/components/page-kpi.tsx
type PageKpiProps<T> = PageKpieBaseProps<T> & DifferenceProps;

const metricNamesHoldingPartialData = ['infectious_people', 'reproduction'];
=======
      differenceKey?: never;
      isAmount?: boolean;
    }
  | {
      differenceKey: string;
      isAmount: boolean;
    };

type PageKpiProps<T> = PageKpiBaseProps<T> & DifferenceProps;

export const metricNamesHoldingPartialData = [
  'infectious_people',
  'reproduction',
];
>>>>>>> develop

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
  const lastValue = metricNamesHoldingPartialData.includes(metricName as string)
    ? getLastFilledValue(data[metricName] as unknown as Metric<unknown>)
    : get(data, [metricName as string, 'last_value']);

  const propertyValue = lastValue[metricProperty];

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

<<<<<<< HEAD
  return (
    <Box spacing={0} mb={3}>
      <KpiValue absolute={propertyValue} />
========
type PageBarScaleProps = PageBarScaleBaseProps & DifferenceProps;

export function PageBarScale(props: PageBarScaleProps) {
  const {
    value,
    config,
    screenReaderText,
    difference,
    isMovingAverageDifference,
    showOldDateUnix,
    isAmount,
  } = props;
  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  const uniqueId = hash(props);

  return (
    <Box spacing={2} mb={3}>
      <BarScale
        min={config.min}
        max={config.max}
        limit={config.limit}
        screenReaderText={screenReaderText}
        value={value}
        id={uniqueId}
        gradient={config.gradient}
        showValue
        showAxis
      />
>>>>>>>> develop:packages/app/src/components/page-barscale.tsx

      {isDefined(difference) &&
        isDefined(isAmount) &&
        (isMovingAverageDifference ? (
          <TileAverageDifference value={difference} isAmount={isAmount} />
        ) : (
          <TileDifference
            value={difference}
            showOldDateUnix={showOldDateUnix}
            isAmount={isAmount}
          />
        ))}
=======
  const hasDifference = isDefined(differenceKey) || isDefined(differenceValue);

  return (
    <Box spacing={0} mb={hasDifference ? 3 : 0}>
      <KpiValue absolute={propertyValue} />

      {isDefined(differenceKey) &&
        isDefined(isAmount) &&
        (isMovingAverageDifference ? (
          <Box pt={2}>
            <TileAverageDifference
              value={differenceValue}
              isAmount={isAmount}
              maximumFractionDigits={differenceFractionDigits}
            />
          </Box>
        ) : isDefined(differenceValue) ? (
          <Box pt={2}>
            <TileDifference
              value={differenceValue}
              maximumFractionDigits={differenceFractionDigits}
              showOldDateUnix={showOldDateUnix}
              isAmount={isAmount}
            />
          </Box>
        ) : null)}
>>>>>>> develop
    </Box>
  );
}
