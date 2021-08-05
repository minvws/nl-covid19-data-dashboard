import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>((context) => {
    const { locale = 'nl' } = context;

    return `*[_type == 'article'] | order(publicationDate desc) {
        "title":title.${locale},
        slug,
        "summary":summary.${locale},
        "cover": {
          ...cover,
          "asset": cover.asset->
        }
      }`;
  })
);

const ArticlesOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.articles_metadata} lastGenerated={lastGenerated}>
      <VisuallyHidden>
        <Heading level={1}>
          {siteText.common_actueel.secties.artikelen.titel}
        </Heading>
      </VisuallyHidden>
      <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
        <MaxWidth px={{ _: 3, lg: 4 }}>
          <ArticleList articleSummaries={content} hideLink={true} />
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default ArticlesOverview;
