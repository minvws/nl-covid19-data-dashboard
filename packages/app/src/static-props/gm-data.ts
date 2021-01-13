import municipalities from '~/data/municipalSearchData';

/**
 * getPaths creates an array of all the allowed `/gemeente/[code]` routes.
 * This should be used together with `getMunicipalityData`.
 */
export function getPaths() {
  return function () {
    const paths = municipalities.map((municipality) => ({
      params: { code: municipality.gemcode },
    }));

    return {
      paths,
      // other routes should 404
      fallback: false,
    };
  };
}
