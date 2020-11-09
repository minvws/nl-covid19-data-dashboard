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
    backgroundColor: 'blue',
    borderRadius: 1,
    height: '0.5em',
  })
);

export function PercentageBar({ percentage }: PercentageProps) {
  return (
    <Wrapper>
      <Bar style={{ width: `${percentage}%` }} />
    </Wrapper>
  );
}
