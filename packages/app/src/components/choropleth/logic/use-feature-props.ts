import { MapType } from '~/components/choropleth/logic';
import { colors } from '~/style/theme';
import { DataConfig, DataOptions } from '..';
import { ChoroplethDataItem } from './types';

type GetFeatureProp<T = string> = (code: string) => T;

type FeatureProps = {
  /**
   * Feature props for the features of the map that are colored in based on the given data.
   */
  area: FeaturePropFunctions;
  /***
   * Feature props for the features that are shown when hovering over the map
   */
  hover: FeaturePropFunctions;
  /**
   * Feature props for the features that represent the outlines of the map
   */
  outline: FeaturePropFunctions;
};

type FeaturePropFunctions = {
  fill: GetFeatureProp;
  stroke: GetFeatureProp;
  strokeWidth: GetFeatureProp<number>;
};

export const DEFAULT_STROKE_WIDTH = 0.5;

/**
 * This hook returns the visual props for the map features based on the specified map type.
 *
 */
export function useFeatureProps<T extends ChoroplethDataItem>(
  map: MapType,
  getFillColor: (code: string) => string,
  dataOptions: DataOptions,
  dataConfig: DataConfig<T>
): FeatureProps {
  switch (map) {
    case 'gm': {
      return {
        area: {
          fill: (code: string) => {
            return getFillColor(code);
          },
          stroke:
            !dataOptions.highlightSelection || !dataOptions.selectedCode
              ? () => {
                  return dataConfig.areaStroke;
                }
              : (code: string) =>
                  code === dataOptions.selectedCode
                    ? dataConfig.highlightStroke
                    : colors.choroplethFeatureStroke,
          strokeWidth:
            !dataOptions.highlightSelection || !dataOptions.selectedCode
              ? () => dataConfig.areaStrokeWidth
              : (code: string) =>
                  code === dataOptions.selectedCode
                    ? dataConfig.highlightStrokeWidth
                    : dataConfig.areaStrokeWidth,
        },
        hover: {
          fill: () => dataConfig.hoverFill,
          stroke: () => dataConfig.hoverStroke,
          strokeWidth: () => dataConfig.hoverStrokeWidth,
        },
        outline: {
          fill: () => 'none',
          stroke: () => colors.choroplethOutlineStroke,
          strokeWidth: () => DEFAULT_STROKE_WIDTH,
        },
      };
    }
    case 'vr': {
      return {
        area: {
          fill: (code: string) => {
            return getFillColor(code);
          },
          stroke: () => dataConfig.areaStroke,
          strokeWidth: () => dataConfig.areaStrokeWidth,
        },
        hover: {
          fill: () => 'none',
          stroke: () => dataConfig.hoverStroke,
          strokeWidth: () => dataConfig.hoverStrokeWidth,
        },
        outline: {
          fill: () => 'none',
          stroke: () => colors.choroplethOutlineStroke,
          strokeWidth: () => DEFAULT_STROKE_WIDTH,
        },
      };
    }
    case 'in': {
      return {
        area: {
          fill: (code: string) => {
            return getFillColor(code);
          },
          stroke: () => colors.white,
          strokeWidth: () => DEFAULT_STROKE_WIDTH,
        },
        hover: {
          fill: () => 'none',
          stroke: () => colors.body,
          strokeWidth: () => 1,
        },
        outline: {
          fill: () => 'none',
          stroke: () => colors.silver,
          strokeWidth: () => DEFAULT_STROKE_WIDTH,
        },
      };
    }
  }
}
