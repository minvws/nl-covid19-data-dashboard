import { groq } from 'next-sanity';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { LatestArticle } from '..';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<LatestArticle[]>(
    groq`*[_type == 'article'] | order(publicationDate) {title, slug, summary, cover}`
  )
);

const ArticlesOverview: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <MaxWidth>
      <ArticleList articles={content} hideLink={true} />
    </MaxWidth>
  );
};

const metadata = {
  title: '@TODO',
  description: '@TODO',
};

ArticlesOverview.getLayout = getLayoutWithMetadata(metadata);

export default ArticlesOverview;
