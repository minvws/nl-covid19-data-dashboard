import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { wrapAroundLength } from '~/utils/number';
import { Bounds, Padding, TimelineEventConfig } from '../../logic';
import { TimelineEvent } from './components/event';
import { TimelineBar } from './components/bar';
import { TimelineTooltipContent } from './components/tooltip-content';

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
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const showTooltipAtIndex = useCallback(
    (index: number) => setIndex(wrapAroundLength(index, annotations.length)),
    [annotations.length, setIndex]
  );

  if (!width) return null;

  return (
    <Box
      position="relative"
      left={padding.left}
      css={css({ userSelect: 'none' })}
    >
      <TimelineBar width={width} height={size + 2}>
        {annotations.map((x, i) => (
          <TimelineEvent
            key={x.date.toString()}
            size={size}
            value={x}
            xScale={xScale}
            onSelect={() => showTooltipAtIndex(i)}
            onDeselect={() => index === i && setIndex(undefined)}
            isSelected={i === index}
            isHighlighted={isDefined(highlightIndex) && i === highlightIndex}
            tooltipContent={
              <TimelineTooltipContent
                value={x}
                onNext={() => showTooltipAtIndex(i + 1)}
                onPrev={() => showTooltipAtIndex(i - 1)}
                onClose={() => setIndex(undefined)}
              />
            }
          />
        ))}
      </TimelineBar>
    </Box>
  );
});
