/**
 * getStaticPaths creates an array of all the allowed `/gemeente/[code]` routes.
 */
export function getStaticPaths() {
  const paths = [] as any[];
  return {
    paths,
    // other routes should load on-demand
    fallback: 'blocking',
  };
}
