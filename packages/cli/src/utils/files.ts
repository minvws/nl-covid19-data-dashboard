import { assert, UnknownObject } from '@corona-dashboard/common';
import fs from 'fs';
import { isArray } from 'lodash';
import pMemoize from 'p-memoize';

/**
 * We memoize this so that it can be efficiently called on the same file
 * multiple times and not have to keep track what files we already used.
 */
export const readObjectFromJsonFile = pMemoize(async (filePath: string) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const result = JSON.parse(fileContents);

    if (isArray(result)) {
      throw new Error(`Read data is an array instead of expected object`);
    }

    return result as UnknownObject;
  } catch (err) {
    throw new Error(`Failed to read JSON file ${filePath}`);
  }
});

export function getFilesWithTimeSeries(directory: string) {
  assert(fs.existsSync(directory), `Directory ${directory} does not exist`);

  const fileList = fs.readdirSync(directory);

  const timeSeriesFiles = [...getFileNames(fileList, /^NL.json$/), ...getFileNames(fileList, /^GM[0-9]+.json$/)];

  return timeSeriesFiles;
}

/**
 * Filters the given list of file names according to the given regular expression
 *
 * @param fileList The given list of file names
 * @param pattern The given regular expression
 */
export function getFileNames(fileList: string[], pattern: RegExp) {
  return fileList.filter((filename) => filename.match(pattern));
}
