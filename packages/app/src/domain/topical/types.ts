import { ICON_DIRECTION_DOWN, ICON_DIRECTION_UP } from '~/domain/topical/common';

export type TrendIcon = {
  direction: typeof ICON_DIRECTION_UP | typeof ICON_DIRECTION_DOWN;
  color: string;
};
