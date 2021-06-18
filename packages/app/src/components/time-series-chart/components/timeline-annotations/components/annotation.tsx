import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { TimelineAnnotationConfig } from '~/components/time-series-chart/logic';
import { WithTooltip } from '~/lib/tooltip';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { AnnotationMarker } from './annotation-marker';

interface AnnotationProps {
  value: TimelineAnnotationConfig;
  size: number;
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  onSelect: () => void;
  onDeselect: () => void;
  isSelected: boolean;
  tooltipContent: ReactNode;
  isHighlighted?: boolean;
}

export function Annotation({
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
    <StyledAnnotation
      style={{ width, left, zIndex: highlightAnnotation ? 1 : undefined }}
    >
      <TooltipTrigger
        content={tooltipContent}
        isSelected={isSelected}
        size={size}
        onSelect={handleTooltipSelect}
        onDeselect={handleTooltipDeselect}
        contentRef={contentRef}
      />
      {width && (
        <TimespanBar
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
      <Box transform="translateX(-50%)">
        <AnnotationMarker size={size} isHighlighted={highlightAnnotation} />
      </Box>
    </StyledAnnotation>
  );
}

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
      <HitTarget size={size} onClick={onSelect} />
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
  const padding = x.size;

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

const TimespanBar = styled(motion.div)<{ height: number }>((x) =>
  css({
    position: 'absolute',
    width: '100%',
    height: x.height,
    borderRadius: `0 ${x.height / 2}px ${x.height / 2}px 0`,
  })
);
