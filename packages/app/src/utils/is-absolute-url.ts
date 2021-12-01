/**
 * Return true if the given url starts with http or https
 */
export function isAbsoluteUrl(url: string) {
  return /^(https?:)?\/\//.test(url);
}
