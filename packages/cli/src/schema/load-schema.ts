import fs from 'fs';
import path from 'path';

/**
 * Loads the given uri and parses its contents to JSON
 * @param basePath The given base directory name
 * @param uri The given filename
 */
export function loadSchema(basePath: string, uri: string): Promise<any> {
  return fs.promises
    .readFile(path.join(basePath, uri), {
      encoding: 'utf8',
    })
    .then((data: string) => JSON.parse(data));
}
