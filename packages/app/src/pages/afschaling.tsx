import { isEmpty } from 'lodash';
import Head from 'next/head';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { RichContent } from '~/components-styled/cms/rich-content';
import { MaxWidth } from '~/components-styled/max-width';
import { Heading } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { Block, DownscalingPage } from '~/types/cms';
import { expandPortableTextAssets } from '~/utils/groq/expand-portable-text-assets';

const locale = process.env.NEXT_PUBLIC_LOCALE;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<DownscalingPage>(
    (_context) => `*[_type == 'downscalePage'][0]{
      ...,
      "page": {
        ...page,
        ${expandPortableTextAssets('description', 'page', locale || 'nl')},
      },
      "downscalingPossible": {
        ...downscalingPossible,
        ${expandPortableTextAssets(
          'description',
          'downscalingPossible',
          locale || 'nl'
        )},
      },
      "downscalingNotPossible": {
        ...downscalingNotPossible,
        ${expandPortableTextAssets(
          'description',
          'downscalingNotPossible',
          locale || 'nl'
        )},
      },
      "measures": {
        ...measures,
        ${expandPortableTextAssets('description', 'measures', locale || 'nl')},
      },
    }`
  ),
  getNlData
);

const Afschaling = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content, data } = props;

  const isDownscalePossible =
    data.downscaling?.is_downscaling_possible || false;

  const downscalableOption = isDownscalePossible
    ? content.downscalingPossible
    : content.downscalingNotPossible;

  return (
    <Layout {...siteText.over_metadata} lastGenerated={lastGenerated}>
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

      <Box fontSize={2} bg={'white'} pt={5} pb={4}>
        <MaxWidth>
          <ContentBlock spacing={3}>
            <Box
              borderBottom="1px"
              borderBottomColor="border"
              borderBottomStyle="solid"
            >
              <Heading level={1}>{content.page.title}</Heading>
              <RichContent blocks={content.page.description} />
            </Box>
            {!isEmpty(
              siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
            ) && (
              <Box mb={3}>
                <WarningTile
                  message={
                    siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
                  }
                  variant="emphasis"
                />
              </Box>
            )}
            <Heading level={2}>{content.downscaling.title}</Heading>
            {isDefined(downscalableOption) && (
              <DownscalableExplanation
                text={downscalableOption}
                isPossible={isDownscalePossible}
              />
            )}
            <RichContent blocks={content.downscaling.description} />
            <Heading level={2}>{content.measures.title}</Heading>
            <RichContent blocks={content.measures.description} />
          </ContentBlock>
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default Afschaling;

function DownscalableExplanation({
  text,
  isPossible,
}: {
  text: Block[];
  isPossible: boolean;
}) {
  const color = isPossible ? '#1991D3' : '#FA475E';
  return (
    <Box
      borderLeftColor={color}
      borderLeftWidth="3px"
      borderLeftStyle="solid"
      pl={3}
    >
      <RichContent blocks={text} />
    </Box>
  );
}
