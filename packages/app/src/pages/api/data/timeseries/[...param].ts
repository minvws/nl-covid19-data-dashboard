import {
  sortTimeSeriesValues,
  TimestampedValue,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { filterByDateSpan } from '~/utils/api/filter-by-date-span';
import { loadMetricData } from '~/utils/api/load-metric-data';
import { resolvePublicFolder } from '~/utils/api/resolve-public-folder';
import { stripTrailingNullValues } from '~/utils/api/strip-trailing-null-values';

const publicPath = resolvePublicFolder(path.resolve(__dirname));
const publicJsonPath = path.resolve(publicPath, 'json');

/**
 * This API route
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!Array.isArray(req.query.param)) {
    res.status(400).end();
    return;
  }

  const { param, start, end } = req.query;
  const [root, metric, metricProperty] = param as [string, string, string];

  if (!root?.length || !metric?.length) {
    res.status(400).end();
    return;
  }

  try {
    const data = loadMetricData(root, metric, publicJsonPath);
    if (isDefined(data) && isDefined(data.values)) {
      data.values = sortTimeSeriesValues(data.values);

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
