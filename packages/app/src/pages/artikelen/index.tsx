import { groq } from 'next-sanity';
import { ArticleSummary } from '~/components-styled/article-link';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import siteText from '~/locale';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>(
    groq`*[_type == 'article'] | order(publicationDate) {title, slug, summary, cover}`
  )
);

const ArticlesOverview: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <MaxWidth>
      <ArticleList articleSummaries={content} hideLink={true} />
    </MaxWidth>
  );
};

ArticlesOverview.getLayout = getLayoutWithMetadata(siteText.articles_metadata);

export default ArticlesOverview;
