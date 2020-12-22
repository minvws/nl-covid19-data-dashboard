import fs from 'fs';

export function loadJsonFromFile<T>(path: string): T {
  const fileContents = fs.readFileSync(path, 'utf8');
  return JSON.parse(fileContents) as T;
}
