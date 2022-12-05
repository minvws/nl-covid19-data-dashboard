/**
 * Return true if the given url starts with http or https
 */
export function isInternalUrl(url: string) {
  const regExExternal = new RegExp('(https?://coronadashboard.)');
  const regExInternal = new RegExp('^(https?:)?//');

  return regExExternal.test(url) || !regExInternal.test(url);
}
