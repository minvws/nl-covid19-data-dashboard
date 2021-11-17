import {
  isDateSeries,
  isDateSpanSeries,
  TimestampedValue,
} from '@corona-dashboard/common';
import { getUnixTime, parseISO } from 'date-fns';
import { isDefined } from 'ts-is-present';

export function filterByDateSpan(
  values: TimestampedValue[],
  start?: string,
  end?: string
): TimestampedValue[] {
  const startDate = createTimestamp(start);
  const endDate = createTimestamp(end);

  if (isDateSeries(values)) {
    if (!isNaN(startDate) && !isNaN(endDate)) {
      return values.filter(
        (x) => x.date_unix >= startDate && x.date_unix <= endDate
      );
    } else if (!isNaN(startDate)) {
      return values.filter((x) => x.date_unix >= startDate);
    } else if (!isNaN(endDate)) {
      return values.filter((x) => x.date_unix <= endDate);
    }
  } else if (isDateSpanSeries(values)) {
    if (!isNaN(startDate) && !isNaN(endDate)) {
      return values.filter(
        (x) => x.date_start_unix >= startDate && x.date_start_unix <= endDate
      );
    } else if (!isNaN(startDate)) {
      return values.filter((x) => x.date_start_unix >= startDate);
    } else if (!isNaN(endDate)) {
      return values.filter((x) => x.date_start_unix <= endDate);
    }
  }
  return values;
}

function createTimestamp(dateStr: string | undefined): number {
  if (isDefined(dateStr)) {
    // Suffix the date string with a Z to indicate that this is a UTC date:
    const parsedDate = parseISO(`${dateStr}Z`);
    return getUnixTime(parsedDate);
  }
  return NaN;
}
