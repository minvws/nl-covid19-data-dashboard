import css from '@styled-system/css';
import { useSingleton } from '@tippyjs/react';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Text } from '~/components/typography';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { TimelineAnnotation } from '../types';

interface AnnotationProps {
  value: TimelineAnnotation;
  size: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  tippyTarget: ReturnType<typeof useSingleton>[number];
  onNext: () => void;
  onPrev: () => void;
  onClick: () => void;
  isActive: boolean;
}

export const Annotation = memo(function Annotation({
  value,
  xScale,
  size,
  tippyTarget,
  onNext,
  onPrev,
  onClick,
  isActive,
}: AnnotationProps) {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const isSelected = isActive || isMouseEntered;

  const borderWidth = Math.round(size * 0.2);
  const innerPointSize = size - 2 * borderWidth;

  const left = Array.isArray(value.date)
    ? xScale(value.date[0]) ?? 0
    : xScale(value.date) ?? 0;

  const width = Array.isArray(value.date)
    ? (xScale(value.date[1]) ?? 0) - (xScale(value.date[0]) ?? 0)
    : undefined;

  const handlePointerEnter = useCallback(() => setIsMouseEntered(true), []);
  const handlePointerLeave = useCallback(() => setIsMouseEntered(false), []);

  return (
    <StyledAnnotation style={{ width, left }}>
      <WithTooltip
        singletonTarget={tippyTarget}
        content={
          <AnnotationContent value={value} onPrev={onPrev} onNext={onNext} />
        }
      >
        <HitTarget
          size={size}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={onClick}
        />
      </WithTooltip>
      {width && (
        <Bar
          height={size}
          initial={false}
          animate={{
            background: transparentize(
              isSelected ? 0.5 : 0.8,
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
          boxShadow: `0 0 0 ${isSelected ? borderWidth * 1.5 : borderWidth}px ${
            colors.data.primary
          }`,
        }}
      />
    </StyledAnnotation>
  );
});

interface AnnotationContentProps {
  value: TimelineAnnotation;
  onNext: () => void;
  onPrev: () => void;
}

function AnnotationContent(props: AnnotationContentProps) {
  return (
    <div>
      <Text>supoerduerpoer</Text>
      <button onClick={props.onPrev}>prev</button>{' '}
      <button onClick={props.onNext}>next</button>
    </div>
  );
}

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
    width: x.size + 2 * padding,
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
