import {
  SafetyRegionProperties,
  VrCollectionSituations,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import Check from '~/assets/check.svg';
import Cross from '~/assets/cross.svg';
import { Box } from '~/components/base';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { ErrorBoundary } from '~/components/error-boundary';
import { FullscreenChartTile } from '~/components/fullscreen-chart-tile';
import { Markdown } from '~/components/markdown';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LegendIcon } from './components/legend-icon';
import { SituationsDataCoverageTooltip } from './components/situations-data-coverage-tooltip';

interface SituationsDataCoverageChoroplethTileProps {
  data: {
    situations: VrCollectionSituations[];
  };
}

export function SituationsDataCoverageChoroplethTile({
  data,
}: SituationsDataCoverageChoroplethTileProps) {
  const { siteText, formatDateSpan } = useIntl();
  const reverseRouter = useReverseRouter();

  const text = siteText.brononderzoek;
  const { date_start_unix, date_end_unix } = data.situations[0];

  const [date_from, date_to] = formatDateSpan(
    { seconds: date_start_unix },
    { seconds: date_end_unix }
  );

  return (
    <FullscreenChartTile
      metadata={{
        date: [date_start_unix, date_end_unix],
        source: text.bronnen.rivm,
      }}
    >
      <Heading level={3}>{text.situaties_kaarten_uitkomsten.titel}</Heading>
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        m={0}
        as="figure"
        height="100%"
      >
        <Box mb={3} flex={{ lg: 1 }} as="figcaption">
          <Box mb={[0, 4]}>
            <Markdown
              content={replaceVariablesInText(
                text.situaties_kaarten_uitkomsten.beschrijving,
                {
                  date_from,
                  date_to,
                }
              )}
            />
          </Box>
          <Box>
            <LegendItem
              color="data.primary"
              icon={<Check />}
              title={
                text.situaties_kaarten_uitkomsten.legenda.voldoende_data.titel
              }
              description={
                text.situaties_kaarten_uitkomsten.legenda.voldoende_data
                  .omschrijving
              }
            />
            <LegendItem
              color="gray"
              icon={<Cross />}
              title={
                text.situaties_kaarten_uitkomsten.legenda.onvoldoende_data.titel
              }
              description={
                text.situaties_kaarten_uitkomsten.legenda.onvoldoende_data
                  .omschrijving
              }
            />
          </Box>
        </Box>
        <Box
          flex={{ lg: 1 }}
          ml={[0, 0, 3]}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <Box height="100%">
            <ErrorBoundary>
              <SafetyRegionChoropleth
                accessibility={{
                  key: 'situations_has_sufficient_data_choropleth',
                }}
                data={data}
                getLink={reverseRouter.vr.brononderzoek}
                metricName="situations"
                metricProperty="has_sufficient_data"
                tooltipContent={(
                  context: SafetyRegionProperties & VrCollectionSituations
                ) => <SituationsDataCoverageTooltip context={context} />}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </FullscreenChartTile>
  );
}

function LegendItem({
  color,
  icon,
  title,
  description,
}: {
  color: string;
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <Box display="flex" css={css({ gap: '.5rem' })}>
      <LegendIcon color={color}>{icon}</LegendIcon>
      <Box>
        <Text color={color} fontWeight="bold" mb={1}>
          {title}
        </Text>
        <Text>{description}</Text>
      </Box>
    </Box>
  );
}
