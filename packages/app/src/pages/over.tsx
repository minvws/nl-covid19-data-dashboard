import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ContentImage } from '~/components/cms/content-image';
import { RichContent } from '~/components/cms/rich-content';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { MaxWidth } from '~/components/max-width';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, space } from '~/style/theme';
import { ImageBlock, RichContentBlock } from '~/types/cms';
interface OverData {
  title: string | null;
  intro: RichContentBlock[] | null;
  description: RichContentBlock[] | null;
  timelineImage: ImageBlock | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>((context) => {
    const { locale = 'nl' } = context;
    return `// groq
      *[
          _type == 'overDitDashboard' && !(_id in path('drafts.**'))
      ][0]{...,
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
        "intro": {
          "_type": intro._type,
          "${locale}": [
            ...intro.${locale}[]
            {
              ...,
              "asset": asset->
             },
          ]
        },
        "timelineImage": {
          "_type": timelineImage._type,
          "${locale}": {...timelineImage.${locale},
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
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>

      <Box textVariant="body1" bg="white">
        <MaxWidth paddingTop={space[6]} paddingBottom={space[5]} paddingX={space[3]}>
          <TwoColumnLayout>
            <Box spacing={4}>{content.title && <Heading level={1}>{content.title}</Heading>}</Box>
          </TwoColumnLayout>
          <TwoColumnLayout>
            <Box>
              {content.intro && <RichContent blocks={content.intro} contentWrapper={RichContentWrapper} />}
              <FullscreenChartTile disableBorder>
                <Box marginTop={space[2]}>{content.timelineImage && <ContentImage node={content.timelineImage} contentWrapper={RichContentWrapper} enableShadow />}</Box>
              </FullscreenChartTile>
            </Box>
            <div>{content.description && <RichContent blocks={content.description} contentWrapper={RichContentWrapper} />}</div>
          </TwoColumnLayout>
        </MaxWidth>
      </Box>
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
  gap: ${space[4]};
  
  @media ${mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
}
`;
