import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Gelijk } from '@corona-dashboard/icons';
import { Up } from '@corona-dashboard/icons';
import { Down } from '@corona-dashboard/icons';
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
          <Up />
        </IconContainer>
      </Container>
    );
  }

  if (difference < 0) {
    return (
      <Container>
        <IconContainer color="data.primary">
          <Down />
        </IconContainer>
      </Container>
    );
  }

  return (
    <Container>
      <IconContainer color="data.neutral">
        <Gelijk />
      </IconContainer>
    </Container>
  );
}
