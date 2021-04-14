import css from '@styled-system/css';
import { isEmpty } from 'lodash';
import Head from 'next/head';
import { ReactNode } from 'react';
import { isDefined } from 'ts-is-present';
import Arts from '~/assets/arts-small.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import Repro from '~/assets/reproductiegetal-small.svg';
import Ziekenhuis from '~/assets/ziekenhuis-small.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { RichContent } from '~/components-styled/cms/rich-content';
import { MaxWidth } from '~/components-styled/max-width';
import { TimeSeriesMiniBarChart } from '~/components-styled/time-series-chart';
import { Heading, Text } from '~/components-styled/typography';
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
import { colors } from '~/style/theme';
import { Block, DownscalingPage } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
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

/*
  @TODO Connect with data
*/
const reproduction_is_below_threshold = false;
const reproduction_threshold_day_span = 14;

const intensive_care_nice_is_below_threshold = true;
const intensive_care_nice_threshold_day_span = 14;

const hospital_nice_is_below_threshold = false;
const hospital_nice_threshold_day_span = 14;

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
          <ContentBlock spacing={3} mb={5}>
            <Box>
              <Heading level={1}>{content.page.title}</Heading>
              <Box fontSize={3}>
                <RichContent blocks={content.page.description} />
              </Box>
              {!isEmpty(
                siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
              ) && (
                <WarningTile
                  message={
                    siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
                  }
                  variant="emphasis"
                />
              )}
            </Box>
            <Box>
              <Heading level={2} fontSize={3}>
                {content.downscaling.title}
              </Heading>
              {isDefined(downscalableOption) && (
                <DownscalableExplanation
                  text={downscalableOption}
                  isPossible={isDownscalePossible}
                />
              )}
              <RichContent blocks={content.downscaling.description} />
            </Box>
          </ContentBlock>
        </MaxWidth>

        <Box
          display="grid"
          gridTemplateColumns={{ _: undefined, md: 'repeat(3, 1fr)' }}
          css={css({ columnGap: 5 })}
          mb={5}
          maxWidth={{ _: 'contentWidth', md: 1100 }}
          mx="auto"
          px={4}
        >
          <MiniTrend
            title={siteText.afschaling.trend_grafieken.reproductiegetal}
            icon={<Repro />}
            isBelowThreshold={reproduction_is_below_threshold}
            thresholdDaySpan={reproduction_threshold_day_span}
          >
            <TimeSeriesMiniBarChart
              initialWidth={300}
              height={100}
              values={data.reproduction.values
                .filter((x) => x.index_average)
                .slice(-14)}
              seriesConfig={{
                type: 'bar',
                metricProperty: 'index_average',
                label: siteText.afschaling.trend_grafieken.reproductiegetal,
                color: colors.data.positive,
                fillOpacity: 1,
                aboveBenchmarkColor: colors.data.negative,
                aboveBenchmarkFillOpacity: 1,
              }}
              dataOptions={{
                benchmark: {
                  value: 1,
                },
              }}
            />
          </MiniTrend>

          <MiniTrend
            title={siteText.afschaling.trend_grafieken.ic_opnames}
            icon={<Arts />}
            isBelowThreshold={intensive_care_nice_is_below_threshold}
            thresholdDaySpan={intensive_care_nice_threshold_day_span}
          >
            <TimeSeriesMiniBarChart
              initialWidth={300}
              height={100}
              values={data.intensive_care_nice.values
                .filter((x) => x.admissions_on_date_of_reporting)
                .slice(-14)}
              seriesConfig={{
                type: 'bar',
                metricProperty: 'admissions_on_date_of_reporting',
                label: siteText.afschaling.trend_grafieken.reproductiegetal,
                color: colors.data.positive,
                fillOpacity: 1,
                aboveBenchmarkColor: colors.data.negative,
                aboveBenchmarkFillOpacity: 1,
              }}
              dataOptions={{
                benchmark: {
                  value: 20,
                },
              }}
            />
          </MiniTrend>

          <MiniTrend
            title={siteText.afschaling.trend_grafieken.ziekenhuisopnames}
            icon={<Ziekenhuis />}
            isBelowThreshold={hospital_nice_is_below_threshold}
            thresholdDaySpan={hospital_nice_threshold_day_span}
          >
            <TimeSeriesMiniBarChart
              initialWidth={300}
              height={100}
              values={data.hospital_nice.values
                .filter((x) => x.admissions_on_date_of_reporting)
                .slice(-14)}
              seriesConfig={{
                type: 'bar',
                metricProperty: 'admissions_on_date_of_reporting',
                label: siteText.afschaling.trend_grafieken.reproductiegetal,
                color: colors.data.positive,
                fillOpacity: 1,
                aboveBenchmarkColor: colors.data.negative,
                aboveBenchmarkFillOpacity: 1,
              }}
              dataOptions={{
                benchmark: {
                  value: 80,
                },
              }}
            />
          </MiniTrend>
        </Box>

        <MaxWidth>
          <ContentBlock spacing={3}>
            <Heading level={2} fontSize={3}>
              {content.measures.title}
            </Heading>
            <RichContent blocks={content.measures.description} />
          </ContentBlock>
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default Afschaling;

interface MiniTrendProps {
  title: string;
  icon: ReactNode;
  isBelowThreshold: boolean;
  thresholdDaySpan: number;
  children: ReactNode;
}

function MiniTrend({
  title,
  icon,
  isBelowThreshold,
  thresholdDaySpan,
  children,
}: MiniTrendProps) {
  const { siteText } = useIntl();

  return (
    <Box mb={{ _: 3, md: 0 }} display="flex" flexDirection="column">
      <Box display="flex" alignItems="center" mb={1}>
        <Box width={25}>{icon}</Box>
        <Text fontWeight="bold" mb={0}>
          {title}
        </Text>
      </Box>
      <Box display="flex" mb={3}>
        <Box
          height={18}
          minWidth={18}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={isBelowThreshold ? 'cerulean' : 'red'}
          mr={2}
          mt="2px"
          borderRadius="50%"
          css={css({
            svg: {
              padding: '2px',
            },
            path: {
              fill: 'white',
            },
          })}
        >
          {isBelowThreshold ? (
            <IconDown />
          ) : (
            <Box width={8} height={2} bg="white" />
          )}
        </Box>
        <Text mb={0}>
          {isBelowThreshold
            ? replaceVariablesInText(
                siteText.afschaling.trend_grafieken.grenswaarde_minder,
                {
                  days: thresholdDaySpan,
                }
              )
            : siteText.afschaling.trend_grafieken.grenswaarde_meer}
        </Text>
      </Box>
      <Box mt="auto">{children}</Box>
    </Box>
  );
}

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
