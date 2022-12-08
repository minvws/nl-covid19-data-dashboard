/**
 * Return true if the given url starts with http://coronadashboard. or https://coronadashboard.
 * Return false if the given url starts with http or https
 */
export function isInternalUrl(url: string, href: string) {
  const regExAnchor = new RegExp('(#)');
  const regExExternal = new RegExp('^(https?://coronadashboard.)');
  const regExInternal = new RegExp('^(https?:)?//');

  return regExAnchor.test(href) || regExExternal.test(url) || !regExInternal.test(url);
}
