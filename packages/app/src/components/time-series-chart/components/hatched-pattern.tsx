import { isDefined } from 'ts-is-present';
import { TimespanAnnotationConfig } from '../logic';

type HatchedPatternProps = {
  timespanAnnotations: TimespanAnnotationConfig[] | undefined;
  chartId: string;
};

export function HatchedPattern({
  timespanAnnotations,
  chartId,
}: HatchedPatternProps) {
  const hasHatchedAnnotation = isDefined(
    timespanAnnotations?.find((x) => x.type === 'hatched')
  );

  if (!hasHatchedAnnotation) {
    return null;
  }

  return (
    <pattern
      id={`${chartId}_hatched_pattern`}
      width="8"
      height="8"
      patternTransform="rotate(-45 0 0)"
      patternUnits="userSpaceOnUse"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="8"
        style={{ stroke: 'white', strokeWidth: 4 }}
      ></line>
    </pattern>
  );
}
