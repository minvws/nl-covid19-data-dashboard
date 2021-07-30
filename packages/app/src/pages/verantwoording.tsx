import groupBy from 'lodash/groupBy';
import Head from 'next/head';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { CollapsibleSection } from '~/components/collapsible';
import { Heading } from '~/components/typography';
import { Content } from '~/domain/layout/content';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skip-links';

interface VerantwoordingData {
  title: string | null;
  description: RichContentBlock[] | null;
  collapsibleList: CollapsibleList[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VerantwoordingData>((_context) => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;
    return `*[_type == 'cijferVerantwoording']{
      ...,
      "description": {
        "_type": description._type,
        "${locale}": [
          ...description.${locale}[]
          {
            ...,
            "asset": asset->
          },
        ]
      },
      "collapsibleList": [...collapsibleList[]->
        {
          "group": group->group.${locale},
          "content": [
              ...content.${locale}[]
              {
                ...,
                "asset": asset->
              },
          ],
          "title": title.${locale},
      }]
    }[0]
    `;
  })
);

const Verantwoording = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { content, lastGenerated } = props;

  const groups = groupBy<CollapsibleList>(
    content.collapsibleList,
    (x) => x.group
  );

  return (
    <Layout {...siteText.verantwoording_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <Content>
        <Box spacing={4}>
          {content.title && <Heading level={1}>{content.title}</Heading>}
          {content.description && <RichContent blocks={content.description} />}
          {Object.entries(groups)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([group, collapsibleItems]) => (
              <Box as="article" key={group} spacing={3}>
                <Heading level={3} as="h2">
                  {group}
                </Heading>
                <div>
                  {collapsibleItems
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((item) => {
                      const id = getSkipLinkId(item.title);
                      return item.content ? (
                        <CollapsibleSection
                          key={id}
                          id={id}
                          summary={item.title}
                        >
                          <Box pt={2} pb={4}>
                            <RichContent blocks={item.content} />
                          </Box>
                        </CollapsibleSection>
                      ) : null;
                    })}
                </div>
              </Box>
            ))}
        </Box>
      </Content>
    </Layout>
  );
};

export default Verantwoording;
