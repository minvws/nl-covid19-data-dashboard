import { colors } from '@corona-dashboard/common';
import { OptionalDataConfig } from '..';
import { ChoroplethDataItem } from './types';
import {
  DEFAULT_HOVER_STROKE_WIDTH,
  DEFAULT_STROKE_WIDTH,
} from './use-feature-props';

export function createDataConfig<T extends ChoroplethDataItem>(
  partialDataConfig: OptionalDataConfig<T>
) {
  return {
    metricName: partialDataConfig.metricName ?? '',
    metricProperty: partialDataConfig.metricProperty,
    noDataFillColor:
      partialDataConfig.noDataFillColor ?? colors.choroplethNoData,
    hoverFill: partialDataConfig.hoverFill ?? 'none',
    hoverStroke:
      partialDataConfig.hoverStroke ?? colors.choroplethFeatureStroke,
    hoverStrokeWidth:
      partialDataConfig.hoverStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
    highlightStroke:
      partialDataConfig.highlightStroke ?? colors.choroplethHighlightStroke,
    highlightStrokeWidth:
      partialDataConfig.highlightStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
    areaStroke: partialDataConfig.areaStroke ?? colors.choroplethFeatureStroke,
    areaStrokeWidth: partialDataConfig.areaStrokeWidth ?? DEFAULT_STROKE_WIDTH,
  };
}
