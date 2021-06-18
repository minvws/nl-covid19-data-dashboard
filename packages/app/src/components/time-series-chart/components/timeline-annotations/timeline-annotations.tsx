import css from '@styled-system/css';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { wrapAroundLength } from '~/utils/number';
import { Bounds, Padding, TimelineAnnotationConfig } from '../../logic';
import { Annotation } from './components/annotation';
import { Timeline } from './components/timeline';
import { TooltipContent } from './components/tooltip-content';

interface TimelineAnnotationProps {
  annotations: TimelineAnnotationConfig[];
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
  size?: number;
  highlightIndex?: number;
}

export const TimelineAnnotations = memo(function TimelineAnnotations({
  annotations,
  xScale,
  padding,
  highlightIndex,
  size = 10,
}: TimelineAnnotationProps) {
  const [index, setIndex] = useState<number | undefined>(undefined);
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const showTooltipAtIndex = useCallback(
    (index: number) => setIndex(wrapAroundLength(index, annotations.length)),
    [annotations.length]
  );

  if (!width) return null;

  return (
    <Box
      position="relative"
      left={padding.left}
      css={css({ userSelect: 'none' })}
    >
      <Timeline width={width} height={size + 2}>
        {annotations.map((x, i) => (
          <Annotation
            key={x.date.toString()}
            size={size}
            value={x}
            xScale={xScale}
            onSelect={() => showTooltipAtIndex(i)}
            onDeselect={() => index === i && setIndex(undefined)}
            isSelected={i === index}
            isHighlighted={isDefined(highlightIndex) && i === highlightIndex}
            tooltipContent={
              <TooltipContent
                value={x}
                onNext={() => showTooltipAtIndex(i + 1)}
                onPrev={() => showTooltipAtIndex(i - 1)}
                onClose={() => setIndex(undefined)}
              />
            }
          />
        ))}
      </Timeline>
    </Box>
  );
});
