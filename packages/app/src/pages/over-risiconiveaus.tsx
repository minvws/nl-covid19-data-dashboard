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

interface OverRisiconiveausData {
  title: string | null;
  description: RichContentBlock[] | null;
  collapsibleList: CollapsibleList[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>((_context) => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;
    return `*[_type == 'overRisicoNiveaus']{
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
      "collapsibleList": [...collapsibleList[]
        {
          ...,
          "content": {
            ...content,
            "${locale}": [
              ...content.${locale}[]
              {
                ...,
                "asset": asset->
               },
            ]
          }
      }]
    }[0]
    `;
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { content, lastGenerated } = props;

  return (
    <Layout
      {...siteText.over_risiconiveaus_metadata}
      lastGenerated={lastGenerated}
    >
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
        {content.title && <Heading level={1}>{content.title}</Heading>}
        {content.description && <RichContent blocks={content.description} />}
        {content.collapsibleList && (
          <article>
            {content.collapsibleList.map((item) => {
              const id = getSkipLinkId(item.title);
              return item.content ? (
                <CollapsibleSection key={id} id={id} summary={item.title}>
                  {item.content && (
                    <Box mt={3}>
                      <RichContent blocks={item.content} />
                    </Box>
                  )}
                </CollapsibleSection>
              ) : null;
            })}
          </article>
        )}
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;
