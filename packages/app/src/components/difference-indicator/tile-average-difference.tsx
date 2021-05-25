import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import IconGelijk from '~/assets/gelijk.svg';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function TileAverageDifference({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
  const { difference, old_value } = value;
  const { siteText, formatNumber } = useIntl();

  if (difference > 0)
    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
        <InlineText fontWeight="bold">
          {formatNumber(Math.abs(difference))} {siteText.toe_en_afname.hoger}{' '}
        </InlineText>
        <InlineText>
          {siteText.toe_en_afname.zeven_daags_gemiddelde}
          <InlineText fontWeight="bold">{` (${formatNumber(
            old_value
          )})`}</InlineText>
        </InlineText>
      </Container>
    );

  if (difference < 0)
    return (
      <Container>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
        <InlineText fontWeight="bold">
          {formatNumber(Math.abs(difference))} {siteText.toe_en_afname.lager}{' '}
        </InlineText>
        <InlineText>
          {siteText.toe_en_afname.zeven_daags_gemiddelde}
          <InlineText fontWeight="bold">{` (${formatNumber(
            old_value
          )})`}</InlineText>
        </InlineText>
      </Container>
    );

  return (
    <Container>
      <IconContainer color="data.neutral">
        <IconGelijk />
      </IconContainer>
      <InlineText fontWeight="bold">
        {siteText.toe_en_afname.gelijk}{' '}
      </InlineText>
      <InlineText>
        {siteText.toe_en_afname.zeven_daags_gemiddelde}
        <InlineText fontWeight="bold">{` (${formatNumber(
          old_value
        )})`}</InlineText>
      </InlineText>
    </Container>
  );
}
