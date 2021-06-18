import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback, useRef } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { wrapAroundLength } from '~/utils/number';
import { Bounds, Padding, TimelineEventConfig } from '../../logic';
import { TimelineEvent } from './components/event';
import { TimelineBar } from './components/bar';
import { TimelineTooltipContent } from './components/tooltip-content';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface TimelineProps {
  annotations: TimelineEventConfig[];
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
  index: number | undefined;
  setIndex: (index: number | undefined) => void;
  size?: number;
  highlightIndex?: number;
}

export const Timeline = memo(function Timeline({
  annotations,
  xScale,
  padding,
  highlightIndex,
  size = 10,
  index,
  setIndex,
}: TimelineProps) {
  const isTouch = useIsTouchDevice();
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const indexRef = useRef(index);
  indexRef.current = index;

  const showTooltip = useCallback(
    (index: number) => setIndex(wrapAroundLength(index, annotations.length)),
    [annotations.length, setIndex]
  );

  const hideTooltip = useCallback(
    (index: number) => indexRef.current === index && setIndex(undefined),
    [setIndex]
  );

  if (!width) return null;

  return (
    <Box
      position="relative"
      left={padding.left}
      css={css({ userSelect: 'none' })}
      key={isTouch ? 1 : 0}
    >
      <TimelineBar width={width} height={size + 2}>
        {annotations.map((x, i) => (
          <TimelineEvent
            key={x.date.toString()}
            size={size}
            value={x}
            xScale={xScale}
            index={i}
            onShow={showTooltip}
            onHide={hideTooltip}
            isSelected={i === index}
            isHighlighted={isDefined(highlightIndex) && i === highlightIndex}
            tooltipContent={
              <TimelineTooltipContent
                value={x}
                onNext={() => showTooltip(i + 1)}
                onPrev={() => showTooltip(i - 1)}
                onClose={() => hideTooltip(i)}
              />
            }
          />
        ))}
      </TimelineBar>
    </Box>
  );
});
