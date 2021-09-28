import { gmData } from '~/data/gm';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = gmData.flatMap((x) =>
    ['nl', 'en'].map((locale) => ({
      locale,
      params: { code: x.gemcode },
    }))
  );

  return {
    paths,
    // other routes should 404
    fallback: false,
  };
}
