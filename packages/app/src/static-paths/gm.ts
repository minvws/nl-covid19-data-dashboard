import { gmData } from '~/data/gm';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = gmData.map((x) => ({
    locale: 'nl',
    params: { code: x.gemcode },
  }));

  return {
    paths,
    // other routes should 404
    fallback: 'blocking',
  };
}
