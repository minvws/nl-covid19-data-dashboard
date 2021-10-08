import { sortTimeSeriesValues } from '@corona-dashboard/common';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import sanitize from 'sanitize-filename';
import { isDefined } from 'ts-is-present';

const publicPath = path.resolve(__dirname, '../../../../../../public');
const publicJsonPath = path.resolve(publicPath, 'json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { param } = req.query;
  const [root, metric, metricProperty] = param as [string, string, string];

  if (!root?.length || !metric?.length) {
    res.status(400).end();
    return;
  }

  try {
    const data = loadMetricData(root, metric, metricProperty);
    if (isDefined(data)) {
      if (!isDefined(metricProperty)) {
        data.values = sortTimeSeriesValues(data.values);
      }
      res.status(200).json(data);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}

function loadMetricData(root: string, metric: string, metricProperty?: string) {
  const filename = sanitize(`${root.toUpperCase()}.json`);
  const fullPath = path.join(publicJsonPath, filename);
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(
      fs.readFileSync(fullPath, { encoding: 'utf-8' })
    );

    const result = metric in content ? content[metric] : undefined;
    return isDefined(result) &&
      isDefined(metricProperty) &&
      metricProperty.length
      ? result[metricProperty]
      : result;
  }
  return undefined;
}
