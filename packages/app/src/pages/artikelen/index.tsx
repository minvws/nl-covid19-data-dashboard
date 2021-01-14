import { groq } from 'next-sanity';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { TALLLanguages } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Article } from '~/types/cms';
import { Link } from '~/utils/link';

interface ArticlesOverviewProps {
  text: TALLLanguages;
  content: Article[];
  lastGenerated: string;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article[]>(groq`
    *[_type == 'artikel']
  `)
);

const ArticlesOverview: FCWithLayout<ArticlesOverviewProps> = (props) => {
  const { content } = props;

  return (
    <>
      <h1>Todo: Artikelen!</h1>
      {content.map((article) => (
        <div key={`article-${article.slug.current}`}>
          <Link href={`/artikelen/${article.slug.current}`} passHref>
            <a>{article.title}</a>
          </Link>
        </div>
      ))}
    </>
  );
};

const metadata = {
  title: 'TODO',
  description: 'TODO',
};

ArticlesOverview.getLayout = getLayoutWithMetadata(metadata);

export default ArticlesOverview;
