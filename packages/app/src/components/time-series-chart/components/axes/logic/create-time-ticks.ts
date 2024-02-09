import { Breakpoints } from '~/utils/use-breakpoints';
import {
  extractYearFromDate,
  formatStyle,
  getFirstDayOfGivenYear,
  middleOfDayInSeconds,
  startOfDayInSeconds,
  extractMonthFromDate,
  extractDayFromDate,
  addMonthToDate,
} from '@corona-dashboard/common';

export interface TickInstance {
  timestamp: number;
  formatStyle: formatStyle;
}

export function getPrefferedTimeTicksAllTimeFrame(startUnix: number, endUnix: number): number {
  /**
   * For the All timeframe we are interested in the amount of January 1st dates inbetween
   * startUnix and endUnix (e.g 07.09.2020 - 31.01.2024 will results in 4 ticks).
   *
   * The way it works is that we first check if the startDate is equal to January 1st.
   * If so, the count will get +1 at the end since the start year is not included when
   * making the difference between the endYear and startYear
   *
   * This function is used in the Axes component where the bottomAxesTickNumber value
   * is being generated.
   */
  const firstYearFirstOfJanuary = extractMonthFromDate(startUnix) == 0 && extractDayFromDate(startUnix) == 1;

  const count = extractYearFromDate(endUnix) - extractYearFromDate(startUnix);

  return firstYearFirstOfJanuary ? count + 1 : count;
}

function getDefault2ValuesForXAxis(startTick: number, endTick: number): TickInstance[] {
  return [
    { timestamp: startTick, formatStyle: 'axis-with-day-month-year-short' },
    { timestamp: endTick, formatStyle: 'axis-with-day-month-year-short' },
  ] as TickInstance[];
}

export function createTimeTicksAllTimeFrame(startTick: number, endTick: number, ticksNumber: number, breakpoints: Breakpoints): TickInstance[] {
  /**
   * This method is only used for the `all` timeframe option.
   */
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);
  const startYear = extractYearFromDate(start);

  if (ticksNumber <= 2) {
    return getDefault2ValuesForXAxis(start, end);
  }

  const ticks: TickInstance[] = Array.from({ length: ticksNumber }, (_, index = 1) => {
    const firstDayOfYearTimeStamp = getFirstDayOfGivenYear(startYear + index + 1); // 01.01.2021, 01.01.2022... etc.
    return { timestamp: startOfDayInSeconds(firstDayOfYearTimeStamp), formatStyle: 'axis-with-day-month-year-short' } as TickInstance;
  });

  // This if statement ensures that first & second label of the all-values timeframe don't overlap
  if (breakpoints.lg && Math.floor((ticks[0].timestamp - startTick) / 86400) > 180) {
    ticks.unshift({ timestamp: start, formatStyle: 'axis-with-month-year-short' } as TickInstance);
  }

  return ticks;
}

export function createTimeTicksMonthlyTimeFrame(startTick: number, endTick: number, count: number): TickInstance[] {
  /**
   * This method will calculate the timestamps for the 3 months interval. It must consist of exactly 4 values.
   * First value:  01 (XX - 3) 'YY
   * Second value: 01 (XX - 2) 'YY
   * Third value:  01 (XX - 1) 'YY
   * Fourth value: 01 XX 'YY     - Where XX is the current month
   */
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);

  if (count <= 2) {
    return getDefault2ValuesForXAxis(start, end);
  }

  const ticks: TickInstance[] = [];

  for (let index = 1; index <= count; index++) {
    const nextMonthDate = addMonthToDate(start, index);

    if (nextMonthDate <= end) {
      ticks.push({ timestamp: nextMonthDate, formatStyle: 'axis-with-day-month-year-short' } as TickInstance);
    }
  }

  ticks.reverse().unshift({ timestamp: start, formatStyle: 'axis-with-day-month-year-short' } as TickInstance);

  return ticks;
}

export function createTimeTicks(startTick: number, endTick: number, count: number, valuesCount: number | undefined, formatStyle: formatStyle): TickInstance[] {
  /**
   * This method will create the ticks for the entire interval except the last value
   * The way it's setup is that the last value is pushed after `populateTicksArray()`
   * is executed. The user is able to define what format style for labels he wants between
   * value[1] and second to last value. The last value will always have the same format.
   */
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);

  if (count <= 2) {
    return getDefault2ValuesForXAxis(start, end);
  }

  const stepCount = (valuesCount && valuesCount <= count ? valuesCount : count) - 1;
  const step = Math.floor((end - start) / stepCount);

  const ticks: TickInstance[] = populateTicksArray(stepCount, step, start, formatStyle);

  ticks.push({ timestamp: end, formatStyle: 'axis-with-day-month-year-short' });

  return ticks;
}

function populateTicksArray(stepCount: number, step: number, startTick: number, formatStyle: formatStyle): TickInstance[] {
  const ticks: TickInstance[] = [];
  for (let i = 0; i < stepCount; i++) {
    const tick = startTick + i * step;
    ticks.push({ timestamp: middleOfDayInSeconds(tick), formatStyle: i == 0 ? 'axis-with-day-month-year-short' : formatStyle });
  }
  return ticks;
}
