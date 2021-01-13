import safetyRegions from '~/data/index';

/**
 * getPaths creates an array of all the allowed `/veiligheidsregio/[code]`
 * routes. This should be used
 * together with `getSafetyRegionStaticProps`.
 */
export function getPaths() {
  return function () {
    const filteredRegions = safetyRegions.filter(
      (region) => region.code.indexOf('VR') === 0
    );
    const paths = filteredRegions.map((region) => ({
      params: { code: region.code },
    }));

    return {
      paths,
      // other routes should 404
      fallback: false,
    };
  };
}
