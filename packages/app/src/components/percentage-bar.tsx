import styled from 'styled-components';
import { css } from '@styled-system/css';

interface PercentageProps {
  percentage: number;
  height?: number | string;
}

const Wrapper = styled.div(
  css({
    minWidth: '4em',
    width: '100%',
  })
);

const Bar = styled.div<{ height?: number | string }>((x) =>
  css({
    backgroundColor: 'currentcolor',
    height: x.height ?? '0.8em',
  })
);

export function PercentageBar({ percentage, height }: PercentageProps) {
  return (
    <Wrapper>
      <Bar style={{ width: `${percentage}%` }} height={height} />
    </Wrapper>
  );
}
