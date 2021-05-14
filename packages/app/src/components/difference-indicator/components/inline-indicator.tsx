import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import IconGelijk from '~/assets/gelijk.svg';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { InlineText } from '~/components/typography';

export function InlineIndicator({
  value,
  isDecimal,
  maximumFractionDigits,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
}) {
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const text = siteText.toe_en_afname;

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
    : formatNumber(Math.abs(difference));

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <InlineText fontWeight="bold">{differenceFormattedString}</InlineText>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
        <InlineText>{splitText[0]}</InlineText>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    return (
      <Container>
        <InlineText fontWeight="bold">{differenceFormattedString}</InlineText>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
        <InlineText>{splitText[0]}</InlineText>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="lightGray">
        <IconGelijk />
      </IconContainer>
      <InlineText>{text.gelijk}</InlineText>
    </Container>
  );
}
