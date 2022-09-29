import { Color, colors } from '@corona-dashboard/common';
import { get } from 'lodash';

export function getColor(colorPath: string | undefined) {
  if (!colorPath?.length) {
    return colors.primary as Color;
  }

  return get(
    colors,
    // ['data'].concat(colorPath.split('.')),
    colors.primary
  ) as Color;
}
