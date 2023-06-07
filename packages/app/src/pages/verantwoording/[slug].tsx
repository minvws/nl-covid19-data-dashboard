import { groupBy } from 'lodash';
import Head from 'next/head';
import { PageInformationBlock } from '~/components';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import DynamicIcon, { IconName } from '~/components/get-icon-by-name';
import { Layout } from '~/domain/layout';
import { DataExplainedLayout } from '~/domain/layout/data-explained-layout';
import { useIntl } from '~/intl';
import { getClient } from '~/lib/sanity';
import { getItemQuery, getPageQuery } from '~/queries/data-explanation/queries';
import { DataExplainedGroups, DataExplainedItem } from '~/queries/data-explanation/query-types';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { sizes, space } from '~/style/theme';
import { DataExplainedGroup } from '~/types/cms';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';

export const getStaticPaths = async () => {
  const client = await getClient();
  const items = await client.fetch(`//groq
    *[_type == 'cijferVerantwoordingItem']{
      "slug": slug.current,
    }
  `);

  const paths = items.flatMap((item: { slug: string }) => [
    { params: { slug: item.slug }, locale: 'en' },
    { params: { slug: item.slug }, locale: 'nl' },
  ]);

  return { paths, fallback: false };
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{ item: DataExplainedItem; page: DataExplainedGroups & Pick<DataExplainedGroup, 'title'> }>(({ locale, params }) => {
    return `{
      "item": ${getItemQuery(params?.slug)},
      "page": ${getPageQuery(locale)},
    }`;
  })
);

const DataExplainedDetailPage = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const {
    content: { item, page },
    lastGenerated,
  } = props;

  const groups = groupBy<DataExplainedGroup>(page.collapsibleList, (item) => item.group);
  const pageTitle = page.title || 'Cijferverantwoording';

  return (
    <Layout {...commonTexts.verantwoording_metadata} lastGenerated={lastGenerated}>
      <DataExplainedLayout groups={groups} title={pageTitle}>
        <Head>
          <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
          <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
        </Head>

        <Box maxWidth={sizes.contentWidth} spacing={4} paddingTop={{ _: space[3], md: space[5] }} paddingLeft={{ _: space[3], sm: space[5] }} paddingRight={{ _: space[3], sm: 0 }}>
          <PageInformationBlock
            category={pageTitle}
            screenReaderCategory={pageTitle}
            title={item.title}
            icon={item.icon ? <DynamicIcon name={getFilenameToIconName(item.icon) as IconName} /> : undefined}
          />

          <RichContent blocks={item.content} />
        </Box>
      </DataExplainedLayout>
    </Layout>
  );
};

export default DataExplainedDetailPage;
