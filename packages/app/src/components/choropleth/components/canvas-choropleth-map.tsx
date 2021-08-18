import { FocusEvent, memo } from 'react';
import { ChoroplethProps, UnpackedDataItem } from '..';
import { MapType } from '../logic';
import { TooltipSettings } from '../tooltips/types';

type CanvasChoroplethMapProps<
  T extends MapType,
  K extends UnpackedDataItem<T>
> = Omit<ChoroplethProps<T, K>, 'formatTooltip' | 'tooltipPlacement'> & {
  hoverRef: React.RefObject<SVGGElement>;
  setTooltip: (tooltip: TooltipSettings<K> | undefined) => void;
  isTabInteractive: boolean;
  anchorEventHandlers: {
    onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
    onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
  };
};

export const CanvasChoroplethMap: <
  T extends MapType,
  K extends UnpackedDataItem<T>
>(
  props: CanvasChoroplethMapProps<T, K>
) => JSX.Element | null = memo((props) => {
  return 'canvas!';
});
