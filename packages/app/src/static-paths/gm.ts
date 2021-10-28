import { gmData } from '@corona-dashboard/common';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = gmData.map((x) => ({
    params: { code: x.gemcode },
  }));

  return {
    paths,
    // other routes should 404
    fallback: 'blocking',
  };
}
