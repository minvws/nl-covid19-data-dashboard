import {
  VrCollectionSituations,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import Check from '~/assets/check.svg';
import Cross from '~/assets/cross.svg';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { VrChoropleth } from '~/components/choropleth';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { Color } from '~/style/theme';
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
    <ChartTile
      title={text.situaties_kaarten_uitkomsten.titel}
      metadata={{
        date: [date_start_unix, date_end_unix],
        source: text.bronnen.rivm,
      }}
    >
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        as="figure"
        height="100%"
      >
        <Box flex={{ lg: 1 }} as="figcaption">
          <Markdown
            content={replaceVariablesInText(
              text.situaties_kaarten_uitkomsten.beschrijving,
              { date_from, date_to }
            )}
          />
          <Spacer mb={4} />
          <Box spacing={3}>
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
              <VrChoropleth
                accessibility={{
                  key: 'situations_has_sufficient_data_choropleth',
                }}
                data={data}
                getLink={reverseRouter.vr.brononderzoek}
                metricName="situations"
                metricProperty="has_sufficient_data"
                tooltipContent={(
                  context: VrGeoProperties & VrCollectionSituations
                ) => <SituationsDataCoverageTooltip context={context} />}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </ChartTile>
  );
}

function LegendItem({
  color,
  icon,
  title,
  description,
}: {
  color: Color;
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <Box display="flex" css={css({ gap: '.5rem' })}>
      <LegendIcon color={color}>{icon}</LegendIcon>
      <Box spacing={1}>
        <Text color={color} fontWeight="bold">
          {title}
        </Text>
        <Text>{description}</Text>
      </Box>
    </Box>
  );
}
