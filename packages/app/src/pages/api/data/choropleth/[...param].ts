import { sortTimeSeriesValues } from '@corona-dashboard/common';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { filterByDateSpan } from '~/utils/api/filter-by-date-span';
import { loadMetricData } from '~/utils/api/load-metric-data';
import { resolvePublicFolder } from '~/utils/api/resolve-public-folder';

const publicPath = resolvePublicFolder(path.resolve(__dirname));
const publicJsonPath = path.resolve(publicPath, 'json');

const rootFiles = {
  in: 'IN_COLLECTION',
  vr: 'VR_COLLECTION',
  gm: 'GM_COLLECTION',
} as const;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!Array.isArray(req.query.param)) {
    res.status(400).end();
    return;
  }

  const { param, start, end } = req.query;
  const [root, metric] = param as [keyof typeof rootFiles, string];

  if (!root?.length || !metric?.length) {
    res.status(400).end();
    return;
  }

  try {
    let values = loadMetricData(rootFiles[root], metric, publicJsonPath);
    if (isDefined(values)) {
      values.values = sortTimeSeriesValues(values);

      if (isDefined(start) || isDefined(end)) {
        values = filterByDateSpan(values, start as string, end as string);
      }

      res.status(200).json(values);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}
