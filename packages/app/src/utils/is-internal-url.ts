/**
 * Return true if the given url starts with http://coronadashboard. or https://coronadashboard.
 * Return false if the given url starts with http or https
 */
export function isInternalUrl(url: string) {
  const regExAnchor = new RegExp('^(#)');
  const regExInternal = new RegExp('^(/)[^/]|^(/)$');
  const regExInternalBaseDomain = new RegExp('^((https?://)?coronadashboard.rijskoverheid.nl)');
  const regExInternalEnglishDomain = new RegExp('^((https?://)?coronadashboard.government.nl)');
  const regExInternalShortDomain = new RegExp('^(((https?://(www.)?)?|www.)coronadashboard.nl)');

  return regExAnchor.test(url) || regExInternal.test(url) || regExInternalBaseDomain.test(url) || regExInternalEnglishDomain.test(url) || regExInternalShortDomain.test(url);
}
