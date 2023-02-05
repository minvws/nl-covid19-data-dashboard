import { ChoroplethThresholdsValue, colors, VrCollectionSituations } from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TooltipSubject } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { fontSizes, fontWeights, space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SituationIcon } from './components/situation-icon';
import { useSituations } from './logic/situations';

interface SmallMultiplesChoroplethTileProps {
  data: VrCollectionSituations[];
  text: SiteText['pages']['situations_page']['shared'];
}

export function SituationsOverviewChoroplethTile({ data, text }: SmallMultiplesChoroplethTileProps) {
  const { formatDateSpan } = useIntl();
  const situations = useSituations(text.situaties);
  const singleValue = data[0];

  const breakpoints = useBreakpoints();

  const [date_from, date_to] = formatDateSpan({ seconds: singleValue.date_start_unix }, { seconds: singleValue.date_end_unix });

  return (
    <ChartTile
      title={text.titel}
      description={replaceVariablesInText(text.situaties_kaarten_overzicht.beschrijving, { date_from, date_to })}
      metadata={{
        date: [singleValue.date_start_unix, singleValue.date_end_unix],
        source: text.bronnen.rivm,
      }}
    >
      <Box spacing={4}>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(256px,1fr))" marginBottom={space[3]} css={css({ gap: '20px' })}>
          <Box>
            <ChoroplethLegenda title={text.situaties_kaarten_overzicht.legenda.titel} thresholds={thresholds.vr.gathering} />
          </Box>
          <Box display="flex" alignItems="flex-end">
            <Box display="flex" alignItems="baseline" height="42px">
              <Box size={15} marginRight={space[2]} backgroundColor={colors.gray2} position="relative" top={'3px'} />
              <InlineText variant="label1">{text.situaties_kaarten_overzicht.legenda.onvoldoende_data}</InlineText>
            </Box>
          </Box>
        </Box>
        <ChoroplethGrid>
          {situations.map((situation) => (
            <ChoroplethGridItem icon={<SituationIcon id={situation.id} />} title={situation.title} description={situation.description} key={situation.id}>
              <DynamicChoropleth
                accessibility={{ key: 'situations_choropleths' }}
                map="vr"
                data={data}
                dataConfig={{
                  metricName: 'situations',
                  metricProperty: situation.id,
                  noDataFillColor: colors.gray2,
                }}
                dataOptions={{
                  isPercentage: true,
                }}
                minHeight={breakpoints.sm ? 280 : 260}
                tooltipPlacement="top-center"
                formatTooltip={(context) => (
                  <ChoroplethTooltip
                    isPercentage
                    value={context.dataItem[situation.id]}
                    regionName={context.featureName}
                    thresholds={thresholds.vr[situation.id]}
                    noDataFillColor={colors.gray2}
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

function ChoroplethTooltip({ value, isPercentage, regionName, thresholds, noDataFillColor }: ChoroplethTooltipProps) {
  const intl = useIntl();

  return (
    <Box paddingX={space[3]} paddingY={space[2]} aria-live="polite">
      <TooltipSubject thresholdValues={thresholds} filterBelow={value} noDataFillColor={noDataFillColor}>
        <Box
          as="span"
          css={css({
            whiteSpace: 'nowrap',
          })}
        >
          {regionName + ': '}
        </Box>
        <Box as="span" display="inline-block" fontWeight="bold" textAlign="right" paddingX={space[1]} flexShrink={0}>
          {typeof value === 'number' ? (isPercentage ? intl.formatPercentage(value) + '%' : value) : '–'}
        </Box>
      </TooltipSubject>
    </Box>
  );
}

const ChoroplethGrid = styled.div(
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
    gap: space[4],
  })
);

function ChoroplethGridItem({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
  return (
    <Box
      /** add a little bit of bottom-padding to match whitespace from design */
      paddingBottom={space[2]}
    >
      <Box display="flex" justifyContent="center" alignItems="center" spacingHorizontal={2} marginBottom={space[3]}>
        {icon}
        <InlineTooltip content={description} css={css({ fontWeight: fontWeights.heavy, fontSize: fontSizes[2] })}>
          {title}
        </InlineTooltip>
      </Box>

      <div>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </Box>
  );
}
