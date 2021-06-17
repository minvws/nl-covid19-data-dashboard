import { useSingleton } from '@tippyjs/react';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { memo, useCallback, useEffect, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { WithTooltip } from '~/lib/tooltip';
import { wrapAroundLength } from '~/utils/number';
import { Bounds, Padding } from '../../logic';
import { Annotation } from './components/annotation';
import { Timeline } from './components/timeline';
import { TimelineAnnotation } from './types';
import { TooltipContent } from './components/tooltip-content';

interface TimelineAnnotationProps {
  annotations: TimelineAnnotation[];
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
  size?: number;
}

export const TimelineAnnotations = memo(function TimelineAnnotations({
  annotations,
  xScale,
  padding,
  size = 10,
}: TimelineAnnotationProps) {
  const [tooltipIndex, setTooltipIndex] =
    useState<number | undefined>(undefined);
  const [tippySource, tippyTarget] = useSingleton();
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  const hideTooltip = useCallback(() => setTooltipIndex(undefined), []);
  const showTooltipAtIndex = useCallback(
    (index: number) =>
      setTooltipIndex(wrapAroundLength(index, annotations.length)),
    [annotations.length]
  );

  useEffect(() => {
    const instance = tippySource.data.instance;
    if (isDefined(tooltipIndex) && instance) instance.show(tooltipIndex);
  }, [tooltipIndex, tippySource]);

  if (!width) return null;

  return (
    <div style={{ position: 'relative', left: padding.left }}>
      <Timeline width={width} height={size + 2}>
        {annotations.map((x, i) => (
          <Annotation
            key={x.date.toString()}
            size={size}
            value={x}
            xScale={xScale}
            tippyTarget={tippyTarget}
            onClick={() => showTooltipAtIndex(i)}
            isActive={tooltipIndex === i}
            tooltipContent={
              <TooltipContent
                value={x}
                onNext={() => showTooltipAtIndex(i + 1)}
                onPrev={() => showTooltipAtIndex(i - 1)}
              />
            }
          />
        ))}
      </Timeline>
      <WithTooltip
        singletonSource={tippySource}
        placement="bottom"
        // trigger="click"
        interactive
        moveTransition="transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
        onHidden={hideTooltip}
      />
    </div>
  );
});
