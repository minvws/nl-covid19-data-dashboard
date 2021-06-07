import {
  SafetyRegionProperties,
  VrCollectionSituations,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SituationIcon } from './components/situation-icon';
import { useSituations } from './logic/situations';

interface SmallMultiplesChoroplethTileProps {
  data: VrCollectionSituations[];
}

export function SituationsOverviewChoroplethTile({
  data,
}: SmallMultiplesChoroplethTileProps) {
  const intl = useIntl();
  const situations = useSituations();
  const text = intl.siteText.brononderzoek;
  const singleValue = data[0];

  const [date_from, date_to] = intl.formatDateSpan(
    { seconds: singleValue.date_start_unix },
    { seconds: singleValue.date_end_unix }
  );

  return (
    <ChartTile
      title={text.titel}
      description={replaceVariablesInText(
        text.situaties_kaarten_overzicht.beschrijving,
        { date_from, date_to }
      )}
      metadata={{
        date: [singleValue.date_start_unix, singleValue.date_end_unix],
        source: text.bronnen.rivm,
      }}
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px,1fr))"
        mb={3}
        css={css({ gap: 20 })}
      >
        <Box>
          <ChoroplethLegenda
            title={text.situaties_kaarten_overzicht.legenda.titel}
            thresholds={regionThresholds.situations.gathering}
          />
        </Box>
        <Box display="flex" alignItems="flex-end">
          <Box display="flex" alignItems="baseline" height={42}>
            <Box
              size={15}
              mr={2}
              bg={colors.data.underReported}
              position="relative"
              top={'3px'}
            />
            <InlineText m={0} fontSize={1}>
              {text.situaties_kaarten_overzicht.legenda.onvoldoende_data}
            </InlineText>
          </Box>
        </Box>
      </Box>
      <ChoroplethGrid>
        {situations.map((situation) => (
          <ChoroplethGridItem
            icon={<SituationIcon id={situation.id} />}
            title={situation.title}
            description={situation.description}
            key={situation.id}
          >
            <SafetyRegionChoropleth
              data={{ situations: data }}
              metricName={'situations'}
              metricProperty={situation.id}
              minHeight={200}
              tooltipPlacement="top-center"
              noDataFillColor={colors.data.underReported}
              tooltipContent={(
                context: SafetyRegionProperties & VrCollectionSituations
              ) => (
                <ChoroplethTooltip
                  isPercentage
                  value={context[situation.id]}
                  regionName={context.vrname}
                  thresholds={regionThresholds.situations[situation.id]}
                />
              )}
            />
          </ChoroplethGridItem>
        ))}
      </ChoroplethGrid>
    </ChartTile>
  );
}

function ChoroplethTooltip({
  value,
  isPercentage,
  regionName,
  thresholds,
}: any) {
  const intl = useIntl();
  return (
    <Box px={3} py={2} display="inline-block" aria-live="polite">
      <TooltipSubject thresholdValues={thresholds} filterBelow={value}>
        {regionName + ': '}
        <InlineText
          ml={3}
          display="inline-block"
          textAlign="right"
          fontWeight="heavy"
        >
          {typeof value === 'number'
            ? isPercentage
              ? intl.formatPercentage(value) + '%'
              : value
            : '–'}
        </InlineText>
      </TooltipSubject>
    </Box>
  );
}

const ChoroplethGrid = styled.div(
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
    gap: 4,
  })
);

function ChoroplethGridItem({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Box
      /** add a little bit of bottom-padding to match whitespace from design */
      pb={2}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        spacingHorizontal
        mb={3}
      >
        {icon}
        <InlineTooltip
          content={description}
          css={css({ fontWeight: 'heavy', fontSize: 2 })}
        >
          {title}
        </InlineTooltip>
      </Box>

      <div>{children}</div>
    </Box>
  );
}
