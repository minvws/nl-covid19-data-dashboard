import safetyRegions from '~/data/index';

/**
 * getStaticPaths creates an array of all the allowed `/veiligheidsregio/[code]`
 * routes.
 */
export function getStaticPaths() {
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
}
