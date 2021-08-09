import { css } from '@styled-system/css';
import styled from 'styled-components';

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

export function PercentageBar({ percentage, height }: PercentageProps) {
  const minWidth = percentage > 0 ? '2px' : undefined;
  return (
    <Wrapper>
      <Bar
        style={{ width: `${percentage}%` }}
        height={height}
        minWidth={minWidth}
      />
    </Wrapper>
  );
}

const Bar = styled.div<{ height?: number | string; minWidth?: string }>((x) =>
  css({
    backgroundColor: 'currentcolor',
    height: x.height ?? '0.8em',
    minWidth: x.minWidth,
  })
);
