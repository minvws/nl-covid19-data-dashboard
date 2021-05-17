import { TimespanAnnotationConfig } from '../logic';

type PatternsProps = {
  timespanAnnotations: TimespanAnnotationConfig[] | undefined;
  chartId: string;
};

/**
 * For now only the estimate timespan annotation requires a pattern to be registered
 * in the defs section, so I'm keeping that logic here.
 *
 * Should there be other components/annotations/etc that require these then I suggest
 * we come up with a more generic approach to this when it becomes a requirement.
 *
 */
export function Patterns({ timespanAnnotations, chartId }: PatternsProps) {
  const estimates =
    timespanAnnotations?.filter((x) => x.type === 'estimate') ?? [];

  if (!estimates.length) {
    return null;
  }

  return (
    <pattern
      id={`${chartId}_estimate_pattern`}
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
