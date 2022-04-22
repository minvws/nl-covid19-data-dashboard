import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Down, Up } from '@corona-dashboard/icons';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Container, IconContainer } from './containers';

export function InlineDifference({
  value,
  isAmount,
}: {
  value: DifferenceDecimal | DifferenceInteger;
  isAmount: boolean;
}) {
  const { commonTexts } = useIntl();
  const text = commonTexts.trend;

  if (value.difference > 0)
    return (
      <Container>
        <BoldText>{isAmount ? text.trend_meer : text.trend_hoger}</BoldText>
        <IconContainer color="red">
          <Up />
        </IconContainer>
      </Container>
    );
  if (value.difference < 0)
    return (
      <Container>
        <BoldText>{isAmount ? text.trend_minder : text.trend_lager}</BoldText>
        <IconContainer color="data.primary">
          <Down />
        </IconContainer>
      </Container>
    );

  return (
    <Container>
      <BoldText>{text.trend_gelijk}</BoldText>
    </Container>
  );
}
