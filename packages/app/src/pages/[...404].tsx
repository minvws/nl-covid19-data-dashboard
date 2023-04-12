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

const NotFound = ({ lastGenerated, notFoundPageConfiguration }: NotFoundProps) => {
  if (!notFoundPageConfiguration || !Object.keys(notFoundPageConfiguration).length) {
    return <NotFoundFallback lastGenerated={lastGenerated} />;
  }

  return <NotFoundPage lastGenerated={lastGenerated} notFoundPageConfiguration={notFoundPageConfiguration} />;
};

export default NotFound;
