import {
  getValuesInTimeframe,
  isDateSeries,
  isDateSpanSeries,
  TimeframeOption,
  TimestampedValue,
} from '@corona-dashboard/common';
import { first, last } from 'lodash';
// @ts-ignore
import starwars from 'starwars';
import { TimelineEventConfig } from './components/timeline';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function createTimelineEventsMockData<T extends TimestampedValue>(
  values: T[],
  timeframe: TimeframeOption,
  today: Date
) {
  const valuesInTimeframe = getValuesInTimeframe(values, timeframe, today);

  let valuesDateStart: number;
  let valuesDateEnd: number;

  if (isDateSpanSeries(valuesInTimeframe)) {
    valuesDateStart = first(valuesInTimeframe)?.date_start_unix as number;
    valuesDateEnd = last(valuesInTimeframe)?.date_end_unix as number;
  } else if (isDateSeries(valuesInTimeframe)) {
    valuesDateStart = first(valuesInTimeframe)?.date_unix as number;
    valuesDateEnd = last(valuesInTimeframe)?.date_unix as number;
  }

  const eventAmount = between(2, 10);

  let hasHistoryDate = false;

  return Array.from(Array(eventAmount)).map<TimelineEventConfig>(() => {
    const isDatespan = Math.random() > 0.75;
    const isHistoryDate = hasHistoryDate ? false : Math.random() > 0.75;
    hasHistoryDate = hasHistoryDate || isHistoryDate;

    const start = isHistoryDate
      ? valuesDateStart - getDays(3)
      : Math.floor(Math.random() * (valuesDateEnd - valuesDateStart)) +
        valuesDateStart;

    const end = isDatespan
      ? start + getDays(between(1, timeframe === 'all' ? 35 : 5))
      : undefined;

    return {
      start,
      end,
      title: starwars() as string,
      description: starwars() as string,
    };
  });
}

function between(a: number, b: number) {
  return Math.round(Math.random() * b) + a;
}

function getDays(days: number) {
  return days * ONE_DAY_IN_SECONDS;
}
