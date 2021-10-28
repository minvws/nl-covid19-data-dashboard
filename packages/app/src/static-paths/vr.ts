import { vrData } from '@corona-dashboard/common';

/**
 * getStaticPaths creates an array of all the allowed `/veiligheidsregio/[code]`
 * routes.
 */
export function getStaticPaths() {
  const filteredRegions = vrData.filter((x) => x.code.startsWith('VR'));
  const paths = filteredRegions.map((x) => ({
    params: { code: x.code },
  }));

  return {
    paths,
    // other routes should 404
    fallback: 'blocking',
  };
}
