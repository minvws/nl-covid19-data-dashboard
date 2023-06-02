import { groupBy } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DataExplainedLayout } from '~/domain/layout/data-explained-layout';
import { Layout } from '~/domain/layout/layout';
import { Languages } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { DataExplainedGroup } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';

// TODO: abstract a bunch of this file to its own file
interface Dictionary<T> {
  [index: string]: T;
}

// TODO: Abstract this function
const groupsQuery = (locale: string) => `//groq
  *[_type == 'cijferVerantwoording']{
    "collapsibleList": [...collapsibleList[]->
      {
        "group": group->group.${locale},
        "groupIcon": group->icon,
        "title": title.${locale},
        "slug": slug.current,
    }]
  }[0]
`;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        text: siteText.pages.topical_page.nl.nationaal_metadata,
      }),
      locale
    ),
  getLastGeneratedDate,
  createGetContent<{ groups: Dictionary<[DataExplainedGroup, ...DataExplainedGroup[]]> }>(({ locale }) => {
    return `{
        "groups": ${groupsQuery(locale)},
      }`;
  })
);

const DataExplainedPage = (props: StaticProps<typeof getStaticProps>) => {
  const {
    content: { groups: rawGroups },
    pageText,
    lastGenerated,
  } = props;

  const router = useRouter();
  const breakpoints = useBreakpoints();

  const groups = groupBy<DataExplainedGroup>(rawGroups.collapsibleList, (item) => item.group);

  const firstGroup = Object.values(groups)[0];
  const firstItem = firstGroup[0];

  useEffect(() => {
    if (breakpoints.md) {
      router.replace(`verantwoording/${firstItem.slug}`);
    }
  }, [breakpoints.md, firstItem.slug, router]);

  return (
    <Layout {...pageText.text} lastGenerated={lastGenerated}>
      <DataExplainedLayout groups={groups} />
    </Layout>
  );
};

export default DataExplainedPage;
