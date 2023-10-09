import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ContentImage } from '~/components/cms/content-image';
import { RichContent } from '~/components/cms/rich-content';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Heading } from '~/components/typography';
import { ContentLayout } from '~/domain/layout/content-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, sizes, space } from '~/style/theme';
import { ImageBlock, RichContentBlock } from '~/types/cms';
interface OverData {
  title: string | null;
  intro: RichContentBlock[];
  description: RichContentBlock[];
  timelineImage: ImageBlock;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>((context) => {
    const { locale = 'nl' } = context;
    return `// groq
      *[_type == 'overDitDashboard' && !(_id in path('drafts.**'))][0]{
        ...,
        "description": {
          "_type": description._type,
          "${locale}": [
            ...description.${locale}[]{
              ...,
              "asset": asset->
            },
          ]
        },
        "intro": {
          "_type": intro._type,
          "${locale}": [
            ...intro.${locale}[]{
              ...,
              "asset": asset->
            },
          ]
        },
        "timelineImage": {
          "_type": timelineImage._type,
          "${locale}": {
            ...timelineImage.${locale},
          },
        }
      }
    `;
  })
);

const Over = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const { content, lastGenerated } = props;

  return (
    <Layout {...commonTexts.over_metadata} lastGenerated={lastGenerated}>
      <ContentLayout>
        <Head>
          <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
          <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
        </Head>
        <Box paddingBottom={space[5]}>
          <Box marginBottom={space[4]} maxWidth={sizes.maxWidthText}>
            <Heading variant="h2" level={1}>
              {content.title}
            </Heading>
          </Box>
          <TwoColumnLayout>
            <div>
              <RichContent blocks={content.intro} contentWrapper={RichContentWrapper} />
              <FullscreenChartTile disableBorder>
                <Box marginTop={space[2]}>
                  <ContentImage node={content.timelineImage} contentWrapper={RichContentWrapper} enableShadow />
                </Box>
              </FullscreenChartTile>
            </div>
            <div>
              <RichContent blocks={content.description} contentWrapper={RichContentWrapper} />
            </div>
          </TwoColumnLayout>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default Over;

const RichContentWrapper = styled('div')`
  width: 100%;
`;

const TwoColumnLayout = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${space[4]} ${space[5]};

  @media ${mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;
