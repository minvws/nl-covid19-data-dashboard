import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { TimelineAnnotation } from '../types';

interface AnnotationProps {
  value: TimelineAnnotation;
  size: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  onSelect: () => void;
  onDeselect: () => void;
  isSelected: boolean;
  tooltipContent: ReactNode;
  isHighlighted?: boolean;
}

export const Annotation = function Annotation({
  value,
  xScale,
  size,
  onSelect,
  onDeselect,
  isSelected,
  isHighlighted,
  tooltipContent,
}: AnnotationProps) {
  const isTouch = useIsTouchDevice();
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const highlightAnnotation =
    isHighlighted || (isTouch ? isSelected : isMouseEntered);

  const borderWidth = Math.round(size * 0.2);
  const innerPointSize = size - 2 * borderWidth;

  const left = Array.isArray(value.date)
    ? xScale(value.date[0]) ?? 0
    : xScale(value.date) ?? 0;

  const width = Array.isArray(value.date)
    ? (xScale(value.date[1]) ?? 0) - (xScale(value.date[0]) ?? 0)
    : undefined;

  const handleTooltipSelect = useCallback(() => {
    setIsMouseEntered(true);
    onSelect();
  }, [onSelect]);

  const handleTooltipDeselect = useCallback(() => {
    setIsMouseEntered(false);
  }, []);

  const annotationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([annotationRef, contentRef], () => onDeselect());

  return (
    <StyledAnnotation style={{ width, left }}>
      <TooltipTrigger
        content={tooltipContent}
        isSelected={isSelected}
        size={size}
        onSelect={handleTooltipSelect}
        onDeselect={handleTooltipDeselect}
        contentRef={contentRef}
      />
      {width && (
        <Bar
          height={size}
          initial={false}
          animate={{
            background: transparentize(
              highlightAnnotation ? 0.5 : 0.8,
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
          boxShadow: `0 0 0 ${
            highlightAnnotation ? borderWidth * 1.5 : borderWidth
          }px ${colors.data.primary}`,
        }}
      />
    </StyledAnnotation>
  );
};

function TooltipTrigger({
  size,
  onSelect,
  onDeselect,
  isSelected,
  content,
  contentRef,
}: {
  size: number;
  onSelect: () => void;
  onDeselect: () => void;
  content: ReactNode;
  isSelected: boolean;
  contentRef: RefObject<HTMLDivElement>;
}) {
  const isTouch = useIsTouchDevice();
  const contentWithRef = <div ref={contentRef}>{content}</div>;

  return isTouch ? (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive
      visible={isSelected}
    >
      <HitTarget
        size={size}
        onPointerEnter={onSelect}
        onPointerLeave={onDeselect}
        onClick={onSelect}
      />
    </WithTooltip>
  ) : (
    <WithTooltip
      content={contentWithRef}
      placement="bottom"
      interactive
      onShow={onSelect}
      onHide={onDeselect}
      hideOnClick={false}
    >
      <HitTarget size={size} />
    </WithTooltip>
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
