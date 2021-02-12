require('@formatjs/intl-locale/polyfill');

if (process.env.NODE_ENV === 'development') {
  /**
   * this polyfill allows next.js to show runtime errors in IE11
   */
  require('@webcomponents/shadydom');
}
