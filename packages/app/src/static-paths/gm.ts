import municipalities from '~/data/municipal-search-data';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = municipalities.map((municipality) => ({
    params: { code: municipality.gemcode },
  }));

  return {
    paths,
    // other routes should 404
    fallback: false,
  };
}
