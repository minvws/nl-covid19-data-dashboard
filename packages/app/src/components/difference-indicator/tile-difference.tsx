import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import IconGelijk from '~/assets/gelijk.svg';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';
import { InlineText } from '~/components/typography';

export function TileDifference({
  value,
  isDecimal,
  staticTimespan,
  maximumFractionDigits,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
  staticTimespan?: string;
}) {
  const { siteText, formatNumber, formatPercentage } = useIntl();
  const text = siteText.toe_en_afname;

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
    : formatNumber(Math.abs(difference));

  const timespanTextNode = staticTimespan ?? text.vorige_waarde;

  if (difference > 0) {
    const splitText = text.toename.split(' ');

    return (
      <Container>
        <IconContainer color="red" mr={1}>
          <IconUp />
        </IconContainer>
        <InlineText fontWeight="bold">
          {differenceFormattedString} {splitText[0]}
        </InlineText>
        <InlineText color="annotation">
          {splitText[1]} {timespanTextNode}
        </InlineText>
      </Container>
    );
  }

  if (difference < 0) {
    const splitText = text.afname.split(' ');

    return (
      <Container>
        <IconContainer color="data.primary" mr={1}>
          <IconDown />
        </IconContainer>
        <InlineText fontWeight="bold">
          {differenceFormattedString} {splitText[0]}
        </InlineText>
        <InlineText>
          {splitText[1]} {timespanTextNode}
        </InlineText>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="lightGray" mr={1}>
        <IconGelijk />
      </IconContainer>
      <InlineText>
        {text.gelijk} {timespanTextNode}
      </InlineText>
    </Container>
  );
}
