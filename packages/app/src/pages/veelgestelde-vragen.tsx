import groupBy from 'lodash/groupBy';
import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { FaqSection } from '~/components/faq/faq-section';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, sizes, space } from '~/style/theme';
import { FAQuestionAndAnswer, RichContentBlock } from '~/types/cms';

interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: FAQuestionAndAnswer[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VeelgesteldeVragenData>((context) => {
    const { locale = 'nl' } = context;

    return `// groq
      *[_type == 'veelgesteldeVragen']{
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
  const { commonTexts } = useIntl();

  const groups = groupBy<FAQuestionAndAnswer>(content.questions, (x) => x.group);
  const groupsArray = Object.entries(groups);
  const middleIndexOfGroups = Math.ceil(groupsArray.length / 2);
  const firstHalf = groupsArray.slice(0, middleIndexOfGroups);
  const secondHalf = groupsArray.slice(middleIndexOfGroups);

  return (
    <Layout {...commonTexts.veelgestelde_vragen_metadata} lastGenerated={lastGenerated}>
      <Box margin={`${space[5]} auto`} maxWidth={`${sizes.maxWidth}px`} padding={` 0 ${space[4]}`}>
        <Head>
          <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
          <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
        </Head>

        <Box maxWidth={sizes.maxWidthText} marginBottom={space[4]} spacing={3}>
          {content.title && (
            <Heading variant="h2" level={1}>
              {content.title}
            </Heading>
          )}
          {content.description && <RichContent blocks={content.description} />}
        </Box>

        <FaqLayout>
          <FaqSection section={firstHalf} />
          <FaqSection section={secondHalf} />
        </FaqLayout>
      </Box>
    </Layout>
  );
};

export default Verantwoording;

const FaqLayout = styled(Box)`
  @media ${mediaQueries.sm} {
    display: flex;
    gap: ${space[4]} ${space[5]};
  }
`;
