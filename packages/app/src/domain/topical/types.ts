import { ICON_DIRECTION_DOWN, ICON_DIRECTION_UP, ICON_COLOR_RED, ICON_COLOR_GREEN } from '~/domain/topical/common';

export type TrendIconColor = typeof ICON_COLOR_RED | typeof ICON_COLOR_GREEN;
export type TrendIconDirection = typeof ICON_DIRECTION_UP | typeof ICON_DIRECTION_DOWN;

export type TrendIcon = {
  direction: TrendIconDirection | null;
  color: TrendIconColor | null;
  intensity: 1 | 2 | 3 | null;
};
