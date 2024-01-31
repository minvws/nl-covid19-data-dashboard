import { extractYearFromDate, formatStyle, getFirstDayOfGivenYear, middleOfDayInSeconds } from '@corona-dashboard/common';
import { Breakpoints } from '~/utils/use-breakpoints';

export interface TickInstance {
  timestamp: number;
  formatStyle: formatStyle;
}

function getDefault2ValuesForXAxis(startTick: number, endTick: number): TickInstance[] {
  return [
    { timestamp: startTick, formatStyle: 'axis-with-day-month-year-short' },
    { timestamp: endTick, formatStyle: 'axis-with-day-month-year-short' },
  ] as TickInstance[];
}

export function createTimeTicksAllTimeFrame(startTick: number, endTick: number, count: number, breakpoints: Breakpoints): TickInstance[] {
  /**
   * This method is only used for the `all` timeframe option.
   */
  const start = middleOfDayInSeconds(startTick);
  const end = middleOfDayInSeconds(endTick);
  const startYear = extractYearFromDate(start);

  if (count <= 2) {
    return getDefault2ValuesForXAxis(start, end);
  }

  const ticks: TickInstance[] = Array.from({ length: count }, (_, i) => {
    const firstDayOfYearTimeStamp = getFirstDayOfGivenYear(startYear + i + 1); // 01.01.2021, 01.01.2022... etc.
    return { timestamp: firstDayOfYearTimeStamp, formatStyle: 'axis-with-day-month-year-short' } as TickInstance;
  });

  // This if statement ensures that first & second label of the all-values timeframe don't overlap
  if (breakpoints.lg) {
    ticks.unshift({ timestamp: start, formatStyle: 'axis-with-month-year-short' } as TickInstance);
  }

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

  ticks.push({ timestamp: end, formatStyle: 'axis-with-month-year-short' });

  return ticks;
}

function populateTicksArray(stepCount: number, step: number, startTick: number, formatStyle: formatStyle): TickInstance[] {
  const ticks: TickInstance[] = [];
  for (let i = 0; i < stepCount; i++) {
    const tick = startTick + i * step;
    ticks.push({ timestamp: middleOfDayInSeconds(tick), formatStyle: i == 0 ? 'axis-with-month-year-short' : formatStyle });
  }
  return ticks;
}
