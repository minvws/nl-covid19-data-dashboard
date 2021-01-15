import { groq } from 'next-sanity';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Article } from '~/types/cms';
import { Link } from '~/utils/link';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article[]>(groq`
    *[_type == 'article']
  `)
);

const ArticlesOverview: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <>
      <h1>@Todo: Artikelen!</h1>
      {content.map((article) => (
        <div key={article.slug.current}>
          <Link href={`/artikelen/${article.slug.current}`} passHref>
            <a>{article.title}</a>
          </Link>
        </div>
      ))}
    </>
  );
};

const metadata = {
  title: '@TODO',
  description: '@TODO',
};

ArticlesOverview.getLayout = getLayoutWithMetadata(metadata);

export default ArticlesOverview;
