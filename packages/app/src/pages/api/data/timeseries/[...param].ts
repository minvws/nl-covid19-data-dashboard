import {
  isDateSeries,
  isDateSpanSeries,
  sortTimeSeriesValues,
  TimestampedValue,
} from '@corona-dashboard/common';
import { getUnixTime, parseISO } from 'date-fns';
import fs from 'fs';
import { last } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sanitize from 'sanitize-filename';
import { isDefined } from 'ts-is-present';
import { countTrailingNullValues } from '~/utils/count-trailing-null-values';

const publicPath = path.resolve(__dirname, '../../../../../../public');
const publicJsonPath = path.resolve(publicPath, 'json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { param, start, end } = req.query;
  const [root, metric, metricProperty] = param as [string, string, string];

  if (!root?.length || !metric?.length) {
    res.status(400).end();
    return;
  }

  try {
    const data = loadMetricData(root, metric);
    if (isDefined(data) && isDefined(data.values)) {
      if (!isDefined(metricProperty)) {
        data.values = sortTimeSeriesValues(data.values);
      }
      if (isDefined(start) || isDefined(end)) {
        data.values = filterByDateSpan(
          data.values,
          start as string,
          end as string
        );
        data.last_value = last(data.values);
      }
      res
        .status(200)
        .json(
          stripTrailingNullValues(
            data,
            metric,
            metricProperty as keyof TimestampedValue
          )
        );
    } else {
      res.status(404).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}

function loadMetricData(root: string, metric: string) {
  const filename = sanitize(`${root.toUpperCase()}.json`);
  const fullPath = path.join(publicJsonPath, filename);
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(
      fs.readFileSync(fullPath, { encoding: 'utf-8' })
    );

    return metric in content ? content[metric] : undefined;
  }
  return undefined;
}

function filterByDateSpan(
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

const metricsInaccurateItems = ['intensive_care_nice', 'hospital_nice'];
const strippableMetricProperties = [
  'admissions_on_date_of_admission_moving_average_rounded',
  'admissions_on_date_of_admission_moving_average',
];

function stripTrailingNullValues(
  data: { values: TimestampedValue[]; last_value: TimestampedValue },
  metric: string,
  metricProperty?: keyof TimestampedValue
) {
  if (
    !metricsInaccurateItems.includes(metric) ||
    !strippableMetricProperties.includes(metricProperty as unknown as string)
  ) {
    return data;
  }
  const index = countTrailingNullValues(data.values, metricProperty);
  if (index === data.values.length - 1) {
    return data;
  }
  return {
    values: data.values.slice(0, index),
    last_value: data.values[index],
  };
}
