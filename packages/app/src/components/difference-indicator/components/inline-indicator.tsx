import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { IconContainer } from './containers';

export function InlineIndicator({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
  const { siteText } = useIntl();
  const text = siteText.common_actueel;

  if (value.difference > 0)
    return (
      <InlineContainer>
        <InlineText fontWeight="bold">{text.trend_hoger}</InlineText>
        <IconContainer color="data.primary">
          <IconUp />
        </IconContainer>
      </InlineContainer>
    );
  if (value.difference < 0)
    return (
      <InlineContainer>
        <InlineText fontWeight="bold">{text.trend_lager}</InlineText>
        <IconContainer color="red">
          <IconDown />
        </IconContainer>
      </InlineContainer>
    );

  return (
    <InlineContainer>
      <InlineText fontWeight="bold">{text.trend_gelijk}</InlineText>
    </InlineContainer>
  );
}

// const Container = styled.span(
//   css({
//     display: 'inline-block',
//     fontSize: 2,
//     svg: {
//       mr: 1,
//       width: '1.2em',
//       verticalAlign: 'text-bottom',
//     },
//   })
// );

/**
 * The InlineIndicator uses a slightly different container from the other
 * flavors that use the shared container from ./components/containers.
 */
const InlineContainer = styled.span(
  css({
    display: 'inline-block',
    whiteSpace: 'nowrap',
    // fontWeight: 'bold',

    svg: {
      // color: x.iconColor,
      verticalAlign: 'text-bottom',
      width: '19px',
      height: '19px',
    },
  })
);
