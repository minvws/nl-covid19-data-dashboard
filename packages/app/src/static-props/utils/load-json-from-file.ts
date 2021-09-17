import fs from 'fs';

export function loadJsonFromFile<T>(filename: string) {
  const fileContents = fs.readFileSync(filename, 'utf8');
  return JSON.parse(fileContents) as T;
}
