import { isEmpty } from 'lodash';
import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Heading, InlineText } from '~/components-styled/typography';
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
import { BinaryOption, DownscalingPage } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<DownscalingPage>(
    (_context) => `*[_type == 'afschalingPage'][0]`
  ),
  getNlData
);

const Afschaling = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content, data } = props;

  const isDownscalePossible =
    data.downscaling?.last_value.is_downscaling_possible || false;

  const downScalableOption = isDownscalePossible
    ? content.downscalePossible.optionTrue
    : content.downscalePossible.optionFalse;

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

      <Box bg="white" pt="5em" pb="3em">
        <ContentBlock spacing={3}>
          <Box
            borderBottom="1px"
            borderBottomColor="border"
            borderBottomStyle="solid"
          >
            <Heading level={1}>{content.page.title}</Heading>
            <RichContent blocks={content.page.content} />
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
          {downScalableOption !== undefined && (
            <DownScalableExplanation
              data={downScalableOption}
              isPossible={isDownscalePossible}
            />
          )}
          <RichContent blocks={content.downscaling.content} />
        </ContentBlock>
      </Box>
    </Layout>
  );
};

export default Afschaling;

function DownScalableExplanation({
  data,
  isPossible,
}: {
  data: BinaryOption;
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
      <InlineText fontWeight="bold">{data.label}</InlineText>.
      <InlineText> {data.description}</InlineText>
    </Box>
  );
}
