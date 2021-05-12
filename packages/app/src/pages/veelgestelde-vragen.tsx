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
import { FAQuestionAndAnswer, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skip-links';

interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: FAQuestionAndAnswer[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VeelgesteldeVragenData>((context) => {
    const { locale } = context;

    return `*[_type == 'veelgesteldeVragen']{
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
      "questions": [
        ...questions[]->
        {
          ...,
          "group": group->group.${locale},
          "content": {
            ...content,
            "${locale}": [...content.${locale}[]
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

const Verantwoording = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();

  const groups = groupBy<FAQuestionAndAnswer>(
    content.questions,
    (x) => x.group
  );

  return (
    <Layout
      {...siteText.veelgestelde_vragen_metadata}
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
        {Object.entries(groups).map(([group, questions]) => (
          <Box as="article" mt={4} key={group}>
            <Heading level={2} fontSize={3}>
              {group}
            </Heading>
            {questions.map((item) => {
              const id = getSkipLinkId(item.title);
              return (
                <CollapsibleSection key={id} id={id} summary={item.title}>
                  {item.content && (
                    <Box mt={3}>
                      <RichContent blocks={item.content} />
                    </Box>
                  )}
                </CollapsibleSection>
              );
            })}
          </Box>
        ))}
      </Content>
    </Layout>
  );
};

export default Verantwoording;
