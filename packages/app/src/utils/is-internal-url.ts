/**
 * Return true if the given url is an internal link to one of the dashboard pages.
 * This counts for international links as well.
 * Return false if the given link is an external link.
 */

export function isInternalUrl(url: string) {
  const totalRegEx = new RegExp('(^(#))|(^(/)[^/]|^(/)$)|(^(((https?://(www.)?)?|www.)coronadashboard(.rijksoverheid|.government)?.nl))');

  return totalRegEx.test(url);
}
