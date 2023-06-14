import path from 'path';
import url from 'url';
const { fileURLToPath } = url;

export const getDirectoryName = () => {
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
};
