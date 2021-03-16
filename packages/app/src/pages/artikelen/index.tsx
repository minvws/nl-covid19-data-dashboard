import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { ArticleList } from '~/domain/topical/article-list';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';

//@TODO THIS NEEDS TO COME FROM CONTEXT
const locale = 'nl';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>(
    `*[_type == 'article'] | order(publicationDate desc) {
      "title":title.${locale},
      slug,
      "summary":summary.${locale},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }`
  )
);

const ArticlesOverview = (props) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.articles_metadata} lastGenerated={lastGenerated}>
      <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
        <MaxWidth px={{ _: 3, lg: 4 }}>
          <ArticleList articleSummaries={content} hideLink={true} />
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default ArticlesOverview;
