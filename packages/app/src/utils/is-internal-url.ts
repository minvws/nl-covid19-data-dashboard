/**
 * Return true if the given url starts with http://coronadashboard. or https://coronadashboard.
 * Return false if the given url starts with http or https
 */
export function isInternalUrl(url: string) {
  const totalRegEx = new RegExp('(^(#))|(^(/)[^/]|^(/)$)|(^(((https?://(www.)?)?|www.)coronadashboard(.rijskoverheid|.government)?.nl))');

  return totalRegEx.test(url);
}
