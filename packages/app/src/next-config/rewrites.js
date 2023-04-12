async function rewrites() {
  return {
    beforeFiles: [
      {
        source: '/gemeente/(g|G)(m|M):nr(\\d{4})/:page*',
        destination: '/gemeente/GM:nr/:page*',
      },
      /**
       * The gemeente rewrite below will match everything after /gemeente/ except for gm or GM.
       * When matched, the destination is rewritten to /gemeente/code/404 so that it lands in the
       * [...404].tsx catch-all route within packages/app/src/pages/gemeente/[code]/.
       */
      {
        source: '/gemeente/((?!g|G).*)((?!m|M).*):slug*',
        destination: '/gemeente/code/404',
      },
      /**
       * The rewrite will be triggered when the source url does not contain a valid GM code. For example:
       * /gemeente/GM/rioolwater or /gemeente/GM168/rioolwater. The regex (using negative look ahead) states
       * that /gemeente/ must be followed by gm/GM which must be followed by 4 digits.
       */
      {
        source: '/gemeente/(g|G)(m|M)((?!\\d{4}).*):slug*',
        destination: '/gemeente/code/404',
      },
      {
        source: '/veiligheidsregio/(v|V)(r|R):nr(\\d{2})/:page*',
        destination: '/veiligheidsregio/VR:nr/:page*',
      },
    ],
  };
}

module.exports = {
  rewrites,
};
