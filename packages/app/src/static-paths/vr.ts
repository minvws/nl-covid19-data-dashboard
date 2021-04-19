/**
 * getStaticPaths creates an array of all the allowed `/veiligheidsregio/[code]`
 * routes.
 */
export function getStaticPaths() {
  const paths = [] as any[];

  return {
    paths,
    // other routes should 404
    fallback: 'blocking',
  };
}
