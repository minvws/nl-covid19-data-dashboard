// import municipalities from '~/data/municipalSearchData';

/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  // const paths = municipalities.map((municipality) => ({
  //   params: { code: municipality.gemcode },
  // }));

  const paths = [] as any[];

  return {
    paths,
    fallback: 'blocking',
  };
}
