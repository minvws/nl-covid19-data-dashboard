import { gmData } from '~/data/gm';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = gmData.map((x) => ({
    params: { code: x.gmCode },
  }));

  return {
    paths,
    // other routes should 404
    fallback: false,
  };
}
