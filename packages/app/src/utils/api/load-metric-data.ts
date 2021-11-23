import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';

export function loadMetricData(
  root: string,
  metric: string,
  publicJsonPath: string
) {
  const filename = sanitize(`${root.toUpperCase()}.json`);
  const fullPath = path.join(publicJsonPath, filename);
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(
      fs.readFileSync(fullPath, { encoding: 'utf-8' })
    );

    return metric in content ? content[metric] : undefined;
  }
  console.error(`${fullPath} not found`);
  return undefined;
}
