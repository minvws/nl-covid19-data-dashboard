import { Color, VrCollectionSituations } from '@corona-dashboard/common';
import { Check, Cross } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Box, Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LegendIcon } from './components/legend-icon';
import { SituationsDataCoverageTooltip } from './components/situations-data-coverage-tooltip';

interface SituationsDataCoverageChoroplethTileProps {
  data: {
    situations: VrCollectionSituations[];
  };
  text: SiteText['pages']['situationsPage']['shared'];
  tooltipText: SiteText['choropleth_tooltip']['patients'];
}

export function SituationsDataCoverageChoroplethTile({
  data,
  text,
  tooltipText,
}: SituationsDataCoverageChoroplethTileProps) {
  const { formatDateSpan } = useIntl();
  const reverseRouter = useReverseRouter();
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
              <DynamicChoropleth
                accessibility={{
                  key: 'situations_has_sufficient_data_choropleth',
                }}
                map="vr"
                data={data.situations}
                dataConfig={{
                  metricName: 'situations',
                  metricProperty: 'has_sufficient_data',
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.brononderzoek,
                  tooltipVariables: {
                    patients: tooltipText,
                  },
                }}
                formatTooltip={(context) => (
                  <SituationsDataCoverageTooltip
                    context={context}
                    text={text.situaties_kaarten_uitkomsten}
                  />
                )}
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
