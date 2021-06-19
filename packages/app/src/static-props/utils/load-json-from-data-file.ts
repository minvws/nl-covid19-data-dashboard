import fs from 'fs';
import path from 'path';

export function loadJsonFromDataFile<T>(
  filename: string,
  jsonFolder = 'json'
): T {
  const filePath = path.join(process.cwd(), 'public', jsonFolder, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}
