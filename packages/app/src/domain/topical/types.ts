import { ICON_DIRECTION_DOWN, ICON_DIRECTION_UP, ICON_COLOR_RED, ICON_COLOR_GREEN } from '~/domain/topical/common';

export type TrendIcon = {
  direction: typeof ICON_DIRECTION_UP | typeof ICON_DIRECTION_DOWN | null;
  color: typeof ICON_COLOR_RED | typeof ICON_COLOR_GREEN | null;
};
