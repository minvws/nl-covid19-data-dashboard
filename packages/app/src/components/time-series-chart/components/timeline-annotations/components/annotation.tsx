import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { transparentize } from 'polished';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { colors } from '~/style/theme';
import { TimelineAnnotation } from '../types';

interface AnnotationProps {
  height: number;
  value: TimelineAnnotation;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
}

const BORDER_WIDTH = 2;

export function Annotation({ value, xScale, height }: AnnotationProps) {
  /**
   * inner point size is the point without border
   */
  const innerPointSize = height - 2 * BORDER_WIDTH;

  const left = Array.isArray(value.date)
    ? xScale(value.date[0]) ?? 0
    : xScale(value.date) ?? 0;

  const width = Array.isArray(value.date)
    ? (xScale(value.date[1]) ?? 0) - (xScale(value.date[0]) ?? 0)
    : undefined;

  return (
    <StyledAnnotation style={{ width, left }}>
      {width && (
        <Box
          position="absolute"
          width="100%"
          height={height}
          borderRadius={`0 ${height / 2}px ${height / 2}px 0`}
          bg={transparentize(0.8, colors.data.primary)}
        />
      )}
      <PointMarker
        size={innerPointSize}
        borderWidth={BORDER_WIDTH}
        color={colors.data.primary}
      />
    </StyledAnnotation>
  );
}

const StyledAnnotation = styled.button(
  css({
    position: 'absolute',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    m: 0,
    p: 0,
    border: 0,
    bg: 'transparent',
  })
);

const PointMarker = styled.div<{
  color: string;
  size: number;
  borderWidth: number;
}>((x) =>
  css({
    position: 'absolute',
    width: `${x.size}px`,
    height: `${x.size}px`,
    borderRadius: `${x.size / 2}px`,
    boxShadow: `0 0 0 ${x.borderWidth}px ${x.color} `,
    background: 'white',
    transform: 'translateX(-50%)',
  })
);
