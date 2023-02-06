import { VrCollectionSituations } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Check } from '@corona-dashboard/icons';
import { Cross } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { BoldText } from '~/components/typography';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LegendIcon } from './legend-icon';
import { SiteText } from '~/locale';

export function SituationsDataCoverageTooltip({
  context,
  text,
}: {
  context: TooltipData<VrCollectionSituations>;
  text: SiteText['pages']['situations_page']['shared']['situaties_kaarten_uitkomsten'];
}) {
  const reverseRouter = useReverseRouter();

  const { has_sufficient_data } = context.dataItem;

  const Icon = has_sufficient_data ? Check : Cross;
  const color = has_sufficient_data ? 'primary' : 'gray5';
  const label = has_sufficient_data ? text.tooltip.voldoende_data : text.tooltip.onvoldoende_data;

  return (
    <TooltipContent title={context.featureName} link={reverseRouter.vr.brononderzoek(context.dataItem.vrcode)}>
      <Box
        margin="0"
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
        <BoldText color={color}>{label}</BoldText>
      </Box>
    </TooltipContent>
  );
}
