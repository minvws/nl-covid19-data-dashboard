import fs from 'fs';
import path from 'path';

export function loadJsonFromDataFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'public', 'json', filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}
