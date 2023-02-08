import { colors } from '@corona-dashboard/common';
import { TrendDirection } from '~/components/trend-icon';

const trendIconGreen = colors.green3;
const trendIconRed = colors.red2;

/**
 * The array below contains the logic for determining which trend icon to show on a KPI tile on the homepage.
 * Note that the tables within the array only reference positive ranges. Negative KPI values and their
 * associated trend icon color and direction are handled in the getLookUpValue() function. Values which have no trend icon
 * i.e. -4.9 - 4.9 are ignored in this logic.
 */
export const trendIconLookUpTables = [
  {
    rangeStart: 5,
    rangeEnd: 14.9,
    trendIconIntensity: 1,
  },
  {
    rangeStart: 15,
    rangeEnd: 49.9,
    trendIconIntensity: 2,
  },
  {
    rangeStart: 50,
    rangeEnd: Number.POSITIVE_INFINITY,
    trendIconIntensity: 3,
  },
];

const isValueInRange = (value: number, rangeStart: number, rangeEnd: number): boolean => value >= rangeStart && value <= rangeEnd;

type GetLookUpValueReturn = {
  color: string;
  intensity: number;
  direction: TrendDirection;
};

/**
 * Given that the look up tables array does not have any table for negative KPI values, all negative values
 * are converted to positive integers, which are then used to retrieve the corresponding intensity level.
 * The color and the direction are determined using the original KPI value (positive or negative).
 */
export const getLookUpValue = (kpiValue: string | null): GetLookUpValueReturn | null => {
  if (!kpiValue) return null;

  const parsedKpiValue = parseFloat(kpiValue.replace(',', '.'));
  const isPositiveInteger = Math.sign(parsedKpiValue) === 1; // Math.sign() returns -1 for negative and 1 for positive integers.
  const absoluteKpiValue = isPositiveInteger ? parsedKpiValue : Math.abs(parsedKpiValue);
  const trendIconLookUpTable = trendIconLookUpTables.find(({ rangeStart, rangeEnd }) => isValueInRange(absoluteKpiValue, rangeStart, rangeEnd));

  if (!trendIconLookUpTable) return null;

  return {
    color: isPositiveInteger ? trendIconRed : trendIconGreen,
    intensity: trendIconLookUpTable.trendIconIntensity,
    direction: isPositiveInteger ? TrendDirection.UP : TrendDirection.DOWN,
  };
};
