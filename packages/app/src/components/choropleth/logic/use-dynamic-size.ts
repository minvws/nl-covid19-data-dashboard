import { assert } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { BoundingBoxPadding, HeightAndPadding, OptionalBoundingBoxPadding, ResponsiveSizeConfiguration, ResponsiveSizeSettings } from '~/components/choropleth';
import { space } from '~/style/theme';

export function useResponsiveSize(
  containerWidth: number,
  containerDefaultHeight: number,
  boundingBoxPadding: OptionalBoundingBoxPadding,
  responsiveSizeConfiguration?: ResponsiveSizeConfiguration
) {
  return useMemo(() => {
    if (!isDefined(responsiveSizeConfiguration)) {
      return [containerDefaultHeight, addDefaultPaddingValues(boundingBoxPadding)] as const;
    }

    const result = responsiveSizeConfiguration
      .sort((a, b) => {
        if (isResponsiveConfiguration(a) && isResponsiveConfiguration(b)) {
          return b.containerWidth - a.containerWidth;
        } else if (isResponsiveConfiguration(a) && !isResponsiveConfiguration(b)) {
          return -1;
        }
        return 1;
      })
      .find((item) => {
        if (isResponsiveConfiguration(item) && isDefined(containerWidth)) {
          return containerWidth >= item.containerWidth;
        }
        return true;
      });

    /**
     * This assert cannot ever trigger, since the Tuple will always return the last item, but the compiler doesn't understand this...
     */
    assert(isDefined(result), `[${useResponsiveSize.name}] Cannot find valid size`);

    return isResponsiveConfiguration(result)
      ? ([result.heightAndPadding.mapHeight, addDefaultPaddingValues(result.heightAndPadding.padding)] as const)
      : ([result.mapHeight, addDefaultPaddingValues(result.padding)] as const);
  }, [responsiveSizeConfiguration, boundingBoxPadding, containerDefaultHeight, containerWidth]);
}

function isResponsiveConfiguration(value: ResponsiveSizeSettings | HeightAndPadding): value is ResponsiveSizeSettings {
  return 'containerWidth' in value;
}

function addDefaultPaddingValues(optionalPadding: OptionalBoundingBoxPadding): BoundingBoxPadding {
  return {
    left: optionalPadding.left ?? space[0],
    right: optionalPadding.right ?? space[0],
    top: optionalPadding.top ?? space[0],
    bottom: optionalPadding.bottom ?? space[0],
  };
}
