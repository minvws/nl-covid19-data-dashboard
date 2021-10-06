import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const publicPath = path.resolve(__dirname, '../../../../../public');
const publicJsonPath = path.resolve(publicPath, 'json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { param } = req.query;
  const [root, metric] = param as [string, string, string];

  try {
    const data = loadMetricData(root, metric);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).end();
  }
}

function loadMetricData(root: string, metric: string) {
  const filename = `${root.toUpperCase()}.json`;
  const content = JSON.parse(
    fs.readFileSync(path.join(publicJsonPath, filename), { encoding: 'utf-8' })
  );

  return content[metric];
}
