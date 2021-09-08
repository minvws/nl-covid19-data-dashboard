import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Gelijk, Up } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function TileAverageDifference({
  value,
  isPercentage,
  isAmount,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
  isAmount: boolean;
}) {
  const { difference, old_value } = value;
  const { siteText, formatNumber } = useIntl();

  const oldValue = (
    <InlineText fontWeight="bold">{` (${formatNumber(old_value)}${
      isPercentage ? '%' : ''
    })`}</InlineText>
  );

  const text = siteText.toe_en_afname;

  if (difference > 0)
    return (
      <Container>
        <IconContainer color="red">
          <Up />
        </IconContainer>
        <InlineText fontWeight="bold">
          {formatNumber(Math.abs(difference))}{' '}
          {isAmount ? text.toename : text.hoger}{' '}
        </InlineText>
        <InlineText>
          {text.zeven_daags_gemiddelde}
          {oldValue}
        </InlineText>
      </Container>
    );

  if (difference < 0)
    return (
      <Container>
        <IconContainer color="data.primary">
          <Down />
        </IconContainer>
        <InlineText fontWeight="bold">
          {formatNumber(Math.abs(difference))}{' '}
          {isAmount ? text.afname : text.lager}{' '}
        </InlineText>
        <InlineText>
          {text.zeven_daags_gemiddelde}
          {oldValue}
        </InlineText>
      </Container>
    );

  return (
    <Container>
      <IconContainer color="data.neutral">
        <Gelijk />
      </IconContainer>
      <InlineText fontWeight="bold">{text.gelijk} </InlineText>
      <InlineText>
        {text.zeven_daags_gemiddelde}
        {oldValue}
      </InlineText>
    </Container>
  );
}
