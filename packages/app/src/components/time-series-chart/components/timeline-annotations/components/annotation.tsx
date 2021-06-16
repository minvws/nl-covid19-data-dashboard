import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { TimelineAnnotation } from '../types';

interface AnnotationProps {
  size: number;
  value: TimelineAnnotation;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
}

export const Annotation = memo(function Annotation({
  value,
  xScale,
  size,
}: AnnotationProps) {
  const [isEntered, setIsEntered] = useState(false);

  const borderWidth = Math.round(size * 0.2);
  const innerPointSize = size - 2 * borderWidth;

  const left = Array.isArray(value.date)
    ? xScale(value.date[0]) ?? 0
    : xScale(value.date) ?? 0;

  const width = Array.isArray(value.date)
    ? (xScale(value.date[1]) ?? 0) - (xScale(value.date[0]) ?? 0)
    : undefined;

  const handlePointerEnter = useCallback(() => setIsEntered(true), []);
  const handlePointerLeave = useCallback(() => setIsEntered(false), []);

  return (
    <StyledAnnotation style={{ width, left }}>
      <HitTarget
        size={size}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      {width && (
        <Bar
          height={size}
          initial={false}
          animate={{
            background: transparentize(
              isEntered ? 0.5 : 0.8,
              colors.data.primary
            ),
          }}
        />
      )}
      <PointMarker
        size={innerPointSize}
        color={colors.data.primary}
        initial={false}
        animate={{
          boxShadow: `0 0 0 ${isEntered ? borderWidth * 1.5 : borderWidth}px ${
            colors.data.primary
          }`,
        }}
      />
    </StyledAnnotation>
  );
});

const StyledAnnotation = styled.div(
  css({
    position: 'absolute',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  })
);

const HitTarget = styled.button<{ size: number }>((x) => {
  const padding = x.size / 2;

  return css({
    m: 0,
    p: 0,
    border: 0,
    bg: 'transparent',
    display: 'block',
    position: 'absolute',
    minWidth: x.size + 2 * padding,
    width: `calc(100% + ${x.size}px + ${padding}px)`,
    top: `${-padding}px`,
    bottom: `${-padding}px`,
    left: -padding - x.size / 2,
    zIndex: 1,
  });
});

const Bar = styled(motion.div)<{ height: number }>((x) =>
  css({
    position: 'absolute',
    width: '100%',
    height: x.height,
    borderRadius: `0 ${x.height / 2}px ${x.height / 2}px 0`,
  })
);

const PointMarker = styled(motion.div)<{ color: string; size: number }>((x) =>
  css({
    position: 'absolute',
    width: `${x.size}px`,
    height: `${x.size}px`,
    borderRadius: `${x.size / 2}px`,
    background: 'white',
    transform: 'translateX(-50%)',
  })
);
