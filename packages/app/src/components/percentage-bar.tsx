import { css } from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

interface PercentageProps {
  percentage: number;
  height?: number | string;
  color?: string;
  hasFullWidthBackground?: boolean;
  fullWidthBackgroundColor?: string;
  hasFullWidthStripedBackground?: boolean;
  fullWidthStripedBackgroundColor?: string;
}

export function PercentageBar({
  percentage,
  height,
  color,
  hasFullWidthBackground,
  fullWidthBackgroundColor = 'data.underReported',
  hasFullWidthStripedBackground,
  fullWidthStripedBackgroundColor = '#8fcae7',
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

      {hasFullWidthStripedBackground && (
        <Box
          css={css({
            // Created by https://stripesgenerator.com/
            backgroundImage: `linear-gradient(45deg, ${fullWidthStripedBackgroundColor} 30%, #ffffff 30%, #ffffff 50%, ${fullWidthStripedBackgroundColor} 50%, ${fullWidthStripedBackgroundColor} 80%, #ffffff 80%, #ffffff 100%)`,
            backgroundSize: '7.07px 7.07px',
          })}
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
        />
      )}

      {hasFullWidthBackground && (
        <Box
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          backgroundColor={fullWidthBackgroundColor}
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
