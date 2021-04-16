import { gm } from '~/data/gm';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = gm.map((x) => ({
    params: { code: x.gemcode },
  }));

  return {
    paths,
    // other routes should 404
    fallback: false,
  };
}
