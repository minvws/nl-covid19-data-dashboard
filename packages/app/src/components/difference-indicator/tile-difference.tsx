import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Gelijk, Up } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function TileDifference({
  value,
  isDecimal,
  maximumFractionDigits,
  isPercentage,
  showOldDateUnix,
  isAmount,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isDecimal?: boolean;
  maximumFractionDigits?: number;
  isPercentage?: boolean;
  showOldDateUnix?: boolean;
  isAmount: boolean;
}) {
  const { siteText, formatNumber, formatPercentage, formatDateFromSeconds } =
    useIntl();
  const text = siteText.toe_en_afname;

  const { difference } = value;

  const differenceFormattedString = isDecimal
    ? formatPercentage(
        Math.abs(difference),
        maximumFractionDigits ? { maximumFractionDigits } : undefined
      )
    : formatNumber(Math.abs(difference));

  const timespanTextNode = showOldDateUnix
    ? formatDateFromSeconds(value.old_date_unix)
    : text.vorige_waarde;

  if (difference > 0) {
    const splitText = isAmount
      ? text.toename.split(' ')
      : text.hoger.split(' ');

    return (
      <Container>
        <IconContainer color="red" mr={1}>
          <Up />
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
    const splitText = isAmount ? text.afname.split(' ') : text.lager.split(' ');

    return (
      <Container>
        <IconContainer color="data.primary" mr={1}>
          <Down />
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
        <Gelijk />
      </IconContainer>
      <InlineText>
        {text.gelijk}
        {timespanTextNode}
      </InlineText>
    </Container>
  );
}
