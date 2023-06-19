import path from 'path';
import url from 'url';
const { fileURLToPath } = url;

export const getDirectoryName = (url: string) => {
  const filename = fileURLToPath(url);
  return path.dirname(filename);
};
