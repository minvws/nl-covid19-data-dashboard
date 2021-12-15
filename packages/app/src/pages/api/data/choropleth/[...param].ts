import { sortTimeSeriesValues } from '@corona-dashboard/common';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { filterByDateSpan } from '~/utils/api/filter-by-date-span';
import { loadMetricData } from '~/utils/api/load-metric-data';
import { resolvePublicFolder } from '~/utils/api/resolve-public-folder';

const publicPath = resolvePublicFolder(path.resolve(__dirname));
const publicJsonPath = path.resolve(publicPath, 'json');

const choroplethScopes = {
  in: 'IN_COLLECTION',
  vr: 'VR_COLLECTION',
  gm: 'GM_COLLECTION',
} as const;

/**
 * This route receives a scope and metric param and returns the associated
 * choropleth data.
 *
 * Example:
 * scope: VR_COLLECTION
 * metric: disability_care
 * This will load the VR_COLLECTION.json file from the public/json folder,
 * extract the disability_care property from it and return the value array.
 *
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!Array.isArray(req.query.param)) {
    res.status(400).end();
    return;
  }

  const { param, start, end } = req.query;
  const [scope, metric] = param as [keyof typeof choroplethScopes, string];

  if (!scope?.length || !metric?.length) {
    res.status(400).end();
    return;
  }

  try {
    let values = loadMetricData(
      choroplethScopes[scope],
      metric,
      publicJsonPath
    );
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
