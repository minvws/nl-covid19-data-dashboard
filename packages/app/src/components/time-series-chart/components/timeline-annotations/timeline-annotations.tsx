import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { transparentize } from 'polished';
import { ReactNode } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components/base';
import { colors } from '~/style/theme';
import { Bounds, Padding } from '../../logic';

interface TimelineAnnotationProps {
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
}

const points: AnnotationValue[] = [
  {
    date: 1586642400,
  },
  {
    date: [1596060000, 1600984800],
  },
];

export function TimelineAnnotations({
  xScale,
  padding,
}: TimelineAnnotationProps) {
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  if (!width) return null;

  return (
    <div style={{ position: 'relative', left: padding.left }}>
      <Timeline width={width}>
        {points.map((x) => (
          <Annotation key={x.date.toString()} value={x} xScale={xScale} />
        ))}
      </Timeline>
    </div>
  );
}

interface AnnotationValue {
  date: number | [number, number];
}

interface AnnotationProps {
  value: AnnotationValue;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
}

const POINT_SIZE = 5;
const POINT_BORDER_SIZE = 2;
const POINT_BAR_HEIGHT = POINT_SIZE + 2 * POINT_BORDER_SIZE;

function Annotation({ value, xScale }: AnnotationProps) {
  const left = Array.isArray(value.date)
    ? xScale(value.date[0]) ?? 0
    : xScale(value.date) ?? 0;

  const width = Array.isArray(value.date)
    ? (xScale(value.date[1]) ?? 0) - (xScale(value.date[0]) ?? 0)
    : undefined;

  return (
    <Box
      position="absolute"
      width={width}
      height="100%"
      left={left}
      display="flex"
      alignItems="center"
    >
      {width && (
        <Box
          position="absolute"
          width="100%"
          height={POINT_BAR_HEIGHT}
          borderRadius={`0 ${POINT_BAR_HEIGHT / 2}px ${
            POINT_BAR_HEIGHT / 2
          }px 0`}
          bg={transparentize(0.8, colors.data.primary)}
        />
      )}
      <PointMarker size={POINT_SIZE} color={colors.data.primary} />
    </Box>
  );
}

function Timeline({ children, width }: { children: ReactNode; width: number }) {
  return (
    <Box
      position="relative"
      bg={transparentize(0.9, colors.data.primary)}
      style={{
        width,
        height: POINT_BAR_HEIGHT + 2,
      }}
      display="flex"
      alignItems="center"
    >
      <Box height="1px" width={width} bg={colors.data.primary} />
      <Box position="absolute" top={0} right={0} bottom={0} left={0}>
        {children}
      </Box>
    </Box>
  );
}

const PointMarker = styled.div<{ color: string; size: number }>((x) =>
  css({
    position: 'absolute',
    width: `${x.size}px`,
    height: `${x.size}px`,
    borderRadius: `${x.size / 2}px`,
    boxShadow: `0 0 0 2px ${x.color} `,
    background: 'white',
    transform: 'translateX(-50%)',
  })
);
