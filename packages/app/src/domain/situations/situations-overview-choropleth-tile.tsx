import {
  SafetyRegionProperties,
  VrCollectionSituations,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ChartTile } from '~/components/chart-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { useIntl } from '~/intl';
import { SituationIcon } from './logic/situation-icon';
import { SituationKey, situations } from './logic/situations';

import MeerInformatie from '~/assets/meer-informatie.svg';
import { Box } from '~/components/base';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { InlineText } from '~/components/typography';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { regionThresholds } from '~/components/choropleth/region-thresholds';

interface SmallMultiplesChoroplethTileProps {
  data: VrCollectionSituations[];
}

export function SituationsOverviewChoroplethTile({
  data,
}: SmallMultiplesChoroplethTileProps) {
  const intl = useIntl();
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
      <ChoroplethGrid>
        {situations.map((situationId) => (
          <ChoroplethGridItem id={situationId} key={situationId}>
            <SafetyRegionChoropleth
              data={{ situations: data }}
              metricName={'situations'}
              metricProperty={situationId}
              minHeight={200}
              tooltipPlacement="top-center"
              tooltipContent={(
                context: SafetyRegionProperties & VrCollectionSituations
              ) => (
                <Tooltip
                  isPercentage
                  value={context[situationId]}
                  regionName={context.vrname}
                  thresholds={regionThresholds.situations[situationId]}
                />
              )}
            />
          </ChoroplethGridItem>
        ))}
      </ChoroplethGrid>
    </ChartTile>
  );
}

function Tooltip({ value, isPercentage, regionName, thresholds }: any) {
  const intl = useIntl();
  return (
    <Box px={3} py={2} display="inline-block">
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
  children,
  id: id,
}: {
  children: ReactNode;
  id: SituationKey;
}) {
  const intl = useIntl();
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
        <SituationIcon id={id} />
        <span css={css({ fontWeight: 'heavy', fontSize: 2 })}>
          {intl.siteText.brononderzoek.situaties[id].titel}
        </span>
        <MeerInformatie />
      </Box>

      <div>{children}</div>
    </Box>
  );
}
