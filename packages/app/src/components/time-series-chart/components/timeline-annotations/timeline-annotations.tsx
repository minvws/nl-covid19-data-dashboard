import { ScaleBand, ScaleLinear } from 'd3-scale';
import { Bounds, Padding } from '../../logic';
import { Annotation } from './components/annotation';
import { Timeline } from './components/timeline';
import { TimelineAnnotation } from './types';

interface TimelineAnnotationProps {
  annotations: TimelineAnnotation[];
  xScale: ScaleLinear<number, number> | ScaleBand<number>;
  bounds: Bounds;
  padding: Padding;
  size?: number;
}

export function TimelineAnnotations({
  annotations,
  xScale,
  padding,
  size = 10,
}: TimelineAnnotationProps) {
  const [, end] = xScale.domain();
  const width = xScale(end) ?? 0;

  if (!width) return null;

  return (
    <div style={{ position: 'relative', left: padding.left }}>
      <Timeline width={width} height={size + 2}>
        {annotations.map((x) => (
          <Annotation
            size={size}
            key={x.date.toString()}
            value={x}
            xScale={xScale}
          />
        ))}
      </Timeline>
    </div>
  );
}
