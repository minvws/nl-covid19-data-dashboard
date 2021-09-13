import { css } from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

interface PercentageProps {
  percentage: number;
  height?: number | string;
  color?: string;
  hasFullWidthBackground?: boolean;
  fullWidthBackgroundColor?: string;
}

export function PercentageBar({
  percentage,
  height,
  color,
  hasFullWidthBackground,
  fullWidthBackgroundColor,
}: PercentageProps) {
  const minWidth = percentage > 0 ? '2px' : undefined;
  return (
    <Wrapper>
      <Bar
        style={{ width: `${percentage}%` }}
        height={height}
        minWidth={minWidth}
        color={color}
      />

      {hasFullWidthBackground && (
        <Box
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          backgroundColor={
            fullWidthBackgroundColor
              ? fullWidthBackgroundColor
              : 'data.underReported'
          }
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div(
  css({
    display: 'flex',
    position: 'relative',
    minWidth: '4em',
    width: '100%',
  })
);

const Bar = styled.div<{
  height?: number | string;
  minWidth?: string;
  color?: string;
}>((x) =>
  css({
    backgroundColor: x.color ? x.color : 'currentcolor',
    height: x.height ?? '0.8em',
    minWidth: x.minWidth,
    zIndex: 3,
  })
);
