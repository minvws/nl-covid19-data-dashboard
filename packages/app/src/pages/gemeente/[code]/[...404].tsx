import { GetServerSideProps } from 'next';
import { getNotFoundPageData } from '~/components/not-found-pages/logic';
import { NotFoundPage } from '~/components/not-found-pages/not-found-page';
import { NotFoundFallback } from '~/components/not-found-pages/not-found-page-fallback';
import { NotFoundProps } from '~/components/not-found-pages/types';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getServerSideProps: GetServerSideProps = async ({ req, res, locale = 'nl' }) => {
  res.statusCode = 404;
  const { lastGenerated } = getLastGeneratedDate();
  const notFoundPageConfiguration = await getNotFoundPageData(req.url || 'general', locale);

  if (notFoundPageConfiguration === null) {
    return { props: { lastGenerated } };
  }

  return {
    props: { lastGenerated, notFoundPageConfiguration },
  };
};

/**
 * This is a catch-all route which is used as the 404 page for all /gemeente/* routes.
 * There is some logic in rewrites.js which ensures that any 404's for /gemeente/* routes
 * end up rendering this route.
 */
const NotFoundGM = ({ lastGenerated, notFoundPageConfiguration }: NotFoundProps) => {
  if (!notFoundPageConfiguration || !Object.keys(notFoundPageConfiguration).length) {
    return <NotFoundFallback lastGenerated={lastGenerated} />;
  }

  return <NotFoundPage lastGenerated={lastGenerated} notFoundPageConfiguration={notFoundPageConfiguration} />;
};

export default NotFoundGM;
