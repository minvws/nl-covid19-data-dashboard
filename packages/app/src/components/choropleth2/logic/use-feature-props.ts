import { MapType } from '~/components/choropleth2/logic';
import { colors } from '~/style/theme';
import { DataConfig, DataOptions } from '..';
import { ChoroplethDataItem } from './types';

type GetFeatureProp<T = string> = (code: string) => T;

type FeatureProps = {
  area: FeaturePropFunctions;
  hover: FeaturePropFunctions;
  outline: FeaturePropFunctions;
};

type FeaturePropFunctions = {
  fill: GetFeatureProp;
  stroke: GetFeatureProp;
  strokeWidth: GetFeatureProp<number>;
};

const DEFAULT_STROKE_WIDTH = 0.5;

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
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        hover: {
          fill: () => 'none',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        outline: {
          fill: () => '',
          stroke: () => '',
          strokeWidth: () => 0,
        },
      };
    }
  }
}
