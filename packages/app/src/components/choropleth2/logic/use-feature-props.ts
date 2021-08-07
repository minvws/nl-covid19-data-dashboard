import { MapType } from '~/components/choropleth2/logic';
import { colors } from '~/style/theme';

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

export function useFeatureProps(
  map: MapType,
  getFillColor: (code: string) => string
): FeatureProps {
  switch (map) {
    case 'gm': {
      return {
        area: {
          fill: (code: string) => {
            return getFillColor(code);
          },
          stroke: () => {
            return 'white';
          },
          strokeWidth: (code: string) => 0.5,
        },
        hover: {
          fill: () => 'none',
          stroke: () => 'white',
          strokeWidth: () => 2,
        },
        outline: {
          fill: () => 'none',
          stroke: () => colors.silver,
          strokeWidth: () => 0.5,
        },
      };
    }
    case 'vr': {
      return {
        area: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        hover: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        outline: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
      };
    }
    case 'in': {
      return {
        area: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        hover: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
        outline: {
          fill: (code: string) => '',
          stroke: (code: string) => '',
          strokeWidth: (code: string) => 0,
        },
      };
    }
  }
}
