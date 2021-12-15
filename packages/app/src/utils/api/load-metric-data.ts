import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';

/**
 * Loads a specified metric from a given json file
 */
export function loadMetricData(
  scope: string,
  metric: string,
  publicJsonPath: string
) {
  const filename = sanitize(`${scope.toUpperCase()}.json`);
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
