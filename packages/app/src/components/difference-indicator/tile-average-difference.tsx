import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Gelijk } from '@corona-dashboard/icons';
import { Up } from '@corona-dashboard/icons';
import { Down } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function TileAverageDifference({
  value,
  isPercentage,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
}) {
  const { difference, old_value } = value;
  const { siteText, formatNumber } = useIntl();

  const oldValue = (
    <InlineText fontWeight="bold">{` (${formatNumber(old_value)}${
      isPercentage ? '%' : ''
    })`}</InlineText>
  );

  if (difference > 0)
    return (
      <Container>
        <IconContainer color="red">
          <Up />
        </IconContainer>
        <InlineText fontWeight="bold">
          {formatNumber(Math.abs(difference))} {siteText.toe_en_afname.hoger}{' '}
        </InlineText>
        <InlineText>
          {siteText.toe_en_afname.zeven_daags_gemiddelde}
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
          {formatNumber(Math.abs(difference))} {siteText.toe_en_afname.lager}{' '}
        </InlineText>
        <InlineText>
          {siteText.toe_en_afname.zeven_daags_gemiddelde}
          {oldValue}
        </InlineText>
      </Container>
    );

  return (
    <Container>
      <IconContainer color="data.neutral">
        <Gelijk />
      </IconContainer>
      <InlineText fontWeight="bold">
        {siteText.toe_en_afname.gelijk}{' '}
      </InlineText>
      <InlineText>
        {siteText.toe_en_afname.zeven_daags_gemiddelde}
        {oldValue}
      </InlineText>
    </Container>
  );
}
