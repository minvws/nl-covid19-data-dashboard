async function rewrites() {
  return {
    beforeFiles: [
      {
        source: '/gemeente/(g|G)(m|M):nr(\\d{4})/:page*',
        destination: '/gemeente/GM:nr/:page*',
      },
      /**
       * The rewrite below will match everything after /gemeente/ except for g/m or G/M or gm/GM.
       * When matched, the destination is rewritten to /gemeente/code/404 so that it lands in the
       * [...404].tsx catch-all route within packages/app/src/pages/gemeente/[code]/ The same applies
       * to the two other gemeente rewrites below. This is a workaround for making sure all gemeente routes
       * go to the correct 404 page ([...404].tsx).
       *
       * The regex states that if /gemeente/ is not followed by gm/GM/gM/Gm, then it should go to the 404 page.
       * For example:
       * 1. /gemeente/somethingWrong
       * 2. /gemeente/blahblah
       * 3. /gemeente/gblah
       */
      {
        source: '/gemeente/((?!gm|GM|gM|Gm).*):slug*',
        destination: '/gemeente/code/404',
      },
      /**
       * The regex below states that if the URL contains GM after /gemeente/, it must be followed by 4 digits.
       * This will catch:
       * 1. /gemeente/GM123
       * 2. /gemeente/GM
       * 3. /gemeente/GM123/rioolwater
       */
      {
        source: '/gemeente/(g|G)(m|M)((?!\\d{4}).*):slug*',
        destination: '/gemeente/code/404',
      },
      /**
       * The regex below matches URLs which contain g|G m|M followed by more than 4 digits, optionally
       * followed by a forward slash, optionally followed by a string. This will catch:
       * 1. /gemeente/GM12345
       * 2. /gemeente/GM123456/rioolwater
       */
      {
        source: '/gemeente/(g|G)(m|M)(\\d{5,})(\\/?)(\\S*):slug*',
        destination: '/gemeente/code/404',
      },
      /**
       * The rewrite below is a workaround. 404 seems to be a reserved route, so it does not go to the
       * catch-all route by default. This rewrite ensures that basePath/404 will also go to the catch-all route.
       */
      {
        source: '/(404):slug*',
        destination: '/not-found/404',
      },
    ],
  };
}

module.exports = {
  rewrites,
};
