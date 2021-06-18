import { assert } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import Locatie from '~/assets/locatie.svg';
import { Box } from '~/components/base';
import { TooltipData } from '~/components/time-series-chart/components';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { MergedSewerType } from '../new-logic';

/**
 * A specific tooltip for when you've selected a location. It contains an icon
 * and some extra text.
 */
export function LocationTooltip({
  data,
}: {
  data: TooltipData<MergedSewerType>;
}) {
  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();

  const config = data.config.find((x) => x.type === 'line');

  assert(config, 'Failed to find line configuration in location tooltip');

  const dateString = formatDateFromSeconds(data.value.date_unix, 'day-month');

  return (
    <>
      <VisuallyHidden>{dateString}</VisuallyHidden>
      <Box fontSize={1} display="flex" alignItems="center">
        <StyledLocationIcon>
          <Locatie />
        </StyledLocationIcon>
        <b>{config.label}</b>
        <Box mx={2}>{siteText.waarde_annotaties.per_100_000_inwoners}:</Box>

        <strong>
          {formatNumber(data.value.selected_installation_rna_normalized)}
        </strong>
      </Box>
    </>
  );
}

// const TooltipList = styled.ol`
//   margin: 0;
//   padding: 0;
//   list-style: none;
// `;

// const TooltipListItem = styled.li<{ mt?: number }>((props: { mt?: number }) =>
//   css({
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     mt: props.mt,
//   })
// );

// const TooltipValueContainer = styled.span(
//   css({
//     fontWeight: 'bold',
//     ml: '1em',
//   })
// );

const StyledLocationIcon = styled.span(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    mr: 2,

    svg: {
      pt: '3px',
      color: 'black',
      width: '1em',
      // border: '1px solid hotpink',
    },
  })
);
