import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import {
  BoundingBoxPadding,
  DynamicSizeConfiguration,
  DynamicSizeConfigurations,
  DynamicSizes,
  OptionalBoundingBoxPadding,
} from '~/components/choropleth2';

export function useDynamicSize(
  containerWidth: number,
  containerDefaultHeight: number,
  boundingBoxPadding: OptionalBoundingBoxPadding,
  dynamicSizeConfiguration?: DynamicSizeConfigurations
) {
  return useMemo(() => {
    if (!isDefined(dynamicSizeConfiguration)) {
      return [
        containerDefaultHeight,
        addDefaultPaddingValues(boundingBoxPadding),
      ] as const;
    }

    const result = dynamicSizeConfiguration.find((item) => {
      if (isDynamicConfiguration(item)) {
        return isDefined(containerWidth)
          ? containerWidth >= item.containerWidth
          : true;
      }
      return true;
    });

    //This assert cannot ever trigger, since the Tuple will always return the last item, but the compiler doesn't understand this...
    assert(isDefined(result), 'Cannot find valid size');

    return isDynamicConfiguration(result)
      ? ([
          result.sizes.mapHeight,
          addDefaultPaddingValues(result.sizes.padding),
        ] as const)
      : ([result.mapHeight, addDefaultPaddingValues(result.padding)] as const);
  }, [
    dynamicSizeConfiguration,
    boundingBoxPadding,
    containerDefaultHeight,
    containerWidth,
  ]);
}

function isDynamicConfiguration(
  value: DynamicSizeConfiguration | DynamicSizes
): value is DynamicSizeConfiguration {
  return 'containerWidth' in value;
}

function addDefaultPaddingValues(
  optionalPadding: OptionalBoundingBoxPadding
): BoundingBoxPadding {
  return {
    left: optionalPadding.left ?? 0,
    right: optionalPadding.right ?? 0,
    top: optionalPadding.top ?? 0,
    bottom: optionalPadding.bottom ?? 0,
  };
}
