import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import siteText, { targetLanguage } from '~/locale';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>(
    `*[_type == 'article'] | order(publicationDate) {
      "title":title.${targetLanguage},
      slug,
      "summary":summary.${targetLanguage},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }    
    }`
  )
);

const ArticlesOverview: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
      <MaxWidth>
        <ArticleList articleSummaries={content} hideLink={true} />
      </MaxWidth>
    </Box>
  );
};

ArticlesOverview.getLayout = getLayoutWithMetadata(siteText.articles_metadata);

export default ArticlesOverview;
