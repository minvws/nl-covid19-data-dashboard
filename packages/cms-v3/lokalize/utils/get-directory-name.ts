import path from 'path';
import { fileURLToPath } from 'url';

export const getDirectoryName = () => {
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
};
