import { colors } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { MapType } from '~/components/choropleth/logic';
import { DataConfig, DataOptions } from '..';
import { ChoroplethDataItem } from './types';

type GetFeatureProp<T = string> = (code: string) => T;
type GetHoverFeatureProp<T = string> = (code: string, isActivated?: boolean, isKeyboardActive?: boolean) => T;

export type FeatureProps = {
  /**
   * Feature props for the features of the map that are colored in based on the given data.
   * (So the basic functionality of a choropleth)
   */
  area: FeaturePropFunctions;
  /***
   * Feature props for the features that are shown when hovering over the map
   */
  hover: {
    fill: GetHoverFeatureProp;
    stroke: GetHoverFeatureProp;
    strokeWidth: GetHoverFeatureProp<number>;
  };
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

export const DEFAULT_HOVER_STROKE_WIDTH = 6;

/**
 * This hook returns the visual props for the map features based on the specified map type.
 * Each map type has three 'layers', the area, hover and outline features.
 *
 * The area features represent the main choropleth functionality, these features are colored
 * in based on the given data item and associated threshold.
 *
 * The hover features are shown when the mouse pointer is over them (or a touch event triggers).
 *
 * The outline is an optional set of features that represent features that just add more visual
 * detail.
 *
 */
export function useFeatureProps<T extends ChoroplethDataItem>(
  map: MapType,
  getFillColor: (code: string) => string,
  dataConfig: DataConfig<T>,
  dataOptions?: DataOptions
): FeatureProps {
  return useMemo(() => getFeatureProps(map, getFillColor, dataConfig, dataOptions), [map, getFillColor, dataOptions, dataConfig]);
}

export function getFeatureProps<T extends ChoroplethDataItem>(
  map: MapType,
  getFillColor: (code: string) => string,
  dataConfig: DataConfig<T>,
  dataOptions?: DataOptions
): FeatureProps {
  switch (map) {
    case 'gm': {
      return {
        area: {
          fill: (code: string) => {
            return getFillColor(code);
          },
          stroke: () => dataConfig.areaStroke,
          strokeWidth: () => dataConfig.areaStrokeWidth,
        },
        hover: {
          fill: (_code: string) => getFillColor(_code),
          stroke:
            !dataOptions?.highlightSelection || !dataOptions?.selectedCode
              ? (_code: string, isActivated?: boolean, isKeyboardActive?: boolean) =>
                  isActivated ? (isKeyboardActive ? dataConfig.highlightStroke : dataConfig.hoverStroke) : 'none'
              : (code: string, isActivated?: boolean) =>
                  code === dataOptions?.selectedCode ? (isActivated ? dataConfig.hoverStroke : dataConfig.highlightStroke) : isActivated ? dataConfig.hoverStroke : 'none',
          strokeWidth:
            !dataOptions?.highlightSelection || !dataOptions?.selectedCode
              ? (_code: string, isActivated?: boolean) => (isActivated ? dataConfig.hoverStrokeWidth : 0)
              : (code: string, isActivated?: boolean) => (code === dataOptions?.selectedCode ? dataConfig.highlightStrokeWidth : isActivated ? dataConfig.hoverStrokeWidth : 0),
        },
        outline: {
          fill: () => 'transparent',
          stroke: () => colors.gray3,
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
          fill: (_code: string) => getFillColor(_code),
          stroke: (_code: string, isActivated?: boolean, isKeyboardActive?: boolean) =>
            isActivated ? (isKeyboardActive ? dataConfig.highlightStroke : dataConfig.hoverStroke) : 'none',
          strokeWidth: (_code: string, isActivated?: boolean) => (isActivated ? dataConfig.hoverStrokeWidth : 0),
        },
        outline: {
          fill: () => 'none',
          stroke: () => colors.gray3,
          strokeWidth: () => DEFAULT_STROKE_WIDTH,
        },
      };
    }
  }
}
