import { assert } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Location } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { TooltipData } from '~/components/time-series-chart/components';
import { VisuallyHidden } from '~/components';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { MergedSewerType } from '../logic';
import { fontSizes, space } from '~/style/theme';

/**
 * A specific tooltip for when you've selected a location. It contains an icon
 * and some extra text.
 */
export function LocationTooltip({ data }: { data: TooltipData<MergedSewerType> }) {
  const { commonTexts, formatNumber, formatDateFromSeconds } = useIntl();

  const config = data.config.find((x) => x.type === 'line');

  assert(config, `[${LocationTooltip.name}] Failed to find line configuration in location tooltip`);

  const dateString = formatDateFromSeconds(data.value.date_unix, 'weekday-long');

  return (
    <>
      <VisuallyHidden>{dateString}</VisuallyHidden>
      <Box fontSize={fontSizes[1]} display="flex" alignItems="center">
        <StyledLocationIcon>
          <Location />
        </StyledLocationIcon>
        <BoldText>{config.label}</BoldText>
        <Box marginX={space[2]}>{commonTexts.waarde_annotaties.per_100_000_inwoners}:</Box>

        <BoldText>{formatNumber(data.value.selected_installation_rna_normalized)}</BoldText>
      </Box>
    </>
  );
}

const StyledLocationIcon = styled.span(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    marginRight: space[2],

    svg: {
      paddingTop: '3px',
      color: 'black',
      width: '1em',
    },
  })
);
