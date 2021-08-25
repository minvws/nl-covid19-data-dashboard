import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { ReactComponent as IconGelijk } from '~/assets/gelijk.svg';
import { ReactComponent as IconUp } from '~/assets/pijl-omhoog.svg';
import { ReactComponent as IconDown } from '~/assets/pijl-omlaag.svg';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function TileDifference({
  value,
  isDecimal,
  staticTimespan,
  maximumFractionDigits,
  isPercentage,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
  staticTimespan?: string;
  isPercentage?: boolean;
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
          {differenceFormattedString}
          {isPercentage ? '%' : ''} {splitText[0]}
        </InlineText>{' '}
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
          {differenceFormattedString}
          {isPercentage ? '%' : ''} {splitText[0]}
        </InlineText>{' '}
        <InlineText>
          {splitText[1]} {timespanTextNode}
        </InlineText>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="data.neutral" mr={1}>
        <IconGelijk />
      </IconContainer>
      <InlineText>
        {text.gelijk}
        {timespanTextNode}
      </InlineText>
    </Container>
  );
}
