import { groupBy } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DataExplainedLayout } from '~/domain/layout/data-explained-layout';
import { Layout } from '~/domain/layout/layout';
import { Languages } from '~/locale';
import { getPageQuery } from '~/queries/data-explanation/queries';
import { DataExplainedGroups } from '~/queries/data-explanation/query-types';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { DataExplainedGroup } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        text: siteText.pages.topical_page.nl.nationaal_metadata,
      }),
      locale
    ),
  getLastGeneratedDate,
  createGetContent<{ page: DataExplainedGroups & Pick<DataExplainedGroup, 'title'> }>(({ locale }) => {
    return `{
        "page": ${getPageQuery(locale)},
      }`;
  })
);

const DataExplainedPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content: { page },
    pageText,
    lastGenerated,
  } = props;

  const router = useRouter();
  const breakpoints = useBreakpoints();

  const groups = groupBy<DataExplainedGroup>(page.collapsibleList, (item) => item.group);

  const firstGroup = Object.values(groups)[0];
  const firstItem = firstGroup[0];

  useEffect(() => {
    if (breakpoints.md) {
      router.replace(`verantwoording/${firstItem.slug}`);
    }
  }, [breakpoints.md, firstItem.slug, router]);

  return (
    <Layout {...pageText.text} lastGenerated={lastGenerated}>
      <DataExplainedLayout groups={groups} title={page.title || 'Cijferverantwoording'} />
    </Layout>
  );
};

export default DataExplainedPage;
