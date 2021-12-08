import fs from 'fs';
import path from 'path';

/**
 * Recursively walks up from the current working directory until one is
 * found that contains a directory named 'public'.
 * Throws an error when this wasn't found.
 */
export function resolvePublicFolder(cwd: string): string {
  const parentPath = path.resolve(cwd, '..');

  //This happens when we've navigated all the way up to the root and can't go any higher
  if (parentPath === cwd) {
    throw new Error('Unable to resolve public folder');
  }

  const publicPath = path.join(parentPath, 'public');

  if (fs.existsSync(publicPath)) {
    return publicPath;
  }

  return resolvePublicFolder(parentPath);
}
