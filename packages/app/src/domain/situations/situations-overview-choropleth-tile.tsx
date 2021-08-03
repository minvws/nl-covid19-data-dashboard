import {
  ChoroplethThresholdsValue,
  VrCollectionSituations,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { VrChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { vrThresholds } from '~/components/choropleth/logic';
import { TooltipSubject } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
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
      <Box spacing={4}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(256px,1fr))"
          mb={3}
          css={css({ gap: 20 })}
        >
          <Box>
            <ChoroplethLegenda
              title={text.situaties_kaarten_overzicht.legenda.titel}
              thresholds={vrThresholds.situations.gathering}
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
              <InlineText variant="label1">
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
              <VrChoropleth
                accessibility={{ key: 'situations_choropleths' }}
                data={{ situations: data }}
                metricName={'situations'}
                metricProperty={situation.id}
                minHeight={280}
                tooltipPlacement="top-center"
                noDataFillColor={colors.data.underReported}
                tooltipContent={(
                  context: VrGeoProperties & VrCollectionSituations
                ) => (
                  <ChoroplethTooltip
                    isPercentage
                    value={context[situation.id]}
                    regionName={context.vrname}
                    thresholds={vrThresholds.situations[situation.id]}
                    noDataFillColor={colors.data.underReported}
                  />
                )}
              />
            </ChoroplethGridItem>
          ))}
        </ChoroplethGrid>
      </Box>
    </ChartTile>
  );
}

interface ChoroplethTooltipProps {
  value: number | null;
  regionName: string;
  thresholds: ChoroplethThresholdsValue[];
  isPercentage: boolean;
  noDataFillColor?: string;
}

function ChoroplethTooltip({
  value,
  isPercentage,
  regionName,
  thresholds,
  noDataFillColor,
}: ChoroplethTooltipProps) {
  const intl = useIntl();
  return (
    <Box px={3} py={2} display="inline-block" aria-live="polite">
      <TooltipSubject
        thresholdValues={thresholds}
        filterBelow={value}
        noDataFillColor={noDataFillColor}
      >
        {regionName + ': '}
        <Box
          as="span"
          display="inline-block"
          fontWeight="bold"
          textAlign="right"
          px={1}
        >
          {typeof value === 'number'
            ? isPercentage
              ? intl.formatPercentage(value) + '%'
              : value
            : '–'}
        </Box>
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
        spacingHorizontal={2}
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

      <div>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </Box>
  );
}
