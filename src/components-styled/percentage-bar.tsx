import styled from 'styled-components';
import { css } from '@styled-system/css';

interface PercentageProps {
  percentage: number;
}

const Wrapper = styled.div(
  css({
    minWidth: '4em',
  })
);

const Bar = styled.div(
  css({
    backgroundColor: 'currentcolor',
    height: '0.8em',
  })
);

export function PercentageBar({ percentage }: PercentageProps) {
  return (
    <Wrapper>
      <Bar style={{ width: `${percentage}%` }} />
    </Wrapper>
  );
}
