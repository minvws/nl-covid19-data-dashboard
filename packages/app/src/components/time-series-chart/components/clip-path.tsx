import { TimestampedValue } from '@corona-dashboard/common';
import { SeriesConfig, TimespanAnnotationConfig } from '../logic';

type ClipPathProps<T extends TimestampedValue> = {
  timespanAnnotations: TimespanAnnotationConfig[] | undefined;
  seriesConfig: SeriesConfig<T>;
  chartId: string;
};

export function ClipPath<T extends TimestampedValue>({
  timespanAnnotations,
  chartId,
  seriesConfig,
}: ClipPathProps<T>) {
  const estimates =
    timespanAnnotations?.filter((x) => x.type === 'estimate') ?? [];

  if (!estimates.length) {
    return null;
  }

  return (
    <clipPath id={`${chartId}_estimate_clippath`}>
      {seriesConfig.map((x) => {
        switch (x.type) {
          case 'invisible':
            return null;
          case 'range':
            return (
              <use
                xlinkHref={`#${chartId}_${String(x.metricPropertyLow)}_${String(
                  x.metricPropertyHigh
                )}`}
              />
            );
          default:
            return (
              <use xlinkHref={`#${chartId}_${String(x.metricProperty)}`} />
            );
        }
      })}
    </clipPath>
  );
}
