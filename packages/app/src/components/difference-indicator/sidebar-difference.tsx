import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import IconGelijk from '~/assets/gelijk.svg';
import IconUp from '~/assets/pijl-omhoog.svg';
import IconDown from '~/assets/pijl-omlaag.svg';
import { Container, IconContainer } from './containers';

export function SidebarDifference({
  value,
}: {
  value: DifferenceDecimal | DifferenceInteger;
}) {
  const { difference } = value;

  if (difference > 0) {
    return (
      <Container>
        <IconContainer color="red">
          <IconUp />
        </IconContainer>
      </Container>
    );
  }

  if (difference < 0) {
    return (
      <Container>
        <IconContainer color="data.primary">
          <IconDown />
        </IconContainer>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="gray">
        <IconGelijk />
      </IconContainer>
    </Container>
  );
}
