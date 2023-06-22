import fs from 'fs';

export const loadJsonFromFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(content);
};
