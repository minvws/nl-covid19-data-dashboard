import { TimestampedValue } from '@corona-dashboard/common';
import {
  DataOptions,
  SeriesConfig,
  TimespanAnnotationConfig,
} from '../../logic';

export type TooltipData<T extends TimestampedValue> = {
  value: T;

  /**
   * The config index of the nearest / active hover point. This can be used to
   * look up the value from T and highlight it.
   */
  configIndex: number;

  /**
   * The full series config is passed to the tooltip so we can render whatever
   * is needed.
   */
  config: SeriesConfig<T>;

  /**
   * The options are also essential to know whether to format percentages or
   * show date span annotation labels.
   */
  options: DataOptions;

  /**
   * When hovering a date span annotation, the tooltip needs to know about it so
   * that it can render the label accordingly. I am assuming here that we won't
   * ever define overlapping annotations for now.
   */
  timespanAnnotation?: TimespanAnnotationConfig;

  /**
   * Configuration to display the nearest point only in the tooltip
   */
  markNearestPointOnly?: boolean;
};

export type TooltipFormatter<T extends TimestampedValue> = (
  tooltipData: TooltipData<T>
) => React.ReactNode;
