import { shouldPolyfill } from '@formatjs/intl-locale/should-polyfill';
async function polyfill() {
  // This platform already supports Intl.Locale
  if (shouldPolyfill()) {
    await import('@formatjs/intl-locale/polyfill');
  }
}
polyfill();
if (process.env.NODE_ENV === 'development') {
  /**
   * this polyfill allows next.js to show runtime errors in IE11
   */
  require('@webcomponents/shadydom');
}
