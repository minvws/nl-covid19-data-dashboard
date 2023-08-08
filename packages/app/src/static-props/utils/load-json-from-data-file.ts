import fs from 'fs';
import path from 'path';

export function loadJsonFromDataFile<T>(filename: string, jsonFolder = 'json', dontFailOnNotFound = false): T {
  const filePath = path.join(process.cwd(), 'public', jsonFolder, filename);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as T;
  } catch (e) {
    if (dontFailOnNotFound) {
      // This is a dirty hack, but dontFailOnNotFound should only be set to true
      // in the case where we work with mock data. In production this should not
      // be the case.
      return {} as T;
    }
    throw e;
  }
}
