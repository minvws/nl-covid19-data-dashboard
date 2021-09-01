import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Up } from '@corona-dashboard/icons';
import { Down } from '@corona-dashboard/icons';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function InlineDifference({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
  const { siteText } = useIntl();
  const text = siteText.common_actueel;

  if (value.difference > 0)
    return (
      <Container>
        <InlineText fontWeight="bold">{text.trend_hoger}</InlineText>
        <IconContainer color="red">
          <Up />
        </IconContainer>
      </Container>
    );
  if (value.difference < 0)
    return (
      <Container>
        <InlineText fontWeight="bold">{text.trend_lager}</InlineText>
        <IconContainer color="data.primary">
          <Down />
        </IconContainer>
      </Container>
    );

  return (
    <Container>
      <InlineText fontWeight="bold">{text.trend_gelijk}</InlineText>
    </Container>
  );
}
