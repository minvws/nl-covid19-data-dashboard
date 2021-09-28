import { vrData } from '~/data/vr';

/**
 * getStaticPaths creates an array of all the allowed `/veiligheidsregio/[code]`
 * routes.
 */
export function getStaticPaths() {
  const filteredRegions = vrData.filter((x) => x.code.startsWith('VR'));
  const paths = filteredRegions.flatMap((x) =>
    ['nl', 'en'].map((locale) => ({
      locale,
      params: { code: x.code },
    }))
  );

  return {
    paths,
    // other routes should 404
    fallback: false,
  };
}
