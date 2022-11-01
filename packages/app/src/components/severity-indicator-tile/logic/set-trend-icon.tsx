import { Down, Up } from '@corona-dashboard/icons';
import { ICON_DIRECTION_DOWN } from '~/domain/topical/common';

/**
 * Set the correction icon for specific direction that is beign passed.
 *  */

export const setTrendIcon = (direction: string) => {
  if (direction === ICON_DIRECTION_DOWN) return <Down />;
  return <Up />;
};
