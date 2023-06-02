import { PortableTextEntry } from '@sanity/block-content-to-react';
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
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { sizes, space } from '~/style/theme';
import { DataExplainedGroup } from '~/types/cms';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';

// TODO: abstract this
type Item = {
  title: string;
  slug: { current: string };
  content: PortableTextEntry[];
  icon: string;
};

// TODO: abstract this
interface Dictionary<T> {
  [index: string]: T;
}

// TODO: abstract this
export type DataExplainedGroups = Dictionary<[DataExplainedGroup, ...DataExplainedGroup[]]>;

// TODO: abstract this
const itemQuery = (slug: string | string[] | undefined) => `//groq
  *[_type == 'cijferVerantwoordingItem' && slug.current == '${slug}'][0]
`;

// TODO: abstract this
const pageQuery = (locale: string) => `//groq
  *[_type == 'cijferVerantwoording']{
    "title": title.${locale},
    "collapsibleList": [...collapsibleList[]->
      {
        "group": group->group.${locale},
        "groupIcon": group->icon,
        "title": title.${locale},
        "slug": slug.current,
    }]
  }[0]
`;

export const getStaticPaths = async () => {
  const items = await (
    await getClient()
  ).fetch(`//groq
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
  createGetContent<{ item: Item; page: Dictionary<[DataExplainedGroup, ...DataExplainedGroup[]]> & Pick<DataExplainedGroup, 'title'> }>(({ locale, params }) => {
    return `{
      "item": ${itemQuery(params?.slug)},
      "page": ${pageQuery(locale)},
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

  return (
    <Layout {...commonTexts.verantwoording_metadata} lastGenerated={lastGenerated}>
      <DataExplainedLayout groups={groups}>
        <Head>
          <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
          <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
        </Head>

        <Box maxWidth={sizes.contentWidth} spacing={4} paddingTop={{ _: space[3], md: space[5] }} paddingLeft={{ _: space[3], sm: space[5] }} paddingRight={{ _: space[3], sm: 0 }}>
          <PageInformationBlock
            category={page.title || 'Cijferverantwoording'}
            screenReaderCategory={page.title || 'Cijferverantwoording'}
            title={item.title}
            icon={item.icon ? <DynamicIcon name={getFilenameToIconName(item.icon as IconName) as IconName} /> : undefined}
          />

          <RichContent blocks={item.content} />
        </Box>
      </DataExplainedLayout>
    </Layout>
  );
};

export default DataExplainedDetailPage;
