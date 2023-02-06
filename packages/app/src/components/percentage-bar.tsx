import { Box } from '~/components/base';
import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';

interface PercentageProps {
  percentage: number;
  height?: number | string;
  color?: string;
  backgroundStyle?: 'hatched' | 'normal';
  backgroundColor?: string;
}

export const PercentageBar = ({ percentage, height, color, backgroundColor = colors.gray2, backgroundStyle = 'normal' }: PercentageProps) => {
  const minWidth = percentage > 0 ? '2px' : undefined;

  return (
    <Box display="flex" position="relative" width="100%">
      <Bar style={{ width: `${percentage}%` }} height={height} minWidth={minWidth} color={color} />
      <StyledDiv backgroundStyle={backgroundStyle} backgroundColor={backgroundColor} height={height} />
    </Box>
  );
};

interface StyledDivProps {
  backgroundStyle: string;
  backgroundColor: string;
  height?: string | number;
}

const StyledDiv = styled.div<StyledDivProps>`
  /* Created by https://stripesgenerator.com/ */
  background-color: ${({ backgroundStyle, backgroundColor }) => (backgroundStyle !== 'hatched' ? backgroundColor : undefined)};
  background-image: ${({ backgroundStyle, backgroundColor }) =>
    backgroundStyle === 'hatched'
      ? `linear-gradient(45deg, ${backgroundColor} 30%, #ffffff 30%, #ffffff 50%, ${backgroundColor} 50%, ${backgroundColor} 80%, #ffffff 80%, #ffffff 100%)`
      : undefined};
  background-size: ${({ backgroundStyle }) => (backgroundStyle === 'hatched' ? '7.07px 7.07px' : undefined)};
  flex: 1;
  height: ${({ height }) => (height ? height : undefined)};
  left: 0;
  top: 0;
`;

interface BarProps {
  height?: number | string;
  minWidth?: string;
  color?: string;
}

const Bar = styled.div<BarProps>`
  background-color: ${({ color }) => (color ? color : 'currentcolor')};
  height: ${({ height }) => height ?? '0.8em'};
  min-width: ${({ minWidth }) => minWidth};
  transition: width 0.3s;
  z-index: 3;
`;
