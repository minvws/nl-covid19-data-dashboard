import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import {
  BoundingBoxPadding,
  DynamicSizeConfiguration,
  DynamicSizeConfigurations,
  HeightAndPadding,
  OptionalBoundingBoxPadding,
} from '~/components/choropleth';

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

    const result = dynamicSizeConfiguration
      .sort((a, b) => {
        if (isDynamicConfiguration(a) && isDynamicConfiguration(b)) {
          return b.containerWidth - a.containerWidth;
        } else if (isDynamicConfiguration(a) && !isDynamicConfiguration(b)) {
          return -1;
        }
        return 1;
      })
      .find((item) => {
        if (isDynamicConfiguration(item) && isDefined(containerWidth)) {
          containerWidth >= item.containerWidth;
        }
        return true;
      });

    /**
     * This assert cannot ever trigger, since the Tuple will always return the last item, but the compiler doesn't understand this...
     */
    assert(isDefined(result), 'Cannot find valid size');

    return isDynamicConfiguration(result)
      ? ([
          result.heightAndPadding.mapHeight,
          addDefaultPaddingValues(result.heightAndPadding.padding),
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
  value: DynamicSizeConfiguration | HeightAndPadding
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
