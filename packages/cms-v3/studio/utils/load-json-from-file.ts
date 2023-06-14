import fs from 'fs';

// TODO: properly set a return type?
export const loadJsonFromFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(content);
};
