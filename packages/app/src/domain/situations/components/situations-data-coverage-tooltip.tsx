import {
  VrCollectionSituations,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import Check from '~/assets/check.svg';
import Cross from '~/assets/cross.svg';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LegendIcon } from './legend-icon';

export function SituationsDataCoverageTooltip({
  context,
}: {
  context: VrGeoProperties & VrCollectionSituations;
}) {
  const { siteText } = useIntl();
  const text = siteText.brononderzoek;
  const reverseRouter = useReverseRouter();

  const { has_sufficient_data } = context;

  const Icon = has_sufficient_data ? Check : Cross;
  const color = has_sufficient_data ? 'data.primary' : 'gray';
  const label = has_sufficient_data
    ? text.situaties_kaarten_uitkomsten.tooltip.voldoende_data
    : text.situaties_kaarten_uitkomsten.tooltip.onvoldoende_data;

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.brononderzoek(context.vrcode)}
    >
      <Box
        m={0}
        spacingHorizontal={2}
        css={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'pre-wrap',
        })}
      >
        <LegendIcon color={color}>
          <Icon />
        </LegendIcon>
        <InlineText color={color} fontWeight="bold">
          {label}
        </InlineText>
      </Box>
    </TooltipContent>
  );
}
